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

// ==================== ADMIN ENDPOINTS ====================

/**
 * Send bulk emails to multiple users
 * POST /api/email/admin/send-bulk
 * Body: { userIds: [], subject, body, type? }
 * type: 'notification' | 'announcement' | 'custom' (default: 'custom')
 */
router.post('/admin/send-bulk', controller.sendBulkEmails);

module.exports = router;
