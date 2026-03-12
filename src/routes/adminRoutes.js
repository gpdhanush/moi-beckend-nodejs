const express = require('express');
const router = express.Router();
const { adminControllers } = require('../controllers/adminControllers');
const { authenticateToken } = require('../middlewares/auth');

// All admin routes require authentication
// These should ideally be further protected by checking if user is admin (not currently implemented)

/**
 * GET /apis/admin/otps
 * List all OTPs with user details
 * Query params: ?page=1&limit=25&type=LOGIN&is_used=0
 */
router.get('/otps', adminControllers.listOTPs);

/**
 * DELETE /apis/admin/otps/cleanup
 * Delete expired OTPs (admin maintenance)
 */
router.delete('/otps/cleanup', adminControllers.deleteExpiredOTPs);

module.exports = router;
