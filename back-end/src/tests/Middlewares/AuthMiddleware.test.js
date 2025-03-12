const AuthMiddleware = require('../../adapters/Middlewares/AuthMiddleware');
const TokenHelper = require('../../Infrastructures/helpers/token-helper');

jest.mock('../../Infrastructures/helpers/token-helper');

describe('AuthMiddleware', () => {
    let authMiddleware, req, res, next;

    beforeEach(() => {
        authMiddleware = new AuthMiddleware();
        req = { headers: {}, params: {}, user: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('authMiddleware', () => {
        it('should call next() when a valid token is provided', async () => {
            req.headers.authorization = 'Bearer validToken';
            TokenHelper.verifyAccessToken.mockReturnValue({ id: '123', role: 'user' });

            await authMiddleware.authMiddleware(req, res, next);

            expect(req.user).toEqual({ id: '123', role: 'user' });
            expect(next).toHaveBeenCalled();
        });

        it('should return 401 when no token is provided', async () => {
            await authMiddleware.authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Access token is missing or invalid." });
        });

        it('should return 401 when token is invalid', async () => {
            req.headers.authorization = 'Bearer invalidToken';
            TokenHelper.verifyAccessToken.mockImplementation(() => { throw new Error('Invalid token'); });

            await authMiddleware.authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Authentication failed. Invalid token" });
        });

        it('should return 401 when token is expired', async () => {
            req.headers.authorization = 'Bearer expiredToken';
            TokenHelper.verifyAccessToken.mockReturnValue(null);

            await authMiddleware.authMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token." });
        });
    });

    describe('selfOnlyMiddleware', () => {
        it('should call next() when user modifies their own profile', async () => {
            req.params.id = '123';
            req.user = { id: '123', role: 'user' };

            await authMiddleware.selfOnlyMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should allow super-admin to access any profile', async () => {
            req.params.id = '999';
            req.user = { id: '123', role: 'super-admin' };

            await authMiddleware.selfOnlyMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 when a user tries to modify another user’s profile', async () => {
            req.params.id = '999';
            req.user = { id: '123', role: 'user' };

            await authMiddleware.selfOnlyMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: You can only modify your own profile." });
        });

        it('should return 403 if user ID is missing', async () => {
            req.params.id = '123';
            req.user = {}; 

            await authMiddleware.selfOnlyMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized: You can only modify your own profile." });
        });
    });

    describe('adminOnlyMiddleware', () => {
        it('should call next() when user is admin', () => {
            req.user = { role: 'admin' };

            authMiddleware.adminOnlyMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next() when user is super-admin', () => {
            req.user = { role: 'super-admin' };

            authMiddleware.adminOnlyMiddleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 when user is not an admin', () => {
            req.user = { role: 'user' };

            authMiddleware.adminOnlyMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Access denied. Admins only." });
        });

        it('should return 403 when no role is provided', () => {
            req.user = {}; 

            authMiddleware.adminOnlyMiddleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Access denied. Admins only." });
        });
    });
});
