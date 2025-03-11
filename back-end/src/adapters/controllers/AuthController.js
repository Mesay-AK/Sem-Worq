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
                return res.status(409).json({ error: "Admin with this email already exists." });
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
                return res.status(401).json({ error: "Invalid email or password." });
            }

            const validated = await this.PasswordHelper.comparePassword(password, admin.password);

            if (!validated) {
                return res.status(401).json({ error: "Invalid email or password." });
            }

            const accessToken = this.TokenHelper.generateAccessToken({ id: admin._id, role: admin.role, email:admin.email });

            const refreshToken = await this.TokenHelper.generateRefreshToken({ id: admin._id, email: admin.email });

            const savedAdmin = {
                _id: admin.id,
                name:admin.name,
                email:admin.email,

            }

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'Strict',
                path: '/',
            });


            res.status(200).json({ token: accessToken, user: savedAdmin });

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

            const admin = await this.TokenHelper.validateRefreshToken(refreshToken);

            const newAccessToken =await this.TokenHelper.generateAccessToken({ id: admin.id, role: admin.role, email:admin.email });

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
            return res.status(400).json({ error: "Refresh token is required." });
        }

        const err = await this.TokenHelper.validateRefreshToken(refreshToken);
        if (err) {
            return res.status(401).json({ error: "Invalid refresh token." });
        }

        await this.TokenHelper.deleteRefreshToken(id);

        res.clearCookie("refreshToken");
        return res.json({ message: "Logged out successfully." });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ error: "Internal server error." });
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
    async getAll(req, res) {
        try {
            const admins = await this.adminRepository.getAll();
            res.status(200).json({ message: "Admins retrieved successfully", data: admins });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAdmin(req, res) {
        try {
            const {id} = req.params;
            const admins = await this.adminRepository.findById(id);
            res.status(200).json({ message: "Admins retrieved successfully", data: admins });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

async update(req, res) {
    try {
        const { id } = req.params; 
        const updateData = req.body; 
        const userId = req.user.id; 
        const userRole = req.user.role; 


        if (id !== userId && userRole !== "super-admin") {
            return res.status(403).json({ error: "You can only update your own profile." });
        }

        const forbiddenFields = ["password", "role"];
        forbiddenFields.forEach(field => {
            if (updateData[field]) {
                delete updateData[field];
            }
        });


        const updatedAdmin = await this.adminRepository.update(id, updateData);
        if (!updatedAdmin) {
            return res.status(404).json({ error: "Admin not found or update failed" });
        }

        res.status(200).json({ message: "Admin updated successfully", data: updatedAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


    async delete(req, res) {
    try {
        const { id } = req.params;
        const deletedAdmin = await this.adminRepository.delete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: "Admin not found." });
        }

        res.status(200).json({ message: "Admin deleted successfully", deletedAdmin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


}

module.exports = AuthController;
