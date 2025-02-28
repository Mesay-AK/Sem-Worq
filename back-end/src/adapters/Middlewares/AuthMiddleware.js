const TokenHelper = require('../../Infrastructures/helpers/token-helper');

class AuthMiddleware {
    constructor() {
        
    }

    async authMiddleware(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: "Access token is missing." });
            }

            const payload = TokenHelper.verifyAccessToken(token);
            req.user = payload;
            
            next();
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    async selfOnlyMiddleware(req, res, next) {
        const { id } = req.params; 
        const userId = req.user.id; 

        if (req.user.role === 'super-admin') {
            return next(); 
        }

        if (id !== userId) {
            return res.status(403).json({ error: "You can only modify your own profile." });
        }

        next(); 
    };


    adminOnlyMiddleware(req, res, next) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        next();
    }

}

module.exports = AuthMiddleware;
