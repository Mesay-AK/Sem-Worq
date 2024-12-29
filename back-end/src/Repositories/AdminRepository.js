const Admin = require('../Infrastructures/models/AdminModel');
const PasswordHelper = require('../Infrastructures/helpers/password-helper')
const AdminEntity = require('../Domain/AdminEntity')

class AdminRepository {
    async createFirstAdmin() {

    const admins = await this.countAdmins()
    console.log(admins)
    if (!admins) {
        const adminEntity = new AdminEntity({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: process.env.ADMIN_ROLE,
            refreshTokens :[] ,
            resetToken : ''

        });



        adminEntity.password = await PasswordHelper.hashPassword(adminEntity.password);

        const firstAdmin = this.add(adminEntity);
        if (!firstAdmin){
            console.log("Error while creating the first Admin")
        }
        
        console.log('First admin user created!');
    } else {
        console.log('Admin user already exists');
    }
}
    async add(adminData) {
        try {
            
            return await new Admin(adminData).save();

        } catch (error) {
            console.error("Error in AdminRepository.create:", error.message);
            throw new Error("Failed to create admin. Please check the provided data.");
        }
    }

    async countAdmins(){
        const number =  await Admin.countDocuments({role: 'admin'})
        return number
    }

    async findByEmail(email) {
        try {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                throw new Error("Admin with the given email not found.");
            }
            return admin;
        } catch (error) {
            console.error("Error in AdminRepository.findByEmail:", error.message);
            throw new Error("Failed to fetch admin by email.");
        }
    }

    async findById(id) {
        try {
            const admin = await Admin.findById(id);
            if (!admin) {
                throw new Error("Admin with the given ID not found.");
            }
            return admin;
        } catch (error) {
            console.error("Error in AdminRepository.findById:", error.message);
            throw new Error("Failed to fetch admin by ID.");
        }
    }

    async updateRefreshToken(id, refreshToken) {
        try {
            const updatedAdmin = await Admin.findByIdAndUpdate(
                id,
                { refreshToken },
                { new: true }
            );
            if (!updatedAdmin) {
                throw new Error("Admin with the given ID not found for updating refresh token.");
            }
            return updatedAdmin;
            
        } catch (error) {
            console.error("Error in AdminRepository.updateRefreshToken:", error.message);
            throw new Error("Failed to update admin's refresh token.");
        }
    }
    
    async findByResetToken(token) {
        try {
            return await Admin.findOne({ resetToken: token });
        } catch (error) {
            console.error("Error in AdminRepository.findByResetToken:", error);
            throw new Error("Failed to find admin by reset token.");
        }
    }

    async updateResetToken(id, resetToken, expiry) {
        try {
            return await Admin.findByIdAndUpdate(
                id,
                { resetToken, resetTokenExpiry: expiry },
                { new: true }
            );
        } catch (error) {
            console.error("Error in AdminRepository.updateResetToken:", error);
            throw new Error("Failed to update reset token.");
        }
    }

    async updatePassword(id, hashedPassword) {
        try {
            return await Admin.findByIdAndUpdate(
                id,
                { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
                { new: true }
            );
        } catch (error) {
            console.error("Error in AdminRepository.updatePassword:", error);
            throw new Error("Failed to update password.");
        }
    }

    async delete(id){
        return await Admin.findOneAndDelete(id)
    }


    async get(req, res){
        const admins = await Admin.find()
        res.json(admins)
    }
}

module.exports = AdminRepository;
