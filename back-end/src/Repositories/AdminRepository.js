const Admin = require('../Infrastructures/models/AdminModel');

class AdminRepository {
    async add(adminData) {
        try {
            const admin = await new Admin(adminData).save();
            
            const {_id, name, email} = admin;

            return {_id, name, email}

        } catch (error) {
            console.error("Error in AdminRepository.create:", error.message);
            throw new Error("Failed to create admin. Please check the provided data.");
        }
    }


    async findByEmail(email) {
        try {
            const admin = await Admin.findOne({email});
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
            const admin = await Admin.findById({id},'-password -resetToken');
            if (!admin) {
                throw new Error("Admin with the given ID not found.");
            }

            return admin;
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

    async update(id, updateData) {
        try {
            const updatedAdmin = await this.adminModel.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, select: '-password -resetToken' }
            );

            if (!updatedAdmin) throw new Error("Admin not found or update failed.");
            return updatedAdmin;
        } catch (error) {
            throw new Error("Error updating admin: " + error.message);
        }
    }


    async delete(id) {
        try {
            const deletedAdmin = await this.adminModel.findByIdAndDelete(id, { select: '_id name email role' });

            if (!deletedAdmin) throw new Error("Admin not found.");
            return deletedAdmin;
        } catch (error) {
            throw new Error("Error deleting admin: " + error.message);
        }
    }

    async getAll() {
        try {
            return await this.adminModel.find({}, '-password -resetToken') // Retrieves 
        } catch (error) {
            throw new Error("Error fetching admins: " + error.message);
        }
    }
}



module.exports = AdminRepository;
