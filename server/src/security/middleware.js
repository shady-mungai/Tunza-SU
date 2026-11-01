export function createAuthMiddleware(tokenService, users) {
  async function authenticate(req, res, next) {
    const [scheme, token] = String(req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let claims;
    try {
      claims = tokenService.verify(token);
    } catch {
      return res.status(401).json({ message: "Session is invalid or expired" });
    }

    try {
      const currentUser = await users.findPublicById(claims.id);
      if (!currentUser) {
        return res.status(401).json({ message: "Account no longer exists" });
      }
      req.user = { id: Number(currentUser.id), role: currentUser.role };
      return next();
    } catch (error) {
      return next(error);
    }
  }

  function authorize(...roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "You do not have permission" });
      }
      return next();
    };
  }

  return { authenticate, authorize };
}
