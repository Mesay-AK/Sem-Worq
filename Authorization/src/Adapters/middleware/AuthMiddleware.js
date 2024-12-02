const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach admin info to request
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = AuthMiddleware;
