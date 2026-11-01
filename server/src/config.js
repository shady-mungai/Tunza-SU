import path from "node:path";

function positiveInteger(value, fallback) {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer, received: ${value}`);
  }
  return parsed;
}

function csv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function loadConfig(env = process.env) {
  const jwtSecret = env.JWT_SECRET?.trim();
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }

  return {
    nodeEnv: env.NODE_ENV || "development",
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
      directory: path.resolve(env.UPLOAD_DIR || "uploads"),
      maxBytes: positiveInteger(env.MAX_UPLOAD_BYTES, 5 * 1024 * 1024),
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
