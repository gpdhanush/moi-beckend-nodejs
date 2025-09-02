const express = require('express');
const { controller } = require('../controllers/emailControllers');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/forgotOtp', controller.forgotOtp);
router.post('/verifyOtp', controller.verifyOtp);
router.post('/sendWelcomeEmail', controller.verifyOtp);
router.post('/sendEmail', controller.sendEmail);

module.exports = router;
