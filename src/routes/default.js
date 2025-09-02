const express = require('express');
const { controller } = require('../controllers/defaults');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.get('/payment-lists', authenticateToken, controller.paymentLists);
router.post('/total-amount', authenticateToken, controller.totalAmount);

module.exports = router;
