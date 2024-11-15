const express = require("express");
const AuthController = require("./Adapters/controllers/AuthController");
const AuthMiddleware = require("./Adapters/middleware/AuthMiddleware");

const router = express.Router();

// Public route for login
router.post("/login", AuthController.login);

// Protected route (only accessible with a valid JWT)
router.get("/protected-route", AuthMiddleware, (req, res) => {
  res.send("This is a protected route for admins only.");
});

module.exports = router;
