const express = require('express');
const { controller } = require('../controllers/adminControllers');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/login', controller.login);
router.get('/moi-users', controller.moiUsers);
router.get('/moi-user-list', controller.moiUserList);
router.get('/moi-user-list/:id', controller.moiUserListId);
router.get('/moi-user-function', controller.moiUserFunction);
router.get('/moi-user-function/:userId', controller.moiFunctionsUserId);
router.get('/feedbacks', controller.feedbacks);
router.get('/moi-out-all', controller.moiOutAll);
router.get('/moi-out-all/:userId', controller.moiOutAllUser);


module.exports = router;
