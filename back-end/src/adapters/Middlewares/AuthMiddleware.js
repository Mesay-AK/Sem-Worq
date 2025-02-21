const TokenHelper = require('../../Infrastructures/helpers/token-helper');

class AuthMiddleware {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }

    async authMiddleware(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: "Access token is missing." });
            }
            const payload = TokenHelper.verifyToken(token, process.env.JWT_SECRET);
            req.user = payload;
            console.log("Authenticated user:", payload.email);
            next();
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    adminOnlyMiddleware(req, res, next) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }
        next();
    }

//     async checkValidRefreshToken(req, res, next) {
//         try {
//             const refreshToken = req.cookies.refreshToken;
//             if (!refreshToken) {
//                 return res.status(401).json({ error: "Refresh token is required." });
//             }

//             const decoded = TokenHelper.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
//             console.log("Decoded refresh token id:", decoded.id);

//             const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);
//             if (!storedToken || storedToken !== refreshToken) {
//                 return res.status(401).json({ error: "Invalid or expired refresh token." });
//             }

//             req.refreshTokenPayload = decoded;
//             next();
//         } catch (error) {
//             return res.status(401).json({ error: error.message });
//         }
//     }
// 
}

module.exports = AuthMiddleware;
