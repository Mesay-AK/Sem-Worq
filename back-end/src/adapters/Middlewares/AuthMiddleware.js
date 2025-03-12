const TokenHelper = require('../../Infrastructures/helpers/token-helper');

class AuthMiddleware {
    constructor() {}

    async authMiddleware(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: "Access token is missing or invalid." });
            }

            const token = authHeader.split(' ')[1];
            const payload = TokenHelper.verifyAccessToken(token);

            if (!payload) {
                return res.status(401).json({ error: "Invalid or expired token." });
            }

            req.user = payload;
            next();
        } catch (error) {
            return res.status(401).json({ error: "Authentication failed. " + error.message });
        }
    }

    async selfOnlyMiddleware(req, res, next) {
        const { id } = req.params;
        const userId = req.user?.id;

        if (req.user?.role === 'super-admin') {
            return next();
        }

        if (!userId || id !== userId) {
            return res.status(403).json({ error: "Unauthorized: You can only modify your own profile." });
        }

        next();
    }

    adminOnlyMiddleware(req, res, next) {
        const { role } = req.user || {};

        if (role === 'admin' || role === 'super-admin') {
            return next();
        }

        return res.status(403).json({ error: "Access denied. Admins only." });
    }
}

module.exports = AuthMiddleware;
