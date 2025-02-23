const AdminEntity = require('../../Domain/AdminEntity');
const crypto = require('crypto');

class AuthController {
    constructor(adminRepository, MailService, PasswordHelper, TokenHelper) {
        this.adminRepository = adminRepository;
        this.MailService = MailService;
        this.PasswordHelper = PasswordHelper;
        this.TokenHelper = TokenHelper;
    }

    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;

            const adminEntity = new AdminEntity({ name, email, password, role });
            adminEntity.validate();

            const existingAdmin = await this.adminRepository.findByEmail(adminEntity.email);

            if (existingAdmin) {
                throw new Error("Admin with this email already exists.");
            }

            const hashedPassword = await this.PasswordHelper.hashPassword(adminEntity.password);

            adminEntity.password = hashedPassword;

            const admin = await this.adminRepository.add(adminEntity); 

            res.status(201).json({message:"admin added successfully", data: admin});
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                throw new Error("Invalid email or password.");
            }

            const validated = await this.PasswordHelper.comparePassword(password, admin.password);

            if (!validated) {
                throw new Error("Invalid email or password.");
            }

            const accessToken = this.TokenHelper.generateAccessToken({ id: admin._id, role: admin.role, email:admin.email });
            const refreshToken = await this.TokenHelper.generateRefreshToken({ id: admin._id, email: admin.email });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'Strict',
                path: '/',
            });

            console.log('generated token',accessToken)

            res.status(200).json({ token: accessToken, user: admin });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error("Refresh token is required.");
            }

            const payload = await this.TokenHelper.validateRefreshToken(refreshToken);

            const newAccessToken =await this.TokenHelper.generateAccessToken({ id: payload.id, role: payload.role, email:admin.email });

            res.json({ token: newAccessToken });

        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            const { id } = req.params;
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                throw new Error("Refresh token is required.");
            }

            await this.TokenHelper.validateRefreshToken(refreshToken);
            await this.TokenHelper.deleteRefreshToken(id);
            res.json({ message: "Logged out successfully." });
            
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
        return res.status(400).json({ error: "Reset token and new password are required." });
        }

        const admin = await this.adminRepository.findByResetToken(resetToken);
        if (!admin) {
        return res.status(400).json({ error: "Invalid or expired reset token." });
        }    
        
        if (admin.resetTokenExpiry < Date.now()) {
        return res.status(400).json({ error: "Reset token has expired." });
        }
        
        if (admin.resetToken != resetToken){
            return res.status(400).json({error:"Invalid reset token"})
        }

        const hashedPassword = await this.PasswordHelper.hashPassword(newPassword);

        await this.adminRepository.updatePassword(admin._id, hashedPassword);

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(400).json({ error: error.message });
    }
    }

    async forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
        return res.status(400).json({ error: "Email is required." });
        }

        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
        return res.status(404).json({ error: "Admin with this email does not exist." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiryTime = Date.now() + 5 * 60 * 1000; 

        await this.adminRepository.updateResetToken(admin._id, resetToken, expiryTime);


        await this.MailService.sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: "Password reset email sent successfully." });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(400).json({ error: error.message });
    }
    }

}

module.exports = AuthController;
