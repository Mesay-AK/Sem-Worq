const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminRepository = require("../Adapters/repositories/AdminRepository");

class AdminAuthUseCase {
  async login(username, password) {
    const admin = await AdminRepository.findByUsername(username);

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
}

module.exports = new AdminAuthUseCase();
