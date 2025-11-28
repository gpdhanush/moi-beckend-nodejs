require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Model = require('../models/emailModels');
// const { verify } = require('jsonwebtoken');

exports.controller = {
    forgotOtp: async (req, res) => {
        const { emailId } = req.body;
        const user = await User.findByEmail(emailId);
        if (!user) {
            return res.status(404).json({ responseType: "F", responseValue: { message: 'Invalid Email ID!' } });
        }
        const userName = user.um_full_name;
        // RANDOM NUMBER
        const otp = Math.floor(1000 + Math.random() * 9000);
        const timer = Math.floor(Date.now() / 1000) + 120;
        await Model.saveOtp(otp, timer, emailId);
        // EMAIL CONTENT
        const emailContent = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:0px;width:95%;padding:10px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Moi Kanakku</a>
            </div>
            <p style="font-size:1.1em">Hi <span style="font-size:1.1em;font-weight: bold;color: #2c2c54;">${userName}</span>,</p>
            <p>Thank you for using Moi Kanakku. To complete the Forgot Password process, please use the following OTP. This OTP is valid for the next 2 minutes.</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
            <p style="font-size:0.9em;">Regards, <br />Moi Kanakku </p>
            <hr style="border:none;border-top:1px solid #eee" /></div></div>`;
        try {
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
                // from: process.env.EMAIL_USER,
                from: `"Help - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                to: emailId,
                subject: 'Forgot Password - OTP',
                html: emailContent,
            };
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ responseType: "S", responseValue: { message: 'Email sent successfully.' } });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    verifyOtp: async (req, res) => {
        const { emailId, otp } = req.body;
        try {
            const user = await User.findByEmail(emailId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Invalid Email ID!' } });
            }
            const tempOtp = user.um_otp;
            const otpExp = user.um_otp_exp;
            if (tempOtp == otp) {
                if ((Date.now() / 1000) - otpExp <= 120) {
                    return res.status(200).json({ responseType: "S", responseValue: { message: 'OTP Verified Successfully.' } });
                } else {
                    return res.status(404).json({ responseType: "F", responseValue: { message: 'OTP Verified Failed!' } });
                }
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Invalid OTP!' } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    sendEmail: async (req, res) => {
        const { emailSubject, email, emailContent } = req.body;

        try {
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
                from: `"Admin - Moi Kanakku" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: emailSubject,
                html: emailContent,
            };
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ responseType: "S", responseValue: { message: 'Email sent successfully.' } });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
