const express = require('express');
const { logsController } = require('../controllers/logsController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Routes for user session logs and activity tracking

/**
 * GET /logs/sessions
 * Get all user sessions logs (paginated)
 * Query: { limit, offset, userId, status }
 */
router.get('/sessions', authenticateToken, logsController.getSessionLogs);

module.exports = router;
