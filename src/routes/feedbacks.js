const express = require('express');
const { controller } = require('../controllers/feedbacks');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// User endpoints
router.post('/list', authenticateToken, controller.list);
router.post('/create', authenticateToken, controller.create);

/// ADMIN USER MANAGEMENT ROUTES
router.get("/admin/all-feedback-lists", controller.adminAllFeedbackLists);
router.post("/admin/reply-feedback", controller.adminReplyFeedback);
router.post("/admin/delete-feedback", controller.adminDeleteFeedback);


module.exports = router;
