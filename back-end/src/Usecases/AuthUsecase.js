const AdminEntity = require('../Domain/AdminEntity');

class AuthUseCase {
    constructor(adminRepository, MailService, PasswordHelper, TokenHelper) {
        this.adminRepository = adminRepository;
        this.MailService = MailService;
        this.PasswordHelper = PasswordHelper;
        this.TokenHelper = TokenHelper;
    }

    async add(adminData) {
        const adminEntity = new AdminEntity(adminData);
        adminEntity.validate();

        const existingAdmin = await this.adminRepository.findByEmail(adminEntity.email);

        if (existingAdmin) {
            throw new Error("Admin with this email already exists.");
        }

        adminEntity.password = await this.PasswordHelper.hashPassword(adminEntity.password);
        return await this.adminRepository.add(adminEntity);

    }

    async login(email, password) {

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

        return { accessToken, refreshToken };
    }

    async logout(id) {
        return await this.adminRepository.updateRefreshToken(id, null);
    }

    async forgotPassword(email) {
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error("Admin with this email does not exist.");
        }

        const resetToken = this.TokenHelper.generateResetToken();
        const expiryTime = Date.now() + 3600 * 1000; // 1 

        await this.adminRepository.updateResetToken(admin._id, resetToken, expiryTime);

        await this.MailService.sendPasswordResetEmail(email, resetToken);
    }

    async resetPassword(resetToken, newPassword) {

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
    }

    async refreshToken(refreshToken) {

        try {
            const payload = this.TokenHelper.verifyToken(refreshToken);
            const admin = await this.adminRepository.findById(payload.id);

            if (!admin || admin.refreshToken !== refreshToken) {
                throw new Error("Invalid refresh token.");
            }

            return this.TokenHelper.generateAccessToken({ id: admin._id, role: admin.role });
        } catch (error) {
            throw new Error("Failed to refresh token.");
        }
    }

    async delete(id){
        return await this.adminRepository.delete(id)
    }
}
module.exports = AuthUseCase;
