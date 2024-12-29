const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendEmail(to, subject, text) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                text,
            });
            return info;
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
