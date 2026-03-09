const UserOTP = require('../models/userOTP');
const User = require('../models/user');
const logger = require('../config/logger');

exports.userOTPController = {
    /**
     * Verify OTP
     * POST /api/user-otps/verify
     * Body: { userId, code, type }
     */
    verify: async (req, res) => {
        try {
            const { userId, code, type } = req.body;

            if (!userId || !code || !type) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Missing required fields' }
                });
            }

            const isValid = await UserOTP.verify(userId, code, type);

            if (!isValid) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Invalid or expired OTP' }
                });
            }

            res.status(200).json({
                responseType: "S",
                responseValue: { message: 'OTP verified successfully' }
            });
        } catch (error) {
            logger.error('verify OTP error:', error);
            res.status(500).json({
                responseType: "F",
                responseValue: { message: 'Failed to verify OTP' }
            });
        }
    }
};