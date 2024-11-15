const Admin = require("../../Domain/models/Admin");

class AdminRepository {
  // Find an admin by username
  async findByUsername(username) {
    return await Admin.findOne({ username });
  }

  // Create a new admin user
  async create(adminData) {
    const admin = new Admin(adminData);
    return await admin.save();
  }
}

module.exports = new AdminRepository();
