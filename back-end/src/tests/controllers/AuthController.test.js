const AuthController = require('../../adapters/controllers/AuthController');

const mockRequest = (body = {}, params = {}, cookies = {}, user = {}) => ({
    body,
    params,
    cookies,
    user,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn();
    res.clearCookie = jest.fn();
    return res;
};

describe("AuthController Tests", () => {
    let controller;
    let mockAdminRepo, mockMailService, mockPasswordHelper, mockTokenHelper;

    beforeEach(() => {
        mockAdminRepo = {
            findByEmail: jest.fn(),
            add: jest.fn(),
            findById: jest.fn(),
            updatePassword: jest.fn(),
            updateResetToken: jest.fn(),
            findByResetToken: jest.fn(),
            delete: jest.fn(),
        };

        mockMailService = { sendPasswordResetEmail: jest.fn() };
        mockPasswordHelper = { hashPassword: jest.fn(), comparePassword: jest.fn() };
        mockTokenHelper = {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            validateRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
        };

        controller = new AuthController(mockAdminRepo, mockMailService, mockPasswordHelper, mockTokenHelper);
        jest.clearAllMocks();
    });

    describe("Register Admin", () => {
        test("should register a new admin successfully", async () => {
            const req = mockRequest({ name: "John Doe", email: "john@example.com", password: "securePass" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue(null);
            mockPasswordHelper.hashPassword.mockResolvedValue("hashedPassword");
            mockAdminRepo.add.mockResolvedValue({ id: "123", name: "John Doe", email: "john@example.com" });

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "admin added successfully", data: { id: "123", name: "John Doe", email: "john@example.com" } });
        });

        test("should return error if email already exists", async () => {
            const req = mockRequest({ name: "John", email: "john@example.com", password: "password" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue({ id: "123", email: "john@example.com" });

            await controller.register(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: "Admin with this email already exists." });
        });
    });

    describe("Login Admin", () => {
        test("should log in successfully", async () => {
            const req = mockRequest({ email: "john@example.com", password: "securePass" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue({ id: "123", email: "john@example.com", password: "hashedPassword" });
            mockPasswordHelper.comparePassword.mockResolvedValue(true);
            mockTokenHelper.generateAccessToken.mockReturnValue("accessToken");
            mockTokenHelper.generateRefreshToken.mockResolvedValue("refreshToken");

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: "accessToken", user: expect.any(Object) });
        });

                test("should return error for invalid email", async () => {
            const req = mockRequest({ email: "wrong@example.com", password: "password" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue(null);

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);  // Adjusted to match actual response
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid email or password." });
        });

        test("should return error for incorrect password", async () => {
            const req = mockRequest({ email: "john@example.com", password: "wrongPass" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue({ id: "123", email: "john@example.com", password: "hashedPassword" });
            mockPasswordHelper.comparePassword.mockResolvedValue(false);

            await controller.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);  // Adjusted to match actual response
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid email or password." });
        });

    });

    describe("Token Management", () => {
        test("should refresh access token", async () => {
            const req = mockRequest({}, {}, { refreshToken: "validToken" });
            const res = mockResponse();

            mockTokenHelper.validateRefreshToken.mockResolvedValue({ id: "123", email: "john@example.com", role: "admin" });
            mockTokenHelper.generateAccessToken.mockResolvedValue("newAccessToken");

            await controller.refreshToken(req, res);

            expect(res.json).toHaveBeenCalledWith({ token: "newAccessToken" });
        });

        test("should return error if refresh token is missing", async () => {
            const req = mockRequest({}, {}, {});
            const res = mockResponse();

            await controller.refreshToken(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Refresh token is required." });
        });
    });
    describe("Admin LogOut", () =>{
        ("should log out successfully", async () => {
            controller.TokenHelper.validateRefreshToken.mockResolvedValue(null); // No error
            controller.TokenHelper.deleteRefreshToken.mockResolvedValue(true); // Successfully deleted

            await controller.logout(req, res);

            expect(controller.TokenHelper.validateRefreshToken).toHaveBeenCalledWith("valid-refresh-token");
            expect(controller.TokenHelper.deleteRefreshToken).toHaveBeenCalledWith("123");
            expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
            expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully." });
        });

        test("should return 400 if no refresh token is provided", async () => {
            const req = { 
                params: { id: "123" }, 
                cookies: {} // No refreshToken provided
            };

        const res = { 
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };

        await controller.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Refresh token is required." });
        expect(res.clearCookie).not.toHaveBeenCalled();
    });


        test("should return 401 if refresh token is invalid", async () => {
            const req = { 
                params: { id: "123" },
                cookies: { refreshToken: "invalid-refresh-token" },
            };

            const res = { 
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                clearCookie: jest.fn()
            };

            controller.TokenHelper.validateRefreshToken.mockResolvedValue(new Error("Invalid refresh token"));

            await controller.logout(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid refresh token." });
            expect(res.clearCookie).not.toHaveBeenCalled();
        });



        });

    describe("Password Reset", () => {
        test("should send password reset email", async () => {
            const req = mockRequest({ email: "john@example.com" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue({ id: "123", email: "john@example.com" });
            mockAdminRepo.updateResetToken.mockResolvedValue();
            mockMailService.sendPasswordResetEmail.mockResolvedValue();

            await controller.forgotPassword(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: "Password reset email sent successfully." });
        });

        test("should return error if email not found", async () => {
            const req = mockRequest({ email: "notfound@example.com" });
            const res = mockResponse();

            mockAdminRepo.findByEmail.mockResolvedValue(null);

            await controller.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Admin with this email does not exist." });
        });

        test("should reset password successfully", async () => {
            const req = mockRequest({ resetToken: "validToken", newPassword: "newPass123" });
            const res = mockResponse();

            mockAdminRepo.findByResetToken.mockResolvedValue({
                _id: "123",
                resetToken: "validToken",
                resetTokenExpiry: Date.now() + 1000,
            });

            mockPasswordHelper.hashPassword.mockResolvedValue("hashedNewPass");
            mockAdminRepo.updatePassword.mockResolvedValue();

            await controller.resetPassword(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: "Password updated successfully." });
        });

        test("should return error for invalid or expired reset token", async () => {
            const req = mockRequest({ resetToken: "invalidToken", newPassword: "newPass123" });
            const res = mockResponse();

            mockAdminRepo.findByResetToken.mockResolvedValue(null);

            await controller.resetPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired reset token." });
        });
    });
});
