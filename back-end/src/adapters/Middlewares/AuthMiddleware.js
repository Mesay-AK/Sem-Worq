const TokenHelper = require('../../Infrastructures/helpers/token-helper');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access token is missing." });
    }

    try {
        const payload = TokenHelper.verifyToken(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired access token." });
    }
}
const adminOnlyMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
    };

module.exports = {authMiddleware, adminOnlyMiddleware};
