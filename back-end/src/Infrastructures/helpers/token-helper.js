const jwt = require('jsonwebtoken');
const redisClient = require('../cache/redisClient');

class TokenHelper {
    static generateAccessToken(payload) {
    payload.iat = Math.floor(Date.now() / 1000);
    payload.sessionId = Math.random().toString(36).substring(2);
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    }


    static async generateRefreshToken(payload) {
        payload.iat = Math.floor(Date.now() / 1000);
        payload.sessionId = Math.random().toString(36).substring(2);
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        try {

            await redisClient.set(`refreshToken:${payload.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);


        } catch (err) {
            console.error('Error storing refresh token in Redis:', err);
        }

        return refreshToken;
    }

    static verifyToken(token, secret) {
        try {
            console.log("checking token")
            const payload = jwt.verify(token, secret);
            console.log(payload)
            return payload
        } catch (error) {
            console.log('throwingERR', error.message)
            throw new Error('Invalid or expired token', error.message);
        }
    }

    static async validateRefreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            console.log('inside the verification')


            const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);
            console.log("stored RT: ", storedToken)
            console.log("refresh: ", RT)

            console.log("printing the tokens:")
            if (!storedToken || storedToken !== refreshToken) {

                throw new Error('Invalid or expired refresh token');
            }

            return decoded;
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    static async deleteRefreshToken(userId) {
        try {
            await redisClient.del(`refreshToken:${userId}`);
        } catch (error) {
            console.log(err)
            throw new Error('Failed to delete refresh token from Redis');
        }
    }

    static async getRefreshToken(userId) {
        try {
            return await redisClient.get(`refreshToken:${userId}`);
        } catch (err) {
            throw new Error('Failed to get refresh token from cache.');
        }
    }
}

module.exports = TokenHelper;
