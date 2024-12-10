const AdminEntity = require('../../Domain/AdminEntity');
class AuthController {
    constructor(authUseCase) {
        this.authUseCase = authUseCase;
    }

    async add(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const admin = await this.authUseCase.add({ name, email, password, role });

            res.status(201).json({message:"admin added successfully", data: admin});
        } catch (error) {
            
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const tokens = await this.authUseCase.login(email, password);
            res.json(tokens);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            await this.authUseCase.logout(req.user.id);
            res.json({ message: "Logged out successfully." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {

            const { email } = req.body;
            await this.adminUseCase.forgotPassword(email);

            res.status(200).json({ message: "Reset email sent successfully." });

        } catch (error) {

            console.error("Error in AuthController.forgotPassword:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;
            await this.adminUseCase.resetPassword(resetToken, newPassword);

            res.status(200).json({ message: "Password updated successfully." });
            
        } catch (error) {
            console.error("Error in AuthController.resetPassword:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const newAccessToken = await this.authUseCase.refreshToken(req.body.refreshToken);
            res.json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res){
        const {id} = req.id;

        const deleted = await this.authUseCase.delete(id)
        res.status(200).json(deleted)
    }
}
module.exports = AuthController;
