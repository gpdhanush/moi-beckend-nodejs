const express = require('express');
const { userOTPController } = require('../controllers/userOTP');

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * Verify OTP (for users)
 * POST /api/user-otps/verify
 * Body: { userId, code, type }
 */
router.post('/verify', userOTPController.verify);

module.exports = router;