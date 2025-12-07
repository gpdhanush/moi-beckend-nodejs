const express = require('express');
const { controller } = require('../controllers/moiDefaultFunctions');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Get list of default functions (for dropdown)
router.post('/list', authenticateToken, controller.list);

// Get single function by ID
router.get('/:id', authenticateToken, controller.getById);

module.exports = router;
