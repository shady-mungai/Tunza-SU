import path from "node:path";

function positiveInteger(value, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer, received: ${value}`);
  }
  return parsed;
}

function ratio(value, fallback = 0) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error(`Expected a number between 0 and 1, received: ${value}`);
  }
  return parsed;
}

function csv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function boolean(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

function required(value, name) {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`${name} is required`);
  return normalized;
}

export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || "development";
  const jwtSecret = env.JWT_SECRET?.trim();
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }

  const storageDriver = env.STORAGE_DRIVER || "local";
  if (!["local", "s3"].includes(storageDriver)) {
    throw new Error("STORAGE_DRIVER must be local or s3");
  }
  if (
    Boolean(env.S3_ACCESS_KEY_ID) !== Boolean(env.S3_SECRET_ACCESS_KEY)
  ) {
    throw new Error(
      "S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be configured together"
    );
  }

  const smtpEnabled = Boolean(env.SMTP_HOST?.trim());
  if (smtpEnabled && Boolean(env.SMTP_USER) !== Boolean(env.SMTP_PASSWORD)) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be configured together");
  }

  return {
    nodeEnv,
    port: positiveInteger(env.PORT, 4000),
    trustProxy: env.TRUST_PROXY === "true" || env.TRUST_PROXY === "1",
    allowedOrigins: csv(env.ALLOWED_ORIGINS || env.CLIENT_ORIGIN),
    jwt: {
      secret: jwtSecret,
      issuer: env.JWT_ISSUER || "tunza-su-api",
      audience: env.JWT_AUDIENCE || "tunza-su-mobile",
      expiresIn: env.ACCESS_TOKEN_TTL || "8h",
    },
    google: {
      clientIds: csv(env.GOOGLE_CLIENT_IDS),
      hostedDomain: env.GOOGLE_HOSTED_DOMAIN?.trim() || null,
    },
    uploads: {
      maxBytes: positiveInteger(env.MAX_UPLOAD_BYTES, 5 * 1024 * 1024),
    },
    storage: {
      driver: storageDriver,
      localDirectory: path.resolve(env.UPLOAD_DIR || "uploads"),
      s3:
        storageDriver === "s3"
          ? {
              bucket: required(env.S3_BUCKET, "S3_BUCKET"),
              region: required(env.S3_REGION, "S3_REGION"),
              endpoint: env.S3_ENDPOINT?.trim() || null,
              forcePathStyle: boolean(env.S3_FORCE_PATH_STYLE),
              accessKeyId: env.S3_ACCESS_KEY_ID?.trim() || null,
              secretAccessKey: env.S3_SECRET_ACCESS_KEY?.trim() || null,
              prefix: (env.S3_PREFIX || "reports").replace(/^\/+|\/+$/g, ""),
              publicBaseUrl: env.S3_PUBLIC_BASE_URL?.trim() || null,
              signedUrlTtlSeconds: positiveInteger(
                env.S3_SIGNED_URL_TTL_SECONDS,
                900
              ),
            }
          : null,
    },
    notifications: {
      enabled: smtpEnabled,
      host: env.SMTP_HOST?.trim() || null,
      port: positiveInteger(env.SMTP_PORT, 587),
      secure: boolean(env.SMTP_SECURE, Number(env.SMTP_PORT || 587) === 465),
      user: env.SMTP_USER?.trim() || null,
      password: env.SMTP_PASSWORD || null,
      from: smtpEnabled ? required(env.MAIL_FROM, "MAIL_FROM") : null,
      adminRecipients: csv(env.NOTIFICATION_ADMIN_EMAILS),
    },
    observability: {
      dsn: env.SENTRY_DSN?.trim() || null,
      environment: env.SENTRY_ENVIRONMENT?.trim() || nodeEnv,
      release: env.RELEASE_VERSION?.trim() || null,
      tracesSampleRate: ratio(env.SENTRY_TRACES_SAMPLE_RATE, 0),
    },
    database: {
      host: env.MYSQL_HOST || "localhost",
      port: positiveInteger(env.MYSQL_PORT, 3306),
      database: env.MYSQL_DATABASE || "tunza_su",
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
    },
  };
}
