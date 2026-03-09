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
        const html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:0px;width:95%;padding:10px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Moi Kanakku</a>
            </div>
            <p style="font-size:1.1em">Hi <span style="font-weight: bold;color: #2c2c54;">${userName || 'User'}</span>,</p>
            <p>உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நாங்கள் விரைவில் மதிப்பாய்வு செய்வோம்.</p>
            <p style="font-size:0.9em;">Regards, <br />Moi Kanakku</p>
            <hr style="border:none;border-top:1px solid #eee" /></div></div>`;
        await transporter.sendMail({
            from: `"Help - Moi Kanakku" <${process.env.EMAIL_USER}>`,
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
        const html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:0px;width:95%;padding:10px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Moi Kanakku</a>
            </div>
            <p style="font-size:1.1em">Hi <span style="font-weight: bold;color: #2c2c54;">${userName || 'User'}</span>,</p>
            <p>உங்கள் கருத்துக்கு பதில் வழங்கப்பட்டது.</p>
            <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin:12px 0;">${escapeHtml(replyText).replace(/\n/g, '<br/>')}</div>
            <p style="font-size:0.9em;">Regards, <br />Moi Kanakku</p>
            <hr style="border:none;border-top:1px solid #eee" /></div></div>`;
        await transporter.sendMail({
            from: `"Help - Moi Kanakku" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'உங்கள் கருத்துக்கு பதில் - Moi Kanakku',
            html,
        });
    } catch (err) {
        logger.error('Error sending feedback reply email', err);
    }
}

module.exports = {
    sendFeedbackConfirmationEmail,
    sendFeedbackReplyEmail,
};
