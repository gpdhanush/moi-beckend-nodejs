const express = require('express');
const { controller } = require('../controllers/transactionFunctions');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * Transaction Functions Management Routes
 * These are event/function records that transactions can be linked to
 * All routes require authentication
 */

// Create a new transaction function
// Body: { userId, functionName, functionDate?, location?, notes?, imageUrl? }
router.post('/create', authenticateToken, controller.create);

// Get all transaction functions
// Body: { userId, startDate?, endDate?, limit, offset }
router.post('/list', authenticateToken, controller.list);

// Get function details with transaction statistics
// Body: { functionId }
router.post('/detail', authenticateToken, controller.detail);

// load id/name dropdown lists
// Body: { userId }
router.post('/dropdown', authenticateToken, controller.dropdown);

// Update transaction function
// Body: { functionId, functionName, functionDate?, location?, notes?, imageUrl? }
router.post('/update', authenticateToken, controller.update);

// Delete transaction function (soft delete)
// Body: { functionId }
router.post('/delete', authenticateToken, controller.delete);

module.exports = router;
