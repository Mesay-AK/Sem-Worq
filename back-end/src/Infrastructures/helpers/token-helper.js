const jwt = require('jsonwebtoken');

class TokenHelper {
    static generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    }

    static generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    }

    static generateResetToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}

module.exports = TokenHelper;
