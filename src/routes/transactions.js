const express = require('express');
const { controller } = require('../controllers/transactions');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * Transaction Management Routes
 * All routes require authentication
 */

// Create a new transaction
// Body: { userId, personId, transactionFunctionId?, transactionDate, type(INVEST|RETURN), itemType(MONEY|THING), amount?, itemName?, notes? }
router.post('/create', authenticateToken, controller.create);

// Create a new transaction (V2) - Supports both embedded person data and personId
// Scenario A: { userId, firstName, secondName?, business?, city?, mobile?, transactionDate, type, amount?, itemName?, notes?, is_custom, transactionFunctionId?, transactionFunctionName?, customFunction? }
// Scenario B: { userId, personId, transactionDate, type, amount?, itemName?, notes?, is_custom, transactionFunctionId?, transactionFunctionName?, customFunction? }
router.post('/create-v2', authenticateToken, controller.createV2);

// Create multiple transactions (V2 Bulk) - Accepts array of transaction objects
// Body: { transactions: Array of transaction objects (same structure as create-v2) }
router.post('/create-v2-bulk', authenticateToken, controller.createV2Bulk);

// Get all transactions with filters
// Body: { userId, personId?, transactionFunctionId?, type?, startDate?, endDate?, limit, offset }
router.post('/list', authenticateToken, controller.list);

// Get transaction details
// Body: { transactionId }
router.post('/detail', authenticateToken, controller.detail);

// Update transaction
// Body: { transactionId, transactionDate, type, amount?, itemName?, notes?, isCustom?, customFunction? }
router.post('/update', authenticateToken, controller.update);

// Delete transaction (soft delete)
// Body: { transactionId }
router.post('/delete', authenticateToken, controller.delete);

// Get transaction statistics
// Body: { userId, personId?, transactionFunctionId?, startDate?, endDate? }
router.post('/stats', authenticateToken, controller.getStats);

// Get all transactions for a person
// Body: { userId, personId, limit?, offset? }
router.post('/person/:personId', authenticateToken, controller.getByPerson);


/// ADMIN ROUTES

// Admin: Get all transactions across users with filters
// Body: { search?, userId?, personId?, transactionFunctionId?, type?, startDate?, endDate?, limit, offset }
router.post('/admin/list', controller.adminList);

module.exports = router;
