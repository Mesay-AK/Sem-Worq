import TokenHelper from "../../Infrastructures/helpers/token-helper.js";

class AuthMiddleware {
  // If TokenHelper isn't static, pass it here
  constructor() {
    // Binding ensures 'this' works if you use it later
    this.authMiddleware = this.authMiddleware.bind(this);
  }

  async authMiddleware(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "Access token is missing or invalid." });
      }

      const token = authHeader.split(" ")[1];
      // verifyAccessToken should be a static method in TokenHelper
      const payload = TokenHelper.verifyAccessToken(token);

      if (!payload) {
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      req.user = payload;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Authentication failed: " + error.message });
    }
  }

  async selfOnlyMiddleware(req, res, next) {
    const { id } = req.params;
    const userId = req.user?.id;

    if (req.user?.role === "super-admin") return next();

    // Convert both to strings to avoid Object vs String comparison bugs
    if (!userId || id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized: You can only modify your own profile." });
    }
    next();
  }

  adminOnlyMiddleware(req, res, next) {
    const role = req.user?.role;
    if (role === "admin" || role === "super-admin") return next();

    return res.status(403).json({ error: "Access denied. Admins only." });
  }
}

export default AuthMiddleware; 
