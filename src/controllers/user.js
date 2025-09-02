const User = require('../models/user');
const bcrypt = require('bcryptjs');
const tokenService = require('../middlewares/tokenService'); // Import the tokenService
require('dotenv').config();
const nodemailer = require('nodemailer');

const userError = "The specified user does not exist!";
const mobileError = "A mobile number is already registered to another user.";

exports.userController = {


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

            // UPDATE LAST LOGIN TIMESTAMP
            await User.updateLastLogin(userID);

            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    create: async (req, res) => {
        var { name, email, mobile, password } = req.body;
        try {
            // CHECK BY EMAIL
            const mail = await User.findByEmail(email);
            if (mail) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'This email is already registered!' } });
            }
            // CHECK BY MOBILE NUMBER
            const mbl = await User.findByMobile(mobile);
            if (mbl) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'This mobile is already registered!' } });
            }
            // HASHED PASSWORD
            password = await bcrypt.hash(password, 10);
            var newUser = { name, email, mobile, password };

            // SAVE USER DETAILS
            var query = await User.create(newUser);
            if (query) {
                // WELCOME EMAIL CONTENT
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
                // EOF EMAIL CONTENT --------------

                return res.status(200).json({ responseType: "S", responseValue: { message: "User registered successfully." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "User registered failed." } });
            }

        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    update: async (req, res) => {
        const { id, name, mobile } = req.body;
        try {
            /// CHECK MOBILE NUMBER
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

        // PASSWORD AND USER VERIFIED
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
    resetPassword: async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
        }

        // PASSWORD AND USER VERIFIED
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

    updateNotificationToken: async (req, res) => {
        const { userId, token } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ responseType: "F", responseValue: { message: userError } });
        }
        // await User.updateToken(userId, token);
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
