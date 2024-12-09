
const Admin = require("../domain/models/Admin");

// Middleware to restrict signup access if admin exists
const adminExistsMiddleware = async (req, res, next) => {
  try {
    const adminExists = await Admin.findOne({ role: "admin" });
    if (adminExists) {
      return res
        .status(403)
        .json({ message: "Admin signup is already completed." });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error checking admin existence",
      error: error.message,
    });
  }
};

module.exports = adminExistsMiddleware;
