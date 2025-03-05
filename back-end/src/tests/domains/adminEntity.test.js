const AdminEntity = require("../../Domain/AdminEntity");

describe("AdminEntity", () => {
    test("should create a valid admin entity", () => {
        const admin = new AdminEntity({
            name: "John Doe",
            email: "admin@example.com",
            password: "securePass123",
        });
        expect(() => admin.validate()).not.toThrow();
    });

    test("should throw an error if name is too short", () => {
        const admin = new AdminEntity({
            name: "Jo",
            email: "admin@example.com",
            password: "securePass123",
        });
        expect(() => admin.validate()).toThrow("Admin name must be at least 3 characters long.");
    });

    test("should throw an error if email is invalid", () => {
        const admin = new AdminEntity({
            name: "John Doe",
            email: "invalid-email",
            password: "securePass123",
        });
        expect(() => admin.validate()).toThrow("Invalid email format.");
    });

    test("should throw an error if password is too short", () => {
        const admin = new AdminEntity({
            name: "John Doe",
            email: "admin@example.com",
            password: "short",
        });
        expect(() => admin.validate()).toThrow("Password must be at least 8 characters long.");
    });

    test("should validate reset password fields correctly", () => {
        const admin = new AdminEntity({
            name: "John Doe",
            email: "admin@example.com",
            password: "securePass123",
            resetToken: "validToken123",
        });
        expect(() => admin.validateResetPasswordFields()).not.toThrow();
    });

    test("should throw an error if reset token is missing", () => {
        const admin = new AdminEntity({
            name: "John Doe",
            email: "admin@example.com",
            password: "securePass123",
            resetToken: "",
        });
        expect(() => admin.validateResetPasswordFields()).toThrow("Reset token is required.");
    });
});
