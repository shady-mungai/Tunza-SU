import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import multer from "multer";
import bcrypt from "bcryptjs";
import { fileTypeFromBuffer } from "file-type";

import { createAuthMiddleware } from "./security/middleware.js";
import {
  assignmentSchema,
  googleSchema,
  idSchema,
  loginSchema,
  parse,
  privilegedUserSchema,
  registrationSchema,
  reportSchema,
  statusSchema,
} from "./schemas.js";

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const dummyPasswordHash =
  "$2b$12$sgidt8xKVOS/k//pofc7POXWv/Fs2XvnR.Tf/fh6t1d5Fkcs87hUy";

function publicUser(user) {
  if (!user) return null;
  const { password, totp_secret, google_subject, ...safeUser } = user;
  return safeUser;
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function sessionResponse(user, tokenService) {
  const safeUser = publicUser(user);
  return {
    success: true,
    user: safeUser,
    accessToken: tokenService.sign(safeUser),
  };
}

async function presentReport(report, storage) {
  if (!report) return report;
  const { image_key: imageKey, ...publicReport } = report;
  return {
    ...publicReport,
    image_url: await storage.urlFor(imageKey, report.image_url),
  };
}

async function presentReports(reports, storage) {
  return Promise.all(reports.map((report) => presentReport(report, storage)));
}

function notifyInBackground(notification) {
  void notification.catch((error) => {
    console.error("Background task failed", error);
  });
}

export function createApp({
  config,
  repositories,
  tokenService,
  verifyGoogleIdToken,
  storage,
  notifier,
}) {
  const app = express();
  const { authenticate, authorize } = createAuthMiddleware(
    tokenService,
    repositories.users
  );
  const rateLimitsEnabled = config.nodeEnv !== "test";

  app.disable("x-powered-by");
  if (config.trustProxy) app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true);
        return callback(Object.assign(new Error("Origin is not allowed"), { status: 403 }));
      },
    })
  );
  app.use(express.json({ limit: "100kb" }));
  if (storage.driver === "local") {
    app.use(
      "/uploads",
      express.static(storage.localDirectory, { dotfiles: "deny" })
    );
  }

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => !rateLimitsEnabled,
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 12,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skip: () => !rateLimitsEnabled,
    message: { message: "Too many authentication attempts. Try again later." },
  });
  app.use(apiLimiter);

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.uploads.maxBytes, files: 1 },
    fileFilter(req, file, callback) {
      if (!allowedImageTypes.has(file.mimetype)) {
        return callback(Object.assign(new Error("Only JPEG, PNG, and WebP images are allowed"), {
          status: 415,
        }));
      }
      return callback(null, true);
    },
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post(
    "/register",
    authLimiter,
    asyncRoute(async (req, res) => {
      const input = parse(registrationSchema, req.body);
      const existing = await repositories.users.findByIdentity(
        input.email,
        input.admission_number
      );
      if (existing) return res.status(409).json({ message: "Account already exists" });

      const user = await repositories.users.createPasswordUser({
        name: input.name,
        email: input.email,
        admissionNumber: input.admission_number,
        phoneNumber: input.phone_number,
        password: await bcrypt.hash(input.password, 12),
      });
      return res.status(201).json(sessionResponse(user, tokenService));
    })
  );

  app.post(
    "/login",
    authLimiter,
    asyncRoute(async (req, res) => {
      const input = parse(loginSchema, req.body);
      const user = await repositories.users.findByIdentity(
        input.email,
        input.admission_number
      );
      const passwordMatches = await bcrypt.compare(
        input.password,
        user?.password || dummyPasswordHash
      );
      if (!user?.password || !passwordMatches) {
        return res.status(401).json({ message: "Invalid sign-in details" });
      }
      return res.json(sessionResponse(user, tokenService));
    })
  );

  app.post(
    "/auth/google",
    authLimiter,
    asyncRoute(async (req, res) => {
      const { idToken } = parse(googleSchema, req.body);
      const identity = await verifyGoogleIdToken(idToken);
      let user = await repositories.users.findByEmail(identity.email);
      if (user && user.role !== "student") {
        return res.status(403).json({
          message: "Privileged accounts must use password sign-in",
        });
      }
      if (user?.google_subject && user.google_subject !== identity.subject) {
        return res.status(401).json({ message: "Google account does not match" });
      }
      if (user && !user.google_subject) {
        user = await repositories.users.linkGoogleIdentity(user.id, identity.subject);
      }
      if (!user) user = await repositories.users.createGoogleUser(identity);
      return res.json(sessionResponse(user, tokenService));
    })
  );

  app.get(
    "/auth/me",
    authenticate,
    asyncRoute(async (req, res) => {
      const user = await repositories.users.findPublicById(req.user.id);
      if (!user) return res.status(401).json({ message: "Account no longer exists" });
      return res.json({ user });
    })
  );

  app.post(
    "/users",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => {
      const input = parse(privilegedUserSchema, req.body);
      const existing = await repositories.users.findByIdentity(
        input.email,
        input.admission_number
      );
      if (existing) return res.status(409).json({ message: "Account already exists" });
      const user = await repositories.users.createPrivilegedUser({
        name: input.name,
        email: input.email,
        admissionNumber: input.admission_number,
        phoneNumber: input.phone_number,
        role: input.role,
        password: await bcrypt.hash(input.password, 12),
      });
      return res.status(201).json({ success: true, user });
    })
  );

  app.get(
    "/allUsers",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => {
      const users = await repositories.users.list();
      return res.json({ success: true, users: users.map(publicUser) });
    })
  );

  app.delete(
    "/user/:id",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => {
      const id = parse(idSchema, req.params.id);
      if (id === req.user.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      const deleted = await repositories.users.delete(id);
      return deleted
        ? res.json({ success: true, message: "User deleted successfully" })
        : res.status(404).json({ message: "User not found" });
    })
  );

  app.post(
    "/addReport",
    authenticate,
    upload.single("image"),
    asyncRoute(async (req, res) => {
      const input = parse(reportSchema, req.body);
      let storedImage = null;
      if (req.file) {
        const detectedType = await fileTypeFromBuffer(req.file.buffer);
        if (!detectedType || !allowedImageTypes.has(detectedType.mime)) {
          throw Object.assign(new Error("Uploaded file content is not a supported image"), {
            status: 415,
          });
        }
        storedImage = await storage.save({
          buffer: req.file.buffer,
          mime: detectedType.mime,
          extension: allowedImageTypes.get(detectedType.mime),
        });
      }
      let report;
      try {
        report = await repositories.reports.create({
          ...input,
          userId: req.user.id,
          imageUrl: storage.driver === "local" ? storedImage?.url || null : null,
          imageKey: storedImage?.key || null,
        });
      } catch (error) {
        if (storedImage?.key) await storage.remove(storedImage.key).catch(() => {});
        throw error;
      }
      const responseReport = {
        ...report,
        ...input,
        status: "pending",
        image_url: storedImage?.url || null,
      };
      const reporter = await repositories.users.findPublicById(req.user.id);
      notifyInBackground(notifier.reportCreated({ report: responseReport, reporter }));
      return res.status(201).json({
        success: true,
        message: "Report added successfully",
        report: responseReport,
      });
    })
  );

  app.get(
    "/userReports",
    authenticate,
    asyncRoute(async (req, res) => {
      const requestedId = req.query.user_id ? parse(idSchema, req.query.user_id) : req.user.id;
      if (requestedId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "You cannot view another user's reports" });
      }
      const reports = await repositories.reports.listByUser(requestedId);
      return res.json({ success: true, reports: await presentReports(reports, storage) });
    })
  );

  app.get(
    "/assignedReports",
    authenticate,
    authorize("maintenance_staff", "admin"),
    asyncRoute(async (req, res) => {
      const maintenanceId =
        req.user.role === "admin" && req.query.maintenance_id
          ? parse(idSchema, req.query.maintenance_id)
          : req.user.id;
      const reports = await repositories.reports.listAssigned(maintenanceId);
      return res.json({ success: true, reports: await presentReports(reports, storage) });
    })
  );

  app.put(
    "/reports/:id",
    authenticate,
    authorize("maintenance_staff", "admin"),
    asyncRoute(async (req, res) => {
      const id = parse(idSchema, req.params.id);
      const { status } = parse(statusSchema, req.body);
      const report = await repositories.reports.findById(id);
      if (!report) return res.status(404).json({ message: "Report not found" });
      if (req.user.role !== "admin" && Number(report.assigned_to) !== req.user.id) {
        return res.status(403).json({ message: "This report is not assigned to you" });
      }
      const previousStatus = report.status;
      await repositories.reports.updateStatus(id, status);
      if (status === "resolved" && previousStatus !== "resolved") {
        const resolvedReport = await repositories.reports.findDetailedById(id);
        notifyInBackground(notifier.reportResolved({ report: resolvedReport }));
      }
      return res.json({ success: true, message: "Status updated successfully" });
    })
  );

  app.put(
    "/reports/:id/assignment",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => {
      const id = parse(idSchema, req.params.id);
      const { maintenance_id: maintenanceId } = parse(assignmentSchema, req.body);
      const assignee = await repositories.users.findPublicById(maintenanceId);
      if (!assignee || assignee.role !== "maintenance_staff") {
        return res.status(400).json({ message: "Assignee must be maintenance staff" });
      }
      const updated = await repositories.reports.assign(id, maintenanceId);
      return updated
        ? res.json({ success: true, message: "Report assigned successfully" })
        : res.status(404).json({ message: "Report not found" });
    })
  );

  app.delete(
    "/report/:id",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => {
      const id = parse(idSchema, req.params.id);
      const report = await repositories.reports.findById(id);
      if (!report) return res.status(404).json({ message: "Report not found" });
      const deleted = await repositories.reports.delete(id);
      if (deleted && report.image_key) {
        notifyInBackground(storage.remove(report.image_key));
      }
      return deleted
        ? res.json({ success: true, message: "Report deleted successfully" })
        : res.status(404).json({ message: "Report not found" });
    })
  );

  app.get(
    "/reportStats",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => res.json(await repositories.reports.stats()))
  );

  app.get(
    "/activeReports",
    authenticate,
    authorize("admin"),
    asyncRoute(async (req, res) => {
      const reports = await repositories.reports.listActive();
      return res.json({ success: true, reports: await presentReports(reports, storage) });
    })
  );

  app.use((req, res) => res.status(404).json({ message: "Route not found" }));

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "Image exceeds the upload limit" });
    }
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "A record with those details already exists" });
    }
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({ message: "This record is still referenced and cannot be deleted" });
    }

    const status = Number(error.status) || 500;
    if (status >= 500) console.error(error);
    return res.status(status).json({
      message: status >= 500 ? "Internal server error" : error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  });

  return app;
}
