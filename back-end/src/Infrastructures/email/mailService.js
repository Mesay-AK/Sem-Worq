const postmark = require('postmark');
require("dotenv").config();

class MailService {
    constructor() {
        this.client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    }

    async sendEmail(to, subject, text) {
        try {
            const response = await this.client.sendEmail({
                From: process.env.EMAIL_FROM,
                To: to,
                Subject: subject,
                TextBody: text,
            });
            console.log("Email sent:", response.Message);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendPasswordResetEmail(to, resetToken) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const subject = 'Password Reset Request';
        const text = `We received a request to reset your password. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;

        return await this.sendEmail(to, subject, text);
    }
}

module.exports = new MailService();
