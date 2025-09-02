const express = require('express');
const { userController } = require('../controllers/user');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/login', userController.login);
router.post('/create', userController.create);
router.post('/update', authenticateToken, userController.update);
router.get('/details/:id', authenticateToken, userController.getUser);
router.post('/updatePassword', authenticateToken, userController.updatePassword);
router.post('/deleteUser', authenticateToken, userController.deleteUser);
router.post('/resetPassword', userController.resetPassword);
router.post('/updateNotificationToken', userController.updateNotificationToken);

module.exports = router;
