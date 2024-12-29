const bcrypt = require('bcrypt');

class PasswordHelper {
    static async hashPassword(password) {
        try {
            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            return hashedPassword;

        } catch (error) {

            console.error("Error hashing password:", error);
            throw new Error("Failed to hash password.");
        }
    }
    static async comparePassword(password, hashedPassword) {
        try {

            return await bcrypt.compare(password, hashedPassword);

        } catch (error) {

            console.error("Error comparing password:", error);
            throw new Error("Failed to compare password.");
        }
    }
}

module.exports = PasswordHelper;
