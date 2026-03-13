const nodemailer = require('nodemailer');
const logger = require('../config/logger');

function escapeHtml(text = '') {
    return text.replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[m]));
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

/**
 * Send email when user submits feedback (confirmation to user)
 */
async function sendFeedbackConfirmationEmail(toEmail, userName) {
    if (!toEmail) return;
    try {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Feedback Submitted</title></head><body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 10px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;box-shadow:0 4px 10px rgba(0,0,0,0.05);"><tr><td style="border-bottom:1px solid #e5e7eb;padding:20px 24px;"><h1 style="margin:0;font-size:20px;font-weight:600;color:#1e3a8a;"> Moi Kanakku </h1></td></tr><tr><td style="padding:24px;color:#374151;line-height:1.6;font-size:15px;"><p style="margin:0 0 15px;"> Hi <strong style="color:#111827;">${userName || "User"}</strong>, </p><p style="margin:0 0 15px;"> உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நாங்கள் விரைவில் மதிப்பாய்வு செய்வோம். </p><p style="margin:0 0 15px;"> 🙏 <strong>Thanks for using the Moi Kanakku app!</strong><br> Your feedback helps us improve the app for everyone. </p><div style="background:#eff6ff;border:1px solid #dbeafe;border-radius:6px;padding:16px;margin-top:20px;"><p style="margin:0 0 8px;font-weight:600;color:#1e3a8a;"> 🎉 Help us grow! </p><p style="margin:0 0 8px;font-size:14px;color:#374151;"> If you like Moi Kanakku, please share it with your friends and family. Your support helps more people manage their accounts easily. </p><p style="margin:0;font-size:14px;color:#374151;"> Stay tuned for upcoming features and promotions in the app! </p></div><p style="margin-top:25px;font-size:14px;color:#4b5563;"> Regards,<br><strong style="color:#1e3a8a;">Moi Kanakku Team</strong></p></td></tr><tr><td style="border-top:1px solid #e5e7eb;text-align:center;padding:15px;font-size:12px;color:#6b7280;"> © 2026 Moi Kanakku. All rights reserved. </td></tr></table></td></tr></table></body></html>`;
        await transporter.sendMail({
            from: `"Admin - Moi Kanakku Team" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'கருத்து சமர்ப்பிப்பு - Moi Kanakku',
            html,
        });
    } catch (err) {
        logger.error('Error sending feedback confirmation email', err);
    }
}

/**
 * Send email when admin replies to feedback (reply content to user)
 */
async function sendFeedbackReplyEmail(toEmail, userName, replyText) {
    if (!toEmail) return;
    try {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f5f7fb;font-family:Helvetica,Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;"><tr><td style="padding:20px;border-bottom:1px solid #eee;"><a href="#" style="font-size:20px;color:#00466a;text-decoration:none;font-weight:600;"> Moi Kanakku </a></td></tr><tr><td style="padding:25px;color:#333;line-height:1.7;"><p style="font-size:16px;margin:0 0 15px 0;"> Hi <strong style="color:#2c2c54;">${userName || "User"}</strong>, </p><p style="margin:0 0 15px 0;"> உங்கள் கருத்துக்கு பதில் வழங்கப்பட்டுள்ளது. </p><div style="background:#f5f5f5;padding:15px;border-radius:6px;margin:15px 0;font-size:14px;"> ${escapeHtml(replyText).replace(/\n/g, "<br/>")} </div><p style="margin-top:15px;"> 🙏 <strong>Thanks for using Moi Kanakku!</strong> Your feedback helps us improve the app experience. </p><div style="background:#eef4ff;border:1px solid #dbe7ff;padding:15px;border-radius:6px;margin-top:20px;font-size:14px;"><strong>🚀 Share Moi Kanakku</strong><br> If you like our app, please share it with your friends and family. More features and promotions are coming soon! </div><p style="margin-top:25px;font-size:14px;color:#666;"> Regards,<br><strong>Moi Kanakku Team</strong></p></td></tr><tr><td style="border-top:1px solid #eee;padding:15px;text-align:center;font-size:12px;color:#999;"> © 2026 Moi Kanakku. All rights reserved. </td></tr></table></td></tr></table></body></html>`;
        await transporter.sendMail({
            from: `"Admin - Moi Kanakku Team" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'உங்கள் கருத்துக்கு பதில் - Moi Kanakku',
            html,
        });
    } catch (err) {
        logger.error('Error sending feedback reply email', err);
    }
}

/**
 * Generic sendEmail function for sending emails with custom subject, content
 * @param {Object} options - { to, subject, html, from? }
 */
async function sendEmail(options) {
    const { to, subject, html, from } = options;
    
    if (!to || !subject || !html) {
        logger.error('sendEmail: Missing required parameters (to, subject, html)');
        throw new Error('to, subject, html are required');
    }
    
    try {
        const mailOptions = {
            from: from || `"Moi Kanakku" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        };
        
        const result = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to}: ${result.response}`);
        return result;
    } catch (err) {
        logger.error(`Error sending email to ${to}:`, err);
        throw err;
    }
}

/**
 * Generate welcome email HTML for new user registration
 * @param {string} name - User's name
 * @returns {string} HTML email content
 */
function getWelcomeEmailContent(name) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f5f7fb;font-family:Helvetica,Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;"><tr><td style="padding:20px;border-bottom:1px solid #eee;"><a href="#" style="font-size:20px;color:#00466a;text-decoration:none;font-weight:600;"> Moi Kanakku </a></td></tr><tr><td style="padding:25px;color:#333;line-height:1.7;"><p style="font-size:16px;margin:0 0 15px 0;"> Hi <strong style="color:#2c2c54;">${name}</strong>, </p><p style="margin:0 0 15px 0;"> We are pleased to welcome you to Moi Kanakku. Our platform helps you manage events, relations, and gift records in a simple and organized way. </p><div style="background:#f5f5f5;padding:15px;border-radius:6px;margin:15px 0;font-size:14px;"><p style="margin:0 0 10px;font-weight:600;color:#2c2c54;">Getting started with Moi Kanakku:</p><ul style="padding-left:18px;margin:0;"><li style="margin-bottom:8px;">Create and manage special events.</li><li style="margin-bottom:8px;">Maintain relations and guest details.</li><li style="margin-bottom:8px;">Track gifts received in cash or kind.</li><li>Export your records anytime in Excel format.</li></ul></div><p style="margin-top:15px;"> 🙏 Thank you for choosing Moi Kanakku. We are committed to helping you manage your records easily and efficiently. </p><div style="background:#eef4ff;border:1px solid #dbe7ff;padding:15px;border-radius:6px;margin-top:20px;font-size:14px;"><strong>🚀 Share Moi Kanakku</strong><br> If you find Moi Kanakku useful, please consider sharing it with your friends and family. More features and improvements will be available soon! </div><p style="margin-top:25px;font-size:14px;color:#666;"> Best regards,<br><strong>Moi Kanakku Team</strong></p></td></tr><tr><td style="border-top:1px solid #eee;padding:15px;text-align:center;font-size:12px;color:#999;"> © 2026 Moi Kanakku. All rights reserved. </td></tr></table></td></tr></table></body></html>`;
}

/**
 * Generate admin notification email HTML for new user registration
 * @param {Object} userData - User registration data { userId, name, email, mobile, referred_by, brand, model, device_name, normalizedAndroidVersion, registrationTime }
 * @returns {string} HTML email content
 */
function getAdminRegistrationEmailContent(userData) {
    const {
        userId,
        name,
        email,
        mobile,
        referred_by,
        brand,
        model,
        device_name,
        normalizedAndroidVersion,
        registrationTime,
    } = userData;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New User Registration</title></head><body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;"><span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">New user registered</span><div style="padding:30px 10px;display:flex;justify-content:center;"><div style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;"><div style="background:#2f3490;color:#ffffff;text-align:center;padding:25px;"><h2 style="margin:0;font-size:22px;font-weight:600;"> New User Registered </h2><p style="margin-top:6px;font-size:14px;"> A new user has registered on Moi Kanakku </p></div><div style="padding:28px;color:#333;font-size:15px;line-height:1.6;"><p style="margin:0 0 12px;font-size:16px;"> Hi Admin, </p><p style="margin:0 0 16px;"> A new user has registered on Moi Kanakku with the following details:</p><ul style="padding-left:18px;margin:0;color:#333;"><li style="margin-bottom:8px;"><strong>User ID:</strong> ${userId}</li><li style="margin-bottom:8px;"><strong>Name:</strong> ${name}</li><li style="margin-bottom:8px;"><strong>Email:</strong> ${email}</li><li style="margin-bottom:8px;"><strong>Mobile:</strong> ${mobile}</li><li style="margin-bottom:8px;"><strong>Referred By:</strong> ${referred_by || "N/A"}</li><li style="margin-bottom:8px;"><strong>Brand:</strong> ${brand || "N/A"}</li><li style="margin-bottom:8px;"><strong>Model:</strong> ${model || "N/A"}</li><li style="margin-bottom:8px;"><strong>Device Name:</strong> ${device_name || "N/A"}</li><li style="margin-bottom:8px;"><strong>Android Version:</strong> ${normalizedAndroidVersion || "N/A"}</li><li style="margin-bottom:8px;"><strong>Registration Time:</strong> ${registrationTime}</li></ul></div><div style="border-top:1px solid #eee;text-align:center;padding:15px;font-size:12px;color:#888;"> © 2026 Moi Kanakku. All rights reserved.<br> If you did not sign up for Moi Kanakku, please ignore this email. </div></div></div></body></html>`;
}

module.exports = {
    sendFeedbackConfirmationEmail,
    sendFeedbackReplyEmail,
    sendEmail,
    getWelcomeEmailContent,
    getAdminRegistrationEmailContent,
};
