const express = require('express');
const { controller } = require('../controllers/emailControllers');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

// ==================== UNIFIED ENDPOINTS ====================

/**
 * Send email with OTP or custom content
 * POST /api/email/sendEmail
 * Body: { type, email, id, subject?, content?, sendNotification?, ...notifPayload }
 * type: 'restore' | 'verification' | 'forgot' | 'custom'
 */
router.post('/sendEmail', controller.sendEmail);

/**
 * Verify OTP (unified for all types)
 * POST /api/email/verifyOtp
 * Body: { email|emailId|id, otp, type? }
 * type: 'forgot' | 'verification' | 'restore' (default: 'forgot')
 */
router.post('/verifyOtp', controller.verifyOtp);

// ==================== DEPRECATED ENDPOINTS (Legacy Support) ====================
// These are kept for backward compatibility but should be migrated to unified endpoints

// router.post('/forgotOtp', controller.forgotOtp);
// Replaced by: POST /api/email/sendEmail with { type: 'forgot', email }

// router.post('/verifyOtp', controller.verifyOtp);
// Replaced by: POST /api/email/verifyOtp with { email, otp, type: 'forgot' }

module.exports = router;
