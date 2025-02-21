const Admin = require('../Infrastructures/models/AdminModel');

class AdminRepository {
    async add(adminData) {
        try {
            
            return await new Admin(adminData).save();

        } catch (error) {
            console.error("Error in AdminRepository.create:", error.message);
            throw new Error("Failed to create admin. Please check the provided data.");
        }
    }


    async findByEmail(email) {
        try {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return 
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
            const response = {};
            response._id = admin.id;
            response.name = admin.name;
            response.role = admin.role;
            response.email = admin.email;

            return response;
        } catch (error) {
            console.error("Error in AdminRepository.findById:", error.message);
            throw new Error("Failed to fetch admin by ID.");
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
            const admin = await Admin.findOneAndDelete(id)
            const response = {};
            response._id = admin.id;
            response.name = admin.name;
            response.role = admin.role;
            response.email = admin.email;

            return response;
        
    }
    async getAll(){
        return await Admin.find({}, { id_: 1, name: 1, email:1, role:1});
        
        }
}



module.exports = AdminRepository;
