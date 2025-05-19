import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js';


const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify SMTP connection configuration
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        const message = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Detailed error in sendEmail:', error);
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
        return false;
    }
};


const getAdminEmails = async () => {
    try {
        const adminUsers = await User.find({ role: { $in: ['administrator', 'admin'] } }).select('email');
        return adminUsers.map(user => user.email);
    } catch (error) {
        console.error('Error fetching admin emails:', error);
        return [];
    }
};

const notifyAdmins = async (subject, message, html) => {
    try {
        const adminEmails = await getAdminEmails();
        for (const email of adminEmails) {
            await sendEmail({ email, subject, message, html });
        }
    } catch (error) {
        console.error('Error notifying admins:', error);
        // Instead of throwing, we'll just log the error
    }
};

const notifyUser = async (userEmail, subject, message, html) => {
    try {
        await sendEmail({ email: userEmail, subject, message, html });
    } catch (error) {
        console.error('Error notifying user:', error);
        // Instead of throwing, we'll just log the error
    }
};

export { sendEmail, notifyAdmins, notifyUser };