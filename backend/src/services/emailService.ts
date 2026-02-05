import nodemailer from 'nodemailer';
import logger from '../utils/logger';

// Mock transport for development if no credentials
const createTransporter = () => {
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Create an ethereal test account for development
        return nodemailer.createTransport({
            jsonTransport: true
        });
    }
};

const transporter = createTransporter();

export const sendEmail = async (to: string, subject: string, text: string, attachments?: any[]) => {
    try {
        const info = await transporter.sendMail({
            from: '"PackageMatch" <noreply@packagematch.com>',
            to,
            subject,
            text,
            attachments
        });

        if (process.env.SMTP_HOST) {
            logger.info(`Email sent: ${info.messageId}`);
        } else {
            logger.info(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            logger.debug(`[MOCK EMAIL BODY]: ${text}`);
        }
        return info;
    } catch (error) {
        logger.error('Error sending email:', error);
        // Don't throw, just log. Notification failure shouldn't crash the request.
    }
};
