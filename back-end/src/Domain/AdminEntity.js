class UserEntity {
    constructor({ name, email, password, role, refreshTokens = [] }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.refreshTokens = refreshTokens;
    }

    validate() {
        if (!this.name || this.name.trim().length < 3) {
            throw new Error("User name must be at least 3 characters long.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            throw new Error("Invalid email format.");
        }

        if (!this.password || this.password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }

        if (!['admin', 'user'].includes(this.role)) {
            throw new Error("Role must be either 'admin' or 'user'.");
        }
    }

    validatePasswordReset(newPassword) {
        if (!newPassword || newPassword.length < 8) {
            throw new Error("New password must be at least 8 characters long.");
        }
    }
}

module.exports = UserEntity;
