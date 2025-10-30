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
                const emailContent = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px">
    <h2 style=color:#2f3490;text-align:center>Welcome to Moi Kanakku!</h2>
    <p>Hi <strong style=color:#2f3490>${name}</strong>,
    <p>We\'re excited to have you join our community! Moi Kanakku is designed to make your experience seamless, productive, and enjoyable.
    <p>Here\'s how you can get started:
    <ul style=list-style-type:none>
      <li>😊 <strong style=color:#2f3490;font-size:14px>Create & Maintain the special events, relations, functions gifts in cash.</strong>
      <li>😊 <strong style=color:#2f3490;font-size:14px>Create & manage the guest who attend those event along with gift details.</strong>
      <li>😊 <strong style=color:#2f3490;font-size:14px>View function based records.</strong>
      <li>😊 <strong style=color:#2f3490;font-size:14px>All the datas export in excel is available.</strong>
    </ul>
    <p>Thank you for choosing Moi Kanakku. We\'re here to help you every step of the way!
    <p>Best regards,<br><strong>Moi Kanakku Team</strong>
      <hr style="margin:20px 0"><small style=display:block;text-align:center;color:#888>If you did not sign up for Moi Kanakku, please ignore this email.</small>
  </div>`;

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
                const adminEmailContent = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px">
	<h3 style=color:#2f3490;text-align:center>New user registered successfully</h3>
	<p><strong style=color:#2f3490>Name:</strong> ${name}</p>
	<p><strong style=color:#2f3490>Email:</strong> ${email}</p>
	<p><strong style=color:#2f3490>Mobile:</strong> ${mobile}</p>
	<p style=color:#666;font-size:12px>Time: ${new Date().toLocaleString()}</p>
	</div>`;
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
