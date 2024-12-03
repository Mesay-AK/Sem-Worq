const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Admin schema definition
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin", // Admin role by default
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});
// Hash password before saving to DB
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Admin", adminSchema);