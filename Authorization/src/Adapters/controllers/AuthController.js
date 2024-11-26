const Admin = require("../../Domain/models/Admin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../../utils/emailService");

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
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: "Admin not found." });

      const resetToken = crypto.randomBytes(32).toString("hex");
      admin.resetToken = resetToken;
      admin.resetTokenExpiry = Date.now() + 3600000;

      await admin.save();

      await sendPasswordResetEmail(admin.email, resetToken);

      res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error sending reset email", error: error.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      const admin = await Admin.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!admin)
        return res.status(400).json({ message: "Invalid or expired token." });

      admin.password = newPassword;
      admin.resetToken = null;
      admin.resetTokenExpiry = null;

      await admin.save();

      res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error resetting password", error: error.message });
    }
  }
}

module.exports = new AuthController();
