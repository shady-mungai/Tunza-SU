import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import request from "supertest";

import { createApp } from "../src/createApp.js";
import { createTokenService } from "../src/security/tokens.js";

function createFixture() {
  const users = [];
  const reports = [];
  let nextUserId = 1;
  let nextReportId = 1;

  const userRepository = {
    async findByIdentity(email, admissionNumber) {
      return (
        users.find(
          (user) =>
            (email && user.email === email) ||
            (admissionNumber && user.admission_number === admissionNumber)
        ) || null
      );
    },
    async findByEmail(email) {
      return users.find((user) => user.email === email) || null;
    },
    async findPublicById(id) {
      return users.find((user) => user.id === Number(id)) || null;
    },
    async createPasswordUser(input) {
      const user = {
        id: nextUserId++,
        name: input.name,
        email: input.email,
        admission_number: input.admissionNumber,
        phone_number: input.phoneNumber,
        password: input.password,
        role: "student",
      };
      users.push(user);
      return user;
    },
    async createGoogleUser(identity) {
      const user = {
        id: nextUserId++,
        name: identity.name,
        email: identity.email,
        admission_number: `GGL-${identity.subject}`,
        role: "student",
      };
      users.push(user);
      return user;
    },
    async linkGoogleIdentity(id, subject) {
      const user = users.find((item) => item.id === Number(id));
      if (!user) return null;
      user.google_subject = subject;
      return user;
    },
    async createPrivilegedUser(input) {
      const user = {
        id: nextUserId++,
        name: input.name,
        email: input.email,
        admission_number: input.admissionNumber,
        phone_number: input.phoneNumber,
        password: input.password,
        role: input.role,
      };
      users.push(user);
      return user;
    },
    async list() {
      return users;
    },
    async delete(id) {
      const index = users.findIndex((user) => user.id === Number(id));
      if (index < 0) return false;
      users.splice(index, 1);
      return true;
    },
  };

  const reportRepository = {
    lastCreated: null,
    async create(input) {
      this.lastCreated = { id: nextReportId++, ...input };
      reports.push(this.lastCreated);
      return { id: this.lastCreated.id };
    },
    async listByUser(userId) {
      return reports.filter((report) => report.userId === Number(userId));
    },
    async listAssigned(maintenanceId) {
      return reports.filter((report) => report.assigned_to === Number(maintenanceId));
    },
    async findById(id) {
      return reports.find((report) => report.id === Number(id)) || null;
    },
    async updateStatus(id, status) {
      const report = reports.find((item) => item.id === Number(id));
      if (!report) return false;
      report.status = status;
      return true;
    },
    async assign(id, maintenanceId) {
      const report = reports.find((item) => item.id === Number(id));
      if (!report) return false;
      report.assigned_to = maintenanceId;
      return true;
    },
    async delete(id) {
      const index = reports.findIndex((report) => report.id === Number(id));
      if (index < 0) return false;
      reports.splice(index, 1);
      return true;
    },
    async stats() {
      return { activeReports: 0, resolvedReports: 0, pendingReports: reports.length };
    },
    async listActive() {
      return reports;
    },
  };

  const tokenService = createTokenService({
    secret: "test-secret-that-is-at-least-thirty-two-characters",
    issuer: "tunza-test",
    audience: "tunza-test-client",
    expiresIn: "1h",
  });
  const config = {
    nodeEnv: "test",
    trustProxy: false,
    allowedOrigins: ["http://localhost:8081"],
    uploads: {
      directory: path.join(os.tmpdir(), "tunza-su-tests"),
      maxBytes: 1024,
    },
  };
  const verifyGoogleIdToken = async () => ({
    subject: "google-123",
    name: "Google Student",
    email: "google@student.example",
  });

  const app = createApp({
    config,
    repositories: { users: userRepository, reports: reportRepository },
    tokenService,
    verifyGoogleIdToken,
  });

  function addUser(role, overrides = {}) {
    const user = {
      id: nextUserId++,
      name: `${role} user`,
      email: `${role}${nextUserId}@example.com`,
      admission_number: `${role}-${nextUserId}`,
      role,
      ...overrides,
    };
    users.push(user);
    return { user, token: tokenService.sign(user) };
  }

  return {
    app,
    users,
    reports,
    reportRepository,
    addUser,
  };
}

test("health endpoint responds with security headers", async () => {
  const { app } = createFixture();
  const response = await request(app).get("/health").expect(200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.headers["x-content-type-options"], "nosniff");
  assert.equal(response.headers["x-powered-by"], undefined);
});

test("admin endpoints require authentication", async () => {
  const { app } = createFixture();
  await request(app).get("/allUsers").expect(401);
});

