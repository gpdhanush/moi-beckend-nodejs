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

            const expireTime = new Date(Date.now() + 10 * 60 * 1000);

            

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
                const emailContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f7fb;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden;"><tr><td style="background:#2f3490;color:#ffffff;text-align:center;padding:20px;"><h2 style="margin:0;font-size:22px;">🔁 Account Restore OTP</h2></td></tr><tr><td style="padding:30px;color:#333333;"><p style="margin:0 0 15px 0;font-size:16px;">Hi <strong>${user.full_name || user.um_full_name}</strong>,</p><p style="margin:0 0 20px 0;font-size:15px;color:#555;">Use the OTP below to verify ownership and restore your account.</p><div style="text-align:center;margin:30px 0;"><span style="display:inline-block;padding:16px 26px;background:#f3f4ff;border-radius:8px;font-size:34px;letter-spacing:8px;font-family:monospace;font-weight:700;color:#2f3490;">${otpData.otp}</span></div><p style="text-align:center;font-size:14px;color:#666;margin:0;">This OTP will expire in <strong>10 minutes</strong>.</p><p style="margin-top:20px;font-size:14px;color:#777;">If you did not request this account restore, please ignore this email.</p></td></tr><tr><td style="border-top:1px solid #f1f1f1;padding:20px;font-size:14px;color:#666;">Regards,<br><strong style="color:#2f3490;">Moi Kanakku Team</strong></td></tr></table><p style="max-width:620px;margin:20px auto 0;text-align:center;font-size:12px;color:#9ca3af;">© 2026 Moi Kanakku. All rights reserved.</p></td></tr></table></body></html>`;

                const mailOptions = {
                    from: `"Admin - Moi Kanakku Team" <${process.env.EMAIL_USER}>`,
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
                otpData.expireTime = expireTime.toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                const emailContent = `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;"><tr><td style="background:#2f3490;padding:22px;text-align:center;color:#ffffff;"><h2 style="margin:0;font-size:22px;">🔐 Email Verification</h2></td></tr><tr><td style="padding:30px 28px;color:#333333;"><p style="margin:0 0 18px 0;font-size:16px;">Hi <strong>${user.full_name}</strong>,</p><p style="margin:0 0 20px 0;font-size:15px;color:#555;">Use the following OTP to verify your email address.</p><div style="text-align:center;margin:30px 0;"><span style="display:inline-block;padding:16px 26px;background:#f3f4ff;border-radius:8px;font-size:34px;letter-spacing:10px;font-family:monospace;font-weight:700;color:#2f3490;">${otpData.otp}</span></div><p style="text-align:center;font-size:14px;color:#666;margin:0;">This OTP will expire in <strong>10 minutes</strong></p><p style="text-align:center;font-size:13px;color:#999;margin-top:6px;">Expires at: <strong>${otpData.expireTime}</strong></p></td></tr><tr><td style="border-top:1px solid #f1f1f1;padding:20px 28px;font-size:14px;color:#666;">Regards,<br><strong style="color:#2f3490;">Moi Kanakku Team</strong></td></tr></table></td></tr></table></body></html>`;

                const mailOptions = {
                    from: `"Admin - Moi Kanakku Team" <${process.env.EMAIL_USER}>`,
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

                const emailContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);"><tr><td style="background:#2f3490;padding:22px;text-align:center;color:#ffffff;"><h2 style="margin:0;font-size:22px;font-weight:600;">🔑 Forgot Password - OTP</h2></td></tr><tr><td style="padding:30px 28px;color:#333333;"><p style="margin:0 0 18px 0;font-size:16px;">Hi <strong>${user.full_name || user.um_full_name}</strong>,</p><p style="margin:0 0 20px 0;font-size:15px;color:#555;">Use the following OTP to reset your password.</p><div style="text-align:center;margin:30px 0;"><span style="display:inline-block;padding:16px 28px;background:#f3f4ff;border-radius:8px;font-size:34px;letter-spacing:10px;font-family:monospace;font-weight:700;color:#2f3490;">${otpData.otp}</span></div><p style="text-align:center;font-size:14px;color:#666;margin:0;">This OTP will expire in <strong>10 minutes</strong>.</p><p style="margin-top:20px;font-size:14px;color:#777;">If you did not request a password reset, please ignore this email.</p></td></tr><tr><td style="border-top:1px solid #f1f1f1;padding:20px 28px;font-size:14px;color:#666;">Regards,<br><strong style="color:#2f3490;">Moi Kanakku Team</strong></td></tr></table><p style="max-width:620px;margin:20px auto 0;text-align:center;font-size:12px;color:#9ca3af;">© 2026 Moi Kanakku. All rights reserved.</p></td></tr></table></body></html>`;

                const mailOptions = {
                    from: `"Admin - Moi Kanakku Team" <${process.env.EMAIL_USER}>`,
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

    /**
     * Send bulk emails to multiple users
     * Body: { userIds: [], subject, body, type? }
     * type: 'notification' | 'announcement' | 'custom' (default: 'custom')
     */
    sendBulkEmails: async (req, res) => {
        try {
            const { userIds, subject, body, type } = req.body;

            // Validate input
            if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பயனர் ஐடிகளின் வரிசை தேவையானது.' }
                });
            }

            if (!subject || !body) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Subject மற்றும் body தேவையானது.' }
                });
            }

            const db = require('../config/database');
            const { toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

            // Get users and their emails
            const userIdsFormatted = userIds.map(id => toBinaryUUID(id));
            const placeholders = userIdsFormatted.map(() => '?').join(',');
            
            const [users] = await db.query(
                `SELECT u.id, u.email, u.full_name
                 FROM users u
                 WHERE u.id IN (${placeholders}) AND (u.is_deleted = 0 OR u.is_deleted IS NULL)`,
                userIdsFormatted
            );

            if (users.length === 0) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'கொடுக்கப்பட்ட பயனர் ஐடிகளுக்கு பயனர்கள் கிடைக்கவில்லை.' }
                });
            }

            // Setup email transporter (same as sendEmail)
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

            // Process each email
            const results = {
                totalRequested: userIds.length,
                usersFound: users.length,
                successful: 0,
                failed: 0,
                failedUsers: [],
                successfulUsers: []
            };

            for (const user of users) {
                try {
                    const mailOptions = {
                      from: `"Moi Kanakku" <${process.env.EMAIL_USER}>`,
                      to: user.email,
                      subject: subject,
                      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Moi Kanakku</title></head><body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif;"><div style="display:none;font-size:1px;color:#f5f7fb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">Moi Kanakku notification</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden;"><tr><td style="background:#2f3490;color:#ffffff;text-align:center;padding:20px;"><h2 style="margin:0;font-size:22px;">📧 Moi Kanakku</h2><p style="margin:5px 0 0;font-size:13px;color:#dcdcff;">Manage events, relations & gifts easily</p></td></tr><tr><td style="padding:30px;color:#333333;line-height:1.6;"><p style="margin:0 0 15px;font-size:16px;">Hi <strong>${user.full_name || "User"}</strong>,</p><div style="margin:20px 0;font-size:15px;color:#555;">${body}</div></td></tr><tr><td style="border-top:1px solid #f1f1f1;padding:20px;font-size:14px;color:#666;">Regards,<br><strong style="color:#2f3490;">Moi Kanakku Team</strong></td></tr></table><p style="max-width:620px;margin:20px auto 0;text-align:center;font-size:12px;color:#9ca3af;">© 2026 Moi Kanakku. All rights reserved.<br>If you received this email by mistake, please ignore it.</p></td></tr></table></body></html>`,
                    };

                    await transporter.sendMail(mailOptions);
                    results.successful++;
                    results.successfulUsers.push({
                        userId: fromBinaryUUID(user.id),
                        email: user.email
                    });

                    logger.info(`Email sent to ${user.email} (${user.id})`);

                } catch (emailError) {
                    logger.error(`Failed to send email to ${user.email}:`, emailError);
                    results.failed++;
                    results.failedUsers.push({
                        userId: fromBinaryUUID(user.id),
                        email: user.email,
                        reason: emailError.message || 'Unknown error'
                    });
                }
            }

            return res.status(200).json({
                responseType: results.successful > 0 ? "S" : "F",
                responseValue: {
                    message: `${results.successful} பயனர்களுக்கு மின்னஞ்சல்கள் வெற்றிகரமாக அனுப்பப்பட்டன.`,
                    ...results
                }
            });

        } catch (error) {
            logger.error('Error in sendBulkEmails:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },
}
