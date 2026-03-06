const express = require('express');
const { logsController } = require('../controllers/logsController');
const { authenticateToken } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

// Admin-only routes for user session logs and activity tracking

/**
 * GET /logs/sessions
 * Get all user sessions logs (paginated)
 * Query: { limit, offset, userId, status }
 */
router.get('/sessions', authenticateToken, isAdmin, logsController.getSessionLogs);

/**
 * GET /logs/user/:userId
 * Get specific user's session history
 * Params: userId
 */
router.get('/user/:userId', authenticateToken, isAdmin, logsController.getUserSessionLogs);

/**
 * GET /logs/active-sessions
 * Get all currently active user sessions
 */
router.get('/active-sessions', authenticateToken, isAdmin, logsController.getActiveSessions);

/**
 * POST /logs/session-stats
 * Get comprehensive session statistics summary
 */
router.post('/session-stats', authenticateToken, isAdmin, logsController.getSessionStats);

module.exports = router;
