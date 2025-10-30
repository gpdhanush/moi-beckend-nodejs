// User controllers: authentication, account management, and notifications
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const tokenService = require('../middlewares/tokenService');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Common response messages
const userError = "The specified user does not exist!";
const mobileError = "A mobile number is already registered to another user.";

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
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Invalid Email ID!' } });
            }

            const isPasswordValid = await bcrypt.compare(password, user.um_password);
            if (!isPasswordValid) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'The password is incorrect.' } });
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
        var { name, email, mobile, password } = req.body;
        try {
            // Check duplicates by email
            const mail = await User.findByEmail(email);
            if (mail) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'This email is already registered!' } });
            }
            // Check duplicates by mobile number
            const mbl = await User.findByMobile(mobile);
            if (mbl) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'This mobile is already registered!' } });
            }
            // Hash the password
            password = await bcrypt.hash(password, 10);
            var newUser = { name, email, mobile, password };

            // Save user details
            var query = await User.create(newUser);
            if (query) {
                // Welcome email content (HTML)
                const emailContent = `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;padding:30px;background:linear-gradient(180deg,#fff 0,#f9faff 100%);border:1px solid #e5e7f2;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.06)"><div style="text-align:center;padding-bottom:15px;border-bottom:1px solid #eee"><h2 style="color:#2f3490;margin:0;font-size:24px">🎉 Welcome to<span style="color:#4346d2">Moi Kanakku!</span></h2><p style="margin-top:8px;color:#555;font-size:14px">Your personal event & relation manager</p></div><div style="padding:20px 10px"><p style="font-size:16px;color:#333;margin:0 0 10px">Hi<strong style="color:#2f3490"> ${name}</strong>,</p><p style="color:#444;margin:0 0 16px;line-height:1.6">We're excited to have you join our community! Moi Kanakku is built to make your experience <strong>seamless, productive, and enjoyable.</strong></p><div style="background-color:#f4f6ff;border-left:4px solid #2f3490;border-radius:8px;padding:15px 18px;margin:18px 0"><p style="margin:0 0 10px;color:#2f3490;font-weight:700">Here’s how you can get started:</p><ul style="list-style:none;padding-left:0;margin:0"><li style="margin-bottom:10px">✨<strong style="color:#2f3490;font-size:15px">Create & maintain special events, relations, and gift records (cash or kind).</strong></li><li style="margin-bottom:10px">📋<strong style="color:#2f3490;font-size:15px">Manage guests attending your events with detailed gift tracking.</strong></li><li style="margin-bottom:10px">📊<strong style="color:#2f3490;font-size:15px">View and filter records easily by function or relation.</strong></li><li>📁<strong style="color:#2f3490;font-size:15px">Export your data anytime in Excel format.</strong></li></ul></div><p style="color:#444;margin-top:20px;line-height:1.6">Thank you for choosing <strong>Moi Kanakku</strong>. We’re here to help you every step of the way!</p><p style="margin-top:15px;color:#333">Best regards,<br><strong style="color:#2f3490">Moi Kanakku Team</strong></p></div><hr style="border:none;border-top:1px solid #eee;margin:25px 0"><small style="display:block;text-align:center;color:#888;font-size:13px;line-height:1.5">© 2025 Moi Kanakku. All rights reserved.<br>If you did not sign up for Moi Kanakku, please ignore this email.</small></div>`;

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
                const mailOptions = {
                    from: `"Info - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Welcome to Moi Kanakku!',
                    html: emailContent,
                };
                await transporter.sendMail(mailOptions);

                // Admin notification email
                const adminEmailContent = `<div style="margin:0;padding:40px 0;background-color:#f7f9fc"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background-color:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.08)"><tr><td style="background:linear-gradient(135deg,#007bff,#00c6ff);color:#fff;text-align:center;padding:28px 20px"><h1 style="margin:0;font-size:24px;letter-spacing:.5px">🎉 New User Registered Successfully</h1></td></tr><tr><td style="padding:30px 35px;color:#333;font-size:16px;line-height:1.7"><p style="margin-top:0">Hello <strong>Admin</strong>,</p><p style="margin-bottom:20px">A new user has just registered successfully. Here are the details:</p><table width="100%" cellspacing="0" cellpadding="10" style="border-collapse:collapse;font-size:15px;background-color:#f9fbfc;border-radius:8px"><tr><td style="width:35%;font-weight:600;color:#555">Name</td><td style="color:#222">${name}</td></tr><tr style="border-top:1px solid #e5eaf0"><td style="font-weight:600;color:#555">Email</td><td><a href="mailto:${email}" style="color:#007bff;text-decoration:none">${email}</a></td></tr><tr style="border-top:1px solid #e5eaf0"><td style="font-weight:600;color:#555">Mobile</td><td style="color:#222">${mobile}</td></tr><tr style="border-top:1px solid #e5eaf0"><td style="font-weight:600;color:#555">Time</td><td style="color:#222">${new Date().toLocaleString()}</td></tr></table><div style="margin-top:30px;background-color:#f1f5ff;border-left:4px solid #007bff;padding:14px 18px;border-radius:6px"><p style="margin:0;color:#333"><strong>Note: </strong>Please verify the user details in the admin panel for confirmation.</p></div></td></tr><tr><td style="background-color:#f1f4f7;text-align:center;color:#777;font-size:13px;padding:14px">© 2025 Moi Kanakku. All rights reserved.</td></tr></table></div>`;
                const adminMailOptions = {
                    from: `"Info - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                    to: 'agprakash406@gmail.com',
                    subject: 'New user registered successfully',
                    html: adminEmailContent,
                };
                await transporter.sendMail(adminMailOptions);
                // EOF email content --------------

                return res.status(200).json({ responseType: "S", responseValue: { message: "User registered successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "User registered failed." } });
            }

        } catch (error) {
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
                return res.status(200).json({ responseType: "S", responseValue: { message: "User information updated successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "Update failed. Unable to save changes." } });
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
                last_login: user.um_last_login
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
            return res.status(404).json({ responseType: "F", responseValue: { message: "The password doesn't match our records." } });
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
                return res.status(200).json({ responseType: "S", responseValue: { message: "Your password has been changed successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "Failed to change password. Please try again." } });
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
            var query = await User.deleteUser(userId);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "User permanently deleted successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "User permanently deleted failed!" } });
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
                return res.status(200).json({ responseType: "S", responseValue: { message: "Your password has been reset successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "Failed to reset password." } });
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
                return res.status(200).json({ responseType: "S", responseValue: { message: "User token updated successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "User token updated failed!" } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
