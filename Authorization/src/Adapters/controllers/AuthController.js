const AdminAuthUseCase = require("../../Usecases/AdminAuthUseCase");

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const token = await AdminAuthUseCase.login(username, password);
      res.json({ token });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
