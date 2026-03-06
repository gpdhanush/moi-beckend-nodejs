const express = require('express');
const { controller } = require('../controllers/feedbacks');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// User endpoints
router.post('/list', authenticateToken, controller.list);
router.post('/create', authenticateToken, controller.create);

module.exports = router;
