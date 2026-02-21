const express = require('express');
const { controller } = require('../controllers/feedbacks');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/list', authenticateToken, controller.list);
router.post('/create', authenticateToken, controller.create);

module.exports = router;
