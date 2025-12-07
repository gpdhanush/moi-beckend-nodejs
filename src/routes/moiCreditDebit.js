const express = require('express');
const { controller } = require('../controllers/moiCreditDebit');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Dashboard with summary and transactions
router.post('/dashboard', authenticateToken, controller.dashboard);

// Get list of transactions with optional filters
router.post('/list', authenticateToken, controller.list);

// Add Moi Return (Credit)
router.post('/return', authenticateToken, controller.addReturn);

// Add Moi Invest (Debit)
router.post('/invest', authenticateToken, controller.addInvest);

// Update transaction
router.put('/update', authenticateToken, controller.update);

// Get single transaction by ID (must be after specific routes)
router.get('/:id', authenticateToken, controller.getById);

// Delete transaction
router.delete('/:id', authenticateToken, controller.delete);

module.exports = router;
