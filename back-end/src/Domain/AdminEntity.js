class AdminEntity {
    constructor({ name, email, password, role = 'admin', refreshTokens = [] ,resetToken = ''}) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.refreshTokens = refreshTokens; 
        this.resetToken = resetToken;
    }

    validate() {
        if (!this.name || this.name.trim().length < 3) {
            throw new Error("Admin name must be at least 3 characters long.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            throw new Error("Invalid email format.");
        }

        if (!this.password || this.password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }

    }
    validateResetPasswordFields() {
        if (!this.resetToken) {
            throw new Error("Reset token is required.");
        }
        if (!this.password || this.password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }
    }


}
module.exports = AdminEntity;
