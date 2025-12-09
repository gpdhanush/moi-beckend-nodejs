const express = require('express');
const { userController } = require('../controllers/user');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation
const { validateApiKey, registrationRateLimiter } = require('../middlewares/apiSecurity'); // API security middleware

const router = express.Router();

router.post('/login', userController.login);
// Apply API key validation and rate limiting to registration endpoint
router.post('/create', validateApiKey, registrationRateLimiter, userController.create);
router.post('/update', authenticateToken, userController.update);
router.get('/details/:id', authenticateToken, userController.getUser);
router.post('/updatePassword', authenticateToken, userController.updatePassword);
router.post('/deleteUser', authenticateToken, userController.deleteUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/updateNotificationToken', userController.updateNotificationToken);
router.post('/updateProfilePicture', authenticateToken, userController.updateProfilePicture);
router.get('/importantDetails/:id', authenticateToken, userController.getImportantUserDetails);

module.exports = router;
