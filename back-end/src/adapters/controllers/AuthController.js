const AdminEntity = require('../../Domain/AdminEntity');
class AuthController {
    constructor(adminRepository, MailService, PasswordHelper, TokenHelper) {
        this.adminRepository = adminRepository;
        this.MailService = MailService;
        this.PasswordHelper = PasswordHelper;
        this.TokenHelper = TokenHelper;
    }

    async add(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const adminEntity = new AdminEntity({ name, email, password, role });
            adminEntity.validate();

            const existingAdmin = await this.adminRepository.findByEmail(adminEntity.email);

            if (existingAdmin) {
                throw new Error("Admin with this email already exists.");
            }

            adminEntity.password = await this.PasswordHelper.hashPassword(adminEntity.password);
            const admin = await this.adminRepository.add({ name, email, password, role }); 

            res.status(201).json({message:"admin added successfully", data: admin});
        } catch (error) {
            
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const admin = await this.adminRepository.findByEmail(email);
            const validated = (await this.PasswordHelper.comparePassword(password, admin.password))
            if (!admin || !validated) {
                throw new Error("Invalid email or password.");
            }

            const accessToken = this.TokenHelper.generateAccessToken({ id: admin._id, role: admin.role });
            const refreshToken = this.TokenHelper.generateRefreshToken({ id: admin._id });

            const updatedAdmin = await this.adminRepository.updateRefreshToken(admin._id, refreshToken);

            if (!updatedAdmin){
                throw new Error("Error while updating refreshToken")
            }

            const tokens = await { accessToken, refreshToken };
            res.json(tokens);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            const {id} = req.param;
            await this.adminRepository.updateRefreshToken(id, null);
            res.json({ message: "Logged out successfully." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                throw new Error("Admin with this email does not exist.");
            }

            const resetToken = this.TokenHelper.generateResetToken();
            const expiryTime = Date.now() + 3600 * 1000; 
            await this.adminRepository.updateResetToken(admin._id, resetToken, expiryTime);

            await this.MailService.sendPasswordResetEmail(email, resetToken);

            res.status(200).json({ message: "Reset email sent successfully." });

        } catch (error) {

            console.error("Error in AuthController.forgotPassword:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { resetToken, newPassword } = req.body;

            
            const admin = await this.adminRepository.findByResetToken(resetToken);

            if (!admin || admin.resetTokenExpiry < Date.now()) {
                throw new Error("Invalid or expired reset token.");
            }

            const hashedPassword = await this.PasswordHelper.hashPassword(newPassword);

            const adminEntity = new AdminEntity({ password: newPassword, resetToken });

            adminEntity.validateResetPasswordFields();

            const updatedAdmin = await this.adminRepository.updatePassword(admin._id, hashedPassword);

            if (!updatedAdmin){
                throw new Error("Error while updating oassword")
            }

            res.status(200).json({ message: "Password updated successfully." });
            
        } catch (error) {
            console.error("Error in AuthController.resetPassword:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const {refreshToken} = req.body.refreshToken;
            const payload = this.TokenHelper.verifyToken(refreshToken);
            const admin = await this.adminRepository.findById(payload.id);

            if (!admin || admin.refreshToken !== refreshToken) {
                throw new Error("Invalid refresh token.");
            }

            const newAccessToken = await this.TokenHelper.generateAccessToken({ id: admin._id, role: admin.role });
            res.json({ accessToken: newAccessToken });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res){
        const {id} = req.id;

        const deleted = await this.adminRepository.delete(id)
        res.status(200).json(deleted)
    }
}
module.exports = AuthController;