test("public registration always creates a student session", async () => {
  const { app } = createFixture();
  const response = await request(app)
    .post("/register")
    .send({
      name: "Test Student",
      email: "student@example.com",
      admission_number: "123456",
      phone_number: "+254700000000",
      password: "StrongPass1!",
      role: "admin",
    })
    .expect(201);

  assert.equal(response.body.user.role, "student");
  assert.equal(response.body.user.password, undefined);
  assert.equal(typeof response.body.accessToken, "string");

  const me = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${response.body.accessToken}`)
    .expect(200);
  assert.equal(me.body.user.email, "student@example.com");
});

test("students cannot call administrator endpoints", async () => {
  const { app, addUser } = createFixture();
  const { token } = addUser("student");
  await request(app)
    .get("/allUsers")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);
});

test("authorization uses the current database role, not a stale token role", async () => {
  const { app, addUser } = createFixture();
  const { user, token } = addUser("admin");
  user.role = "student";

  await request(app)
    .get("/allUsers")
    .set("Authorization", `Bearer ${token}`)
    .expect(403);
});

test("sessions stop working after an account is deleted", async () => {
  const { app, users, addUser } = createFixture();
  const { user, token } = addUser("student");
  users.splice(users.findIndex((item) => item.id === user.id), 1);

  await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${token}`)
    .expect(401);
});

test("report ownership comes from the authenticated session", async () => {
  const { app, addUser, reportRepository } = createFixture();
  const { user, token } = addUser("student");
  await request(app)
    .post("/addReport")
    .set("Authorization", `Bearer ${token}`)
    .send({
      user_id: 9999,
      title: "Broken desk",
      description: "The desk leg is broken and unsafe.",
      location: "Library",
      category: "Furniture",
      priority: "High",
    })
    .expect(201);

  assert.equal(reportRepository.lastCreated.userId, user.id);
  assert.equal(reportRepository.lastCreated.priority, "high");
});

test("maintenance staff can update only reports assigned to them", async () => {
  const { app, addUser, reports } = createFixture();
  const { user, token } = addUser("maintenance_staff");
  reports.push({ id: 1, userId: 99, assigned_to: user.id + 1, status: "pending" });

  await request(app)
    .put("/reports/1")
    .set("Authorization", `Bearer ${token}`)
    .send({ status: "completed" })
    .expect(403);

  reports[0].assigned_to = user.id;
  await request(app)
    .put("/reports/1")
    .set("Authorization", `Bearer ${token}`)
    .send({ status: "completed" })
    .expect(200);
  assert.equal(reports[0].status, "resolved");
});

test("only administrators can assign reports to maintenance staff", async () => {
  const { app, addUser, reports } = createFixture();
  const { token: adminToken } = addUser("admin");
  const { user: maintenanceUser } = addUser("maintenance_staff");
  const { token: studentToken } = addUser("student");
  reports.push({ id: 1, userId: 99, assigned_to: null, status: "pending" });

  await request(app)
    .put("/reports/1/assignment")
    .set("Authorization", `Bearer ${studentToken}`)
    .send({ maintenance_id: maintenanceUser.id })
    .expect(403);

  await request(app)
    .put("/reports/1/assignment")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ maintenance_id: maintenanceUser.id })
    .expect(200);

  assert.equal(reports[0].assigned_to, maintenanceUser.id);
});

test("Google sign-in accepts only a server-verified identity token", async () => {
  const { app } = createFixture();
  const response = await request(app)
    .post("/auth/google")
    .send({ idToken: "x".repeat(200) })
    .expect(200);
  assert.equal(response.body.user.email, "google@student.example");
  assert.equal(response.body.user.role, "student");
});

test("Google sign-in links a verified identity to an existing student", async () => {
  const { app, addUser } = createFixture();
  const { user } = addUser("student", { email: "google@student.example" });

  await request(app)
    .post("/auth/google")
    .send({ idToken: "x".repeat(200) })
    .expect(200);

  assert.equal(user.google_subject, "google-123");
});

test("Google sign-in cannot be used for privileged accounts", async () => {
  const { app, addUser } = createFixture();
  addUser("admin", { email: "google@student.example" });

  await request(app)
    .post("/auth/google")
    .send({ idToken: "x".repeat(200) })
    .expect(403);
});

test("unsupported upload types are rejected", async () => {
  const { app, addUser } = createFixture();
  const { token } = addUser("student");
  await request(app)
    .post("/addReport")
    .set("Authorization", `Bearer ${token}`)
    .field("title", "Unsafe upload")
    .field("description", "This report includes an invalid attachment type.")
    .field("location", "Library")
    .field("category", "Other")
    .field("priority", "low")
    .attach("image", Buffer.from("not an image"), {
      filename: "payload.txt",
      contentType: "text/plain",
    })
    .expect(415);
});

test("spoofed image MIME types are rejected by file signature", async () => {
  const { app, addUser } = createFixture();
  const { token } = addUser("student");
  await request(app)
    .post("/addReport")
    .set("Authorization", `Bearer ${token}`)
    .field("title", "Spoofed upload")
    .field("description", "The declared MIME type does not match the file contents.")
    .field("location", "Library")
    .field("category", "Other")
    .field("priority", "low")
    .attach("image", Buffer.from("not really a jpeg"), {
      filename: "payload.jpg",
      contentType: "image/jpeg",
    })
    .expect(415);
});
