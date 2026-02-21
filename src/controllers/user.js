// User controllers: authentication, account management, and notifications
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const tokenService = require('../middlewares/tokenService');
const { sendPushNotification } = require('./notificationController');
const { NotificationType } = require('../models/notificationModels');
require('dotenv').config();
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');

// Common response messages
const userError = "குறிப்பிடப்பட்ட பயனர் இல்லை!";
const mobileError = "இந்த மொபைல் எண் ஏற்கனவே மற்றொரு பயனருக்கு பதிவு செய்யப்பட்டுள்ளது.";

exports.userController = {


    /**
     * Authenticate user and issue JWT.
     * Body: { email, password }
     */
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'தவறான மின்னஞ்சல் ஐடி!' } });
            }

            const isPasswordValid = await bcrypt.compare(password, user.um_password);
            if (!isPasswordValid) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'கடவுச்சொல் தவறானது.' } });
            }

            const userID = user.um_id;
            // Invalidate old token (single-session policy) and generate a new one
            tokenService.invalidatePreviousToken(userID);
            const jwtToken = tokenService.generateToken(userID);

            const response = {
                id: user.um_id,
                name: user.um_full_name,
                mobile: user.um_mobile,
                email: user.um_email,
                last_login: user.um_last_login,
                profile_image: user.um_profile_image || null,
                token: jwtToken
            };

            // Update last login timestamp
            await User.updateLastLogin(userID);

            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Register a new user, send welcome email and admin notification.
     * Body: { name, email, mobile, password }
     */
    create: async (req, res) => {
        const { name, email, mobile, password, fcm_token } = req.body;
        try {
            // Validate required fields
            if (!name || !email || !mobile || !password) {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'அனைத்து புலங்களும் (பெயர், மின்னஞ்சல், மொபைல், கடவுச்சொல்) தேவையானவை!' } });
            }

            // Check duplicates by email
            const mail = await User.findByEmail(email);
            if (mail) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!' } });
            }
            // Check duplicates by mobile number
            const mbl = await User.findByMobile(mobile);
            if (mbl) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!' } });
            }
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { name, email, mobile, password: hashedPassword, fcm_token: fcm_token || null };

            // Save user details
            const query = await User.create(newUser);
            if (query && query.insertId) {
                const userId = query.insertId;
                const registrationTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                // Welcome email content (HTML)
                const emailContent = `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;padding:30px;background:linear-gradient(180deg,#fff 0,#f9faff 100%);border:1px solid #e5e7f2;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.06)"><div style="text-align:center;padding-bottom:15px;border-bottom:1px solid #eee"><h2 style="color:#2f3490;margin:0;font-size:24px">🎉 Welcome to<span style="color:#4346d2"> Moi Kanakku!</span></h2><p style="margin-top:8px;color:#555;font-size:14px">Your personal event & relation manager</p></div><div style="padding:20px 10px"><p style="font-size:16px;color:#333;margin:0 0 10px">Hi<strong style="color:#2f3490"> ${name}</strong>,</p><p style="color:#444;margin:0 0 16px;line-height:1.6">We're excited to have you join our community! Moi Kanakku is built to make your experience <strong>seamless, productive, and enjoyable.</strong></p><div style="background-color:#f4f6ff;border-left:4px solid #2f3490;border-radius:8px;padding:15px 18px;margin:18px 0"><p style="margin:0 0 10px;color:#2f3490;font-weight:700">Here’s how you can get started:</p><ul style="list-style:none;padding-left:0;margin:0"><li style="margin-bottom:10px">✨<strong style="color:#2f3490;font-size:15px">Create & maintain special events, relations, and gift records (cash or kind).</strong></li><li style="margin-bottom:10px">📋<strong style="color:#2f3490;font-size:15px">Manage guests attending your events with detailed gift tracking.</strong></li><li style="margin-bottom:10px">📊<strong style="color:#2f3490;font-size:15px">View and filter records easily by function or relation.</strong></li><li>📁<strong style="color:#2f3490;font-size:15px">Export your data anytime in Excel format.</strong></li></ul></div><p style="color:#444;margin-top:20px;line-height:1.6">Thank you for choosing <strong>Moi Kanakku</strong>. We’re here to help you every step of the way!</p><p style="margin-top:15px;color:#333">Best regards,<br><strong style="color:#2f3490">Moi Kanakku Team</strong></p></div><hr style="border:none;border-top:1px solid #eee;margin:25px 0"><small style="display:block;text-align:center;color:#888;font-size:13px;line-height:1.5">© 2025 Moi Kanakku. All rights reserved.<br>If you did not sign up for Moi Kanakku, please ignore this email.</small></div>`;

                // Create SMTP transporter
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
                // Send welcome email to new user
                try {
                    const mailOptions = {
                        from: `"Info - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                        to: email,
                        subject: 'Welcome to Moi Kanakku!',
                        html: emailContent,
                    };
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    logger.error('Error sending welcome email:', emailError);
                    // Continue even if welcome email fails
                }

                // Admin notification email with complete user details
                const adminEmailContent = `<div style="margin:0;padding:40px 0;background-color:#f7f9fc">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background-color:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.08)">
                        <tr>
                            <td style="background:linear-gradient(135deg,#007bff,#00c6ff);color:#fff;text-align:center;padding:28px 20px">
                                <h1 style="margin:0;font-size:24px;letter-spacing:.5px">🎉 New User Registered Successfully</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:30px 35px;color:#333;font-size:16px;line-height:1.7">
                                <p style="margin-top:0">Hello <strong>Admin</strong>,</p>
                                <p style="margin-bottom:20px">A new user has just registered successfully. Here are the complete details:</p>
                                <table width="100%" cellspacing="0" cellpadding="10" style="border-collapse:collapse;font-size:15px;background-color:#f9fbfc;border-radius:8px">
                                    <tr>
                                        <td style="width:35%;font-weight:600;color:#555">User ID</td>
                                        <td style="color:#222">${userId}</td>
                                    </tr>
                                    <tr style="border-top:1px solid #e5eaf0">
                                        <td style="font-weight:600;color:#555">Name</td>
                                        <td style="color:#222">${name}</td>
                                    </tr>
                                    <tr style="border-top:1px solid #e5eaf0">
                                        <td style="font-weight:600;color:#555">Email</td>
                                        <td><a href="mailto:${email}" style="color:#007bff;text-decoration:none">${email}</a></td>
                                    </tr>
                                    <tr style="border-top:1px solid #e5eaf0">
                                        <td style="font-weight:600;color:#555">Mobile</td>
                                        <td style="color:#222">${mobile}</td>
                                    </tr>
                                    <tr style="border-top:1px solid #e5eaf0">
                                        <td style="font-weight:600;color:#555">Registration Time</td>
                                        <td style="color:#222">${registrationTime}</td>
                                    </tr>
                                </table>
                                <div style="margin-top:30px;background-color:#f1f5ff;border-left:4px solid #007bff;padding:14px 18px;border-radius:6px">
                                    <p style="margin:0;color:#333"><strong>Note: </strong>Please verify the user details in the admin panel for confirmation.</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#f1f4f7;text-align:center;color:#777;font-size:13px;padding:14px">© 2025 Moi Kanakku. All rights reserved.</td>
                        </tr>
                    </table>
                </div>`;
                
                // Send admin notification email to agprakash406@gmail.com
                try {
                    const adminMailOptions = {
                        from: `"Info - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                        to: 'agprakash406@gmail.com',
                        subject: 'New user registered successfully',
                        html: adminEmailContent,
                    };
                    await transporter.sendMail(adminMailOptions);
                } catch (adminEmailError) {
                    logger.error('Error sending admin notification email:', adminEmailError);
                    // Log error but don't fail the registration
                }
                // EOF email content --------------

                // Send FCM notification if fcm_token is provided
                if (fcm_token) {
                    try {
                        await sendPushNotification({
                            userId: userId,
                            title: 'பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்',
                            body: 'இப்போது நீங்கள் இந்த பயன்பாட்டைப் பயன்படுத்தலாம்',
                            token: fcm_token,
                            type: NotificationType.ACCOUNT
                        });
                        logger.info(`FCM notification sent to user ${userId} after successful registration`);
                    } catch (fcmError) {
                        logger.error('Error sending FCM notification after registration:', fcmError);
                        // Log error but don't fail the registration
                    }
                }

                return res.status(200).json({ responseType: "S", responseValue: { message: "பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "பயனர் பதிவு தோல்வியடைந்தது." } });
            }

        } catch (error) {
            logger.error('Error in user creation:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Update user profile.
     * Body: { id, name, mobile }
     */
    update: async (req, res) => {
        const { id, name, mobile } = req.body;
        try {
            // Check that mobile number is unique (excluding current user)
            const chkMobile = await User.checkMobileNo(mobile, id);
            if (chkMobile) {
                return res.status(404).json({ responseType: "F", responseValue: { message: mobileError } });
            }
            const chk = await User.findById(id);
            if (!chk) {
                return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
            }
            var query = await User.update(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "பயனர் தகவல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "புதுப்பித்தல் தோல்வியடைந்தது. மாற்றங்களை சேமிக்க முடியவில்லை." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Get a user's profile by ID.
     * Params: { id }
     */
    getUser: async (req, res) => {
        const userId = parseInt(req.params.id);
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
            }
            const response = {
                id: user.um_id,
                name: user.um_full_name,
                email: user.um_email,
                mobile: user.um_mobile,
                last_login: user.um_last_login,
                profile_image: user.um_profile_image || null
            };
            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Update password after verifying current password.
     * Body: { id, password, newPassword }
     */
    updatePassword: async (req, res) => {
        const { id, password, newPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
        }

        const isPasswordValid = await bcrypt.compare(password, user.um_password);
        if (!isPasswordValid) {
            return res.status(404).json({ responseType: "F", responseValue: { message: "கடவுச்சொல் எங்கள் பதிவுகளுடன் பொருந்தவில்லை." } });
        }

        // Password and user verified; hash new password
        var hashedPassword = await bcrypt.hash(newPassword, 10);

        var para = {
            "password": hashedPassword,
            "id": id
        };

        try {
            var query = await User.updatePassword(para);
            if (query) {
                // Send push notification when password is changed
                if (user.um_notification_token) {
                    try {
                        await sendPushNotification({
                            userId: id,
                            title: 'கடவுச்சொல் மாற்றப்பட்டது',
                            body: 'உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது. உங்கள் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த, வழக்கமாக கடவுச்சொல்லை மாற்றவும்.',
                            token: user.um_notification_token,
                            type: NotificationType.ACCOUNT
                        });
                    } catch (notificationError) {
                        // Log error but don't fail the request since password was changed successfully
                        logger.error('Error sending push notification for password change:', notificationError);
                    }
                }
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "கடவுச்சொல்லை மாற்ற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Permanently delete a user.
     * Body: { userId }
     */
    deleteUser: async (req, res) => {
        const { userId } = req.body;
        try {
            const chk = await User.findById(userId);
            if (!chk) {
                return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
            }
            const query = await User.deleteUser(userId);
            if (query) {
                // Remove token from memory when user is deleted (security best practice)
                tokenService.removeToken(userId);
                return res.status(200).json({ responseType: "S", responseValue: { message: "பயனர் நிரந்தரமாக நீக்கப்பட்டார்." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "பயனர் நீக்குதல் தோல்வியடைந்தது!" } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Reset password by email (admin/forgot password flow).
     * Body: { email, password }
     */
    resetPassword: async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
        }

        // Hash the provided password
        var hashedPassword = await bcrypt.hash(password, 10);

        var para = {
            "password": hashedPassword,
            "id": user.um_id
        };

        try {
            var query = await User.updatePassword(para);
            if (query) {
                // Send push notification when password is reset
                if (user.um_notification_token) {
                    try {
                        await sendPushNotification({
                            userId: user.um_id,
                            title: 'கடவுச்சொல் மீட்டமைக்கப்பட்டது',
                            body: 'உங்கள் கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது. உங்கள் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த, வழக்கமாக கடவுச்சொல்லை மாற்றவும்.',
                            token: user.um_notification_token,
                            type: NotificationType.ACCOUNT
                        });
                    } catch (notificationError) {
                        // Log error but don't fail the request since password was reset successfully
                        logger.error('Error sending push notification for password reset:', notificationError);
                    }
                }
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "கடவுச்சொல்லை மீட்டமைக்க முடியவில்லை." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Update push notification token for a user.
     * Body: { userId, token }
     */
    updateNotificationToken: async (req, res) => {
        const { userId, token } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
        }
        // Persist the token for future notifications
        try {
            var query = await User.updateToken(userId, token);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "பயனர் டோக்கன் வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "பயனர் டோக்கன் புதுப்பித்தல் தோல்வியடைந்தது!" } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Update user profile picture.
     * Body: { userId }
     * File: profile image file (multipart/form-data with field name 'profileImage')
     */
    updateProfilePicture: async (req, res) => {
        const uploadDir = './../gp.prasowlabs.in/uploads';
        const tempDir = path.join(uploadDir, 'temp');

        // Ensure directories exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, tempDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
            }
        });

        const upload = multer({ 
            storage, 
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                // Accept only image files
                const allowedTypes = /jpeg|jpg|png|gif|webp/;
                const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = allowedTypes.test(file.mimetype);
                
                if (extname && mimetype) {
                    return cb(null, true);
                } else {
                    cb(new Error('பட கோப்புகள் மட்டுமே அனுமதிக்கப்படுகின்றன (jpeg, jpg, png, gif, webp)'));
                }
            }
        }).single('profileImage');

        upload(req, res, async (err) => {
            try {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(400).json({ 
                                responseType: "F", 
                                responseValue: { message: 'கோப்பு அளவு மிகப் பெரியது! அதிகபட்ச அளவு 5MB.' } 
                            });
                        }
                    }
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: err.message || 'கோப்பு பதிவேற்ற பிழை' } 
                    });
                }

                if (!req.file) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: 'கோப்பு பதிவேற்றப்படவில்லை! தயவுசெய்து ஒரு சுயவிவர படத்தை பதிவேற்றவும்.' } 
                    });
                }

                const { userId } = req.body;

                if (!userId) {
                    // Clean up temp file if validation fails
                    if (req.file && req.file.path) {
                        try {
                            fs.unlinkSync(req.file.path);
                        } catch (cleanupError) {
                            // Ignore cleanup errors
                        }
                    }
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: 'பயனர் ஐடி தேவையானது!' } 
                    });
                }

                // Verify user exists
                const user = await User.findById(userId);
                if (!user) {
                    // Clean up temp file
                    if (req.file && req.file.path) {
                        try {
                            fs.unlinkSync(req.file.path);
                        } catch (cleanupError) {
                            // Ignore cleanup errors
                        }
                    }
                    return res.status(404).json({ 
                        responseType: "F", 
                        responseValue: { message: userError } 
                    });
                }

                // Create profile directory for user
                const userProfileDir = path.join(uploadDir, userId, 'profile');
                if (!fs.existsSync(userProfileDir)) {
                    fs.mkdirSync(userProfileDir, { recursive: true });
                }

                // Delete old profile image if it exists
                if (user.um_profile_image) {
                    try {
                        // Extract filename from path (assuming format: uploads/userId/profile/filename)
                        const oldImagePath = path.join(uploadDir, user.um_profile_image.replace('uploads/', ''));
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    } catch (deleteError) {
                        logger.error('Error deleting old profile image:', deleteError);
                        // Continue even if old image deletion fails
                    }
                }

                // Move file from temp to final location
                const tempFilePath = req.file.path;
                const finalFilePath = path.join(userProfileDir, req.file.filename);
                
                try {
                    // Move the file
                    fs.renameSync(tempFilePath, finalFilePath);
                    
                    // Verify file was moved successfully
                    if (!fs.existsSync(finalFilePath)) {
                        return res.status(500).json({ 
                            responseType: "F", 
                            responseValue: { message: 'கோப்பு வெற்றிகரமாக சேமிக்கப்படவில்லை!' } 
                        });
                    }

                    // Save path to database (use forward slashes for URL-friendly path)
                    const imagePath = `uploads/${userId}/profile/${req.file.filename}`;
                    const updateResult = await User.updateProfileImage(userId, imagePath);
                    
                    if (updateResult) {
                        // Fetch updated user data to return complete profile
                        const updatedUser = await User.findById(userId);
                        const userProfile = {
                            id: updatedUser.um_id,
                            name: updatedUser.um_full_name,
                            email: updatedUser.um_email,
                            mobile: updatedUser.um_mobile,
                            last_login: updatedUser.um_last_login,
                            profile_image: updatedUser.um_profile_image || null
                        };
                        
                        return res.status(200).json({ 
                            responseType: "S", 
                            responseValue: { 
                                message: "சுயவிவர படம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
                                user: userProfile
                            } 
                        });
                    } else {
                        // If database update fails, try to clean up the uploaded file
                        try {
                            if (fs.existsSync(finalFilePath)) {
                                fs.unlinkSync(finalFilePath);
                            }
                        } catch (cleanupError) {
                            logger.error('Error cleaning up file after DB update failure:', cleanupError);
                        }
                        return res.status(500).json({ 
                            responseType: "F", 
                            responseValue: { message: 'தரவுத்தளத்தில் சுயவிவர படத்தை புதுப்பிக்க முடியவில்லை.' } 
                        });
                    }
                } catch (moveError) {
                    logger.error('Error moving file:', moveError);
                    // Clean up temp file
                    try {
                        if (fs.existsSync(tempFilePath)) {
                            fs.unlinkSync(tempFilePath);
                        }
                    } catch (cleanupError) {
                        logger.error('Error cleaning up temp file:', cleanupError);
                    }
                    
                    return res.status(500).json({ 
                        responseType: "F", 
                        responseValue: { message: `கோப்பை சேமிக்க முடியவில்லை: ${moveError.message}` } 
                    });
                }
            } catch (error) {
                // Clean up temp file on error
                if (req.file && req.file.path) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (cleanupError) {
                        // Ignore cleanup errors
                    }
                }
                logger.error('Error in updateProfilePicture:', error);
                return res.status(500).json({ 
                    responseType: "F", 
                    responseValue: { message: error.toString() } 
                });
            }
        });
    },

    /**
     * Get important user details from gp_moi_user_master table.
     * Params: { id }
     */
    getImportantUserDetails: async (req, res) => {
        const userId = parseInt(req.params.id);
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
            }
            const response = {
                id: user.um_id,
                name: user.um_full_name,
                email: user.um_email,
                mobile: user.um_mobile,
                last_login: user.um_last_login,
                profile_image: user.um_profile_image || null,
                create_date: user.um_create_dt,
                update_date: user.um_update_dt,
                status: user.um_status
            };
            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
