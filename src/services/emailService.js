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
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Feedback Submitted</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-gray-100 font-sans"><div class="max-w-xl mx-auto my-10 bg-white rounded-lg shadow border border-gray-200"><div class="border-b px-6 py-4"><h1 class="text-xl font-semibold text-blue-900">Moi Kanakku</h1></div><div class="px-6 py-6 text-gray-700 leading-relaxed"><p class="text-base mb-4"> Hi <span class="font-semibold text-gray-900">${userName || "User"}</span>, </p><p class="mb-4"> உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நாங்கள் விரைவில் மதிப்பாய்வு செய்வோம். </p><p class="mb-4"> 🙏 <strong>Thanks for using the Moi Kanakku app!</strong> Your feedback helps us improve the app for everyone. </p><div class="bg-blue-50 border border-blue-100 rounded-md p-4 mt-5"><p class="font-semibold text-blue-900 mb-2"> 🎉 Help us grow! </p><p class="text-sm text-gray-700 mb-2"> If you like Moi Kanakku, please share it with your friends and family. Your support helps more people manage their accounts easily. </p><p class="text-sm text-gray-700"> Stay tuned for upcoming features and promotions in the app! </p></div><p class="mt-6 text-sm text-gray-600"> Regards,<br><span class="font-semibold text-blue-900">Moi Kanakku Team</span></p></div><div class="border-t px-6 py-4 text-center text-xs text-gray-500"> © 2026 Moi Kanakku. All rights reserved. </div></div></body></html>`;
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
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#f5f7fb;font-family:Helvetica,Arial,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;"><tr><td style="padding:20px;border-bottom:1px solid #eee;"><a href="#" style="font-size:20px;color:#00466a;text-decoration:none;font-weight:600;"> Moi Kanakku </a></td></tr><tr><td style="padding:25px;color:#333;line-height:1.7;"><p style="font-size:16px;margin:0 0 15px 0;"> Hi <strong style="color:#2c2c54;">${userName || "User"}</strong>, </p><p style="margin:0 0 15px 0;"> உங்கள் கருத்துக்கு பதில் வழங்கப்பட்டுள்ளது. </p><div style="background:#f5f5f5;padding:15px;border-radius:6px;margin:15px 0;font-size:14px;"> ${escapeHtml(replyText).replace(/\n/g, "<br/>")} </div><p style="margin-top:15px;"> 🙏 <strong>Thanks for using Moi Kanakku!</strong> Your feedback helps us improve the app experience. </p><div style="background:#eef4ff;border:1px solid #dbe7ff;padding:15px;border-radius:6px;margin-top:20px;font-size:14px;"><strong>🚀 Share Moi Kanakku</strong><br> If you like our app, please share it with your friends and family. More features and promotions are coming soon! </div><p style="margin-top:25px;font-size:14px;color:#666;"> Regards,<br><strong>Moi Kanakku Team</strong></p></td></tr><tr><td style="border-top:1px solid #eee;padding:15px;text-align:center;font-size:12px;color:#999;"> © 2026 Moi Kanakku. All rights reserved. </td></tr></table></td></tr></table></body></html>`;
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
