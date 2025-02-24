const jwt = require('jsonwebtoken');
const redisClient = require('../cache/redisClient');

class TokenHelper {
    static generateAccessToken(payload) {
    payload.iat = Math.floor(Date.now() / 1000);
    payload.sessionId = Math.random().toString(36).substring(2);
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m', algorithm: 'HS256' });
    }


    static async generateRefreshToken(payload) {
        payload.iat = Math.floor(Date.now() / 1000);
        payload.sessionId = Math.random().toString(36).substring(2);
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '15m', algorithm: 'HS256' });

        try {

            await redisClient.set(`refreshToken:${payload.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);


        } catch (err) {
            console.error('Error storing refresh token in Redis:', err);
        }

        return refreshToken;
    }

    static verifyAccessToken(token) {
        try {
   
            const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
           
            return payload
        } catch (error) {
            
            throw new Error('Invalid or expired token', error.message);
        }
    }

    static async validateRefreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });


            const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);


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

}

module.exports = TokenHelper;
