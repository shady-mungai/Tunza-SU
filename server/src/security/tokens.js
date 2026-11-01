import jwt from "jsonwebtoken";

const roles = new Set(["student", "maintenance_staff", "admin"]);

export function createTokenService(config) {
  return {
    sign(user) {
      return jwt.sign(
        { role: user.role },
        config.secret,
        {
          subject: String(user.id),
          issuer: config.issuer,
          audience: config.audience,
          expiresIn: config.expiresIn,
        }
      );
    },

    verify(token) {
      const payload = jwt.verify(token, config.secret, {
        issuer: config.issuer,
        audience: config.audience,
      });

      const id = Number(payload.sub);
      if (!Number.isSafeInteger(id) || id <= 0 || !roles.has(payload.role)) {
        throw new Error("Token contains invalid claims");
      }

      return {
        id,
        role: payload.role,
      };
    },
  };
}
