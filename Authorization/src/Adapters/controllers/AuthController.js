
const Admin = require("../../Domain/models/Admin");
const bcrypt = require("bcryptjs");

class AuthController {
  // Signup logic
  async signup(req, res) {
    try {
      const { username, password, confirmPassword } = req.body;

      // Ensure password and confirmPassword match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      // Check if an admin already exists
      const existingAdmin = await Admin.findOne({ role: "admin" });
      if (existingAdmin) {
        // For API-based frontend
        return res
          .status(403)
          .json({ message: "Admin signup is already completed." });

        // Optional redirect (uncomment for server-rendered apps)
        // return res.redirect('/login');
      }

      // Create the first admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        username,
        password: hashedPassword,
        role: "admin", // First user is assigned the admin role
      });

      await newAdmin.save();

      // For API-based frontend
      res.status(201).json({
        message: "Admin account created successfully! Please log in.",
      });

      // Optional redirect (uncomment for server-rendered apps)
      // res.redirect('/login');
    } catch (error) {
      res.status(500).json({
        message: "Error creating admin account",
        error: error.message,
      });
    }
  }

  // Login logic
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });

      if (!admin) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ message: "Login successful!" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }
}

module.exports = new AuthController();
