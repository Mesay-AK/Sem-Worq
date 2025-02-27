const jwt = require('jsonwebtoken');
const redisClient = require('../cache/redisClient');
const { v4: uuidv4 } = require('uuid');

class TokenHelper {
    static generateAccessToken(payload) {
        payload.iat = Math.floor(Date.now() / 1000);
        payload.sessionId = uuidv4();


        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m', algorithm: 'HS256' });

        return token
    }

    static async generateRefreshToken(payload) {
        payload.iat = Math.floor(Date.now() / 1000);
        payload.sessionId = uuidv4();
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d', algorithm: 'HS256' });


        try {
            await redisClient.set(`refreshToken:${payload.sessionId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
        } catch (error) {
            console.error('Error storing refresh token in Redis:', error);
        }

        return refreshToken;
    }

    static verifyAccessToken(token) {
        try {

            const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

            return payload;
        } catch (error) {
            throw new Error(`Invalid or expired token: ${error.message}`);
        }
    }

    static async validateRefreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });

            const storedToken = await redisClient.get(`refreshToken:${decoded.sessionId}`);

            if (!storedToken || storedToken !== refreshToken) {
                throw new Error('Invalid or expired refresh token');
            }

            return decoded;
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    static async deleteRefreshToken(sessionId) {
        try {
            await redisClient.del(`refreshToken:${sessionId}`);
        } catch (error) {
            console.log(error);
            throw new Error('Failed to delete refresh token from Redis');
        }
    }
}

module.exports = TokenHelper;
