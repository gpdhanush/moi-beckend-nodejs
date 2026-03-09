require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/user');
const logger = require('../config/logger');
const { sendPushNotification } = require('./notificationController');

exports.controller = {
    /**
     * Unified OTP verification endpoint. Body: { email, id, otp, type }
     * type: 'forgot' | 'verification' | 'restore' (default: 'forgot' for backward compatibility)
     */
    verifyOtp: async (req, res) => {
        const { emailId, email, id, otp, type } = req.body;
        
        try {
            // For backward compatibility, use emailId if provided
            let user = null;
            let verifyType = type || 'forgot';
            
            // For restore flow, we need to find deleted users
            const useIncludingDeleted = verifyType === 'restore';
            
            // Find user by emailId (legacy), email, or id
            if (emailId) {
                user = useIncludingDeleted 
                    ? await User.findByEmailIncludingDeleted(emailId)
                    : await User.findByEmail(emailId);
            } else if (email) {
                user = useIncludingDeleted 
                    ? await User.findByEmailIncludingDeleted(email)
                    : await User.findByEmail(email);
            } else if (id) {
                user = useIncludingDeleted 
                    ? await User.findByIdIncludingDeleted(id)
                    : await User.findById(id);
            }
            
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'தவறான மின்னஞ்சல் ஐடி!' } });
            }
            
            if (!otp) {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'OTP is required' } });
            }
            
            // Route to appropriate verification method
            let result;
            if (verifyType === 'forgot') {
                result = await User.verifyForgotOTP(user.id, otp);
            } else if (verifyType === 'verification' || verifyType === 'verify') {
                result = await User.verifyEmailOTP(user.id, otp);
            } else if (verifyType === 'restore') {
                result = await User.verifyRestoreOTP(user.id, otp);
            } else {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'Unknown OTP type' } });
            }
            
            if (!result.success) {
                return res.status(400).json({ responseType: "F", responseValue: { message: result.message } });
            }
            
            return res.status(200).json({ responseType: "S", responseValue: { message: result.message } });
        } catch (error) {
            logger.error('verifyOtp failed', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Unified sendEmail endpoint. Body: { type, email, id, subject, content }
     * type: 'restore' | 'verification' | 'forgot' | 'custom'
     */
    sendEmail: async (req, res) => {
        const { type, email, id, subject, content } = req.body;

        try {
            if (!type) {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'type is required' } });
            }

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                }
            });

            // helper: send push notification if requested
            const sendNotifIfRequested = async (userId, title, body, token, notifType) => {
                try {
                    if (req.body.sendNotification) {
                        // userId or token should be provided in body
                        const nUserId = req.body.notificationUserId || userId;
                        const nToken = req.body.notificationToken || token;
                        const nTitle = req.body.notificationTitle || title;
                        const nBody = req.body.notificationBody || body;
                        const nType = req.body.notificationType || notifType;
                        if (nUserId && nToken && nTitle && nBody) {
                            await sendPushNotification({ userId: nUserId, title: nTitle, body: nBody, token: nToken, type: nType });
                        } else {
                            logger.warn('sendEmail: sendNotification requested but missing notification payload');
                        }
                    }
                } catch (notifErr) {
                    logger.error('Error sending push notification from sendEmail:', notifErr);
                }
            };

            // Handler for restore: send RESTORE OTP to deleted account
            if (type === 'restore') {
                const targetEmail = email;
                if (!targetEmail) return res.status(400).json({ responseType: "F", responseValue: { message: 'email is required for restore' } });
                const user = await User.findByEmailIncludingDeleted(targetEmail);
                if (!user) return res.status(404).json({ responseType: "F", responseValue: { message: 'தவறான மின்னஞ்சல் ஐடி!' } });
                if (!user.is_deleted) return res.status(400).json({ responseType: "F", responseValue: { message: 'இந்த கணக்கு நீக்கப்படவில்லை.' } });

                const otpData = await User.createRestoreOTP(user.id);
                const emailContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
    <div style="max-width:620px;margin:0 auto;padding:30px;background:#fff;border:1px solid #eaeaea;border-radius:8px;">
        <h2 style="color:#2f3490;margin-top:0;">🔁 Account Restore OTP</h2>
        <p>Hi <strong>${user.full_name || user.um_full_name}</strong>,</p>
        <p style="font-size:28px;letter-spacing:6px;text-align:center;font-family:monospace;font-weight:bold;color:#2f3490;">${otpData.otp}</p>
        <p>This OTP will expire in 10 minutes. Enter this OTP to verify ownership and restore your account.</p>
        <p>If you did not request this, please ignore.</p>
        <p style="margin-top:30px;color:#666;">Regards,<br/><strong>Moi Kanakku Team</strong></p>
    </div>
</body>
</html>`;

                const mailOptions = {
                    from: `"Help - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                    to: targetEmail,
                    subject: subject || '🔁 Moi Kanakku - Account Restore OTP',
                    html: emailContent
                };
                await transporter.sendMail(mailOptions);
                await sendNotifIfRequested(user.id, 'Account restored', 'Your account restore OTP was sent', user.notification_token, 'account');
                return res.status(200).json({ responseType: "S", responseValue: { message: 'OTP sent for restore', expires_in_minutes: 10 } });
            }

            // Handler for verification: send VERIFY OTP
            if (type === 'verification' || type === 'verify') {
                let user = null;
                if (id) user = await User.findById(id);
                else if (email) user = await User.findByEmail(email);
                if (!user) return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
                if (user.is_verified) return res.status(400).json({ responseType: "F", responseValue: { message: 'இந்த மின்னஞ்சல் ஏற்கனவே சரிபார்க்கப்பட்டுவிட்டது!' } });

                const otpData = await User.createVerificationOTP(user.id);
                const emailContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
    <div style="max-width:620px;margin:0 auto;padding:30px;background:#fff;border:1px solid #eaeaea;border-radius:8px;">
        <h2 style="color:#2f3490;margin-top:0;">🔐 Email Verification</h2>
        <p>Hi <strong>${user.full_name || user.um_full_name}</strong>,</p>
        <p style="font-size:28px;letter-spacing:8px;text-align:center;font-family:monospace;font-weight:bold;color:#2f3490;">${otpData.otp}</p>
        <p>This OTP will expire in 10 minutes. Enter this OTP to verify your email.</p>
        <p style="margin-top:30px;color:#666;">Regards,<br/><strong>Moi Kanakku Team</strong></p>
    </div>
</body>
</html>`;

                const mailOptions = {
                    from: `"Help - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: subject || '🔐 Moi Kanakku - Email Verification',
                    html: emailContent
                };
                await transporter.sendMail(mailOptions);
                await sendNotifIfRequested(user.id, 'Verify email', 'Verification OTP sent to your email', user.notification_token, 'account');
                return res.status(200).json({ responseType: "S", responseValue: { message: 'Verification OTP sent', expires_in_minutes: 10 } });
            }

            // Handler for forgot password: use unified user_otps table
            if (type === 'forgot') {
                const targetEmail = email;
                if (!targetEmail) return res.status(400).json({ responseType: "F", responseValue: { message: 'email is required for forgot' } });
                const user = await User.findByEmail(targetEmail);
                if (!user) return res.status(404).json({ responseType: "F", responseValue: { message: 'தவறான மின்னஞ்சல் ஐடி!' } });

                // Create forgot OTP using unified method
                const otpData = await User.createForgotOTP(user.id);

                const emailContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5;">
    <div style="max-width:620px;margin:0 auto;padding:30px;background:#fff;border:1px solid #eaeaea;border-radius:8px;">
        <h2 style="color:#2f3490;margin-top:0;">Forgot Password - OTP</h2>
        <p>Hi <strong>${user.full_name || user.um_full_name}</strong>,</p>
        <p>Your OTP is <strong style="font-size:24px;color:#2f3490;">${otpData.otp}</strong>. It is valid for 10 minutes.</p>
        <p style="margin-top:30px;color:#666;">Regards,<br/><strong>Moi Kanakku Team</strong></p>
    </div>
</body>
</html>`;

                const mailOptions = {
                    from: `"Help - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                    to: targetEmail,
                    subject: subject || 'Forgot Password - OTP',
                    html: emailContent
                };
                await transporter.sendMail(mailOptions);
                await sendNotifIfRequested(user.id, 'Forgot password', 'Forgot password OTP sent to your email', user.notification_token, 'account');
                return res.status(200).json({ responseType: "S", responseValue: { message: 'Forgot OTP sent' } });
            }

            // Fallback: custom/raw send using provided subject/content
            if (type === 'custom' || type === 'raw') {
                if (!email || !content) return res.status(400).json({ responseType: "F", responseValue: { message: 'email and content required for custom send' } });
                const mailOptions = {
                    from: `"Admin - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: subject || 'Moi Kanakku',
                    html: content,
                };
                await transporter.sendMail(mailOptions);
                // No user context available for notification here; try with provided notification payload
                await sendNotifIfRequested(null, subject || 'Moi Kanakku', subject || 'Email sent', null, 'general');
                return res.status(200).json({ responseType: "S", responseValue: { message: 'மின்னஞ்சல் வெற்றிகரமாக அனுப்பப்பட்டது.' } });
            }

            return res.status(400).json({ responseType: "F", responseValue: { message: 'Unknown type' } });
        } catch (error) {
            logger.error('sendEmail failed', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
