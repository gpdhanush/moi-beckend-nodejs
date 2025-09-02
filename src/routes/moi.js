const express = require('express');
const { controller } = require('../controllers/moi');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/list', authenticateToken, controller.list);
router.post('/create', authenticateToken, controller.create);
router.post('/update', authenticateToken, controller.update);
router.get('/delete/:id', authenticateToken, controller.delete);

module.exports = router;
