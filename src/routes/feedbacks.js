const express = require('express');
const { controller } = require('../controllers/feedbacks');
const { authenticateToken, authenticateAdminToken } = require('../middlewares/auth');

const router = express.Router();

// User endpoints
router.post('/list', authenticateToken, controller.list);
router.post('/create', authenticateToken, controller.create);

/// ADMIN FEEDBACK MANAGEMENT ROUTES
router.get("/admin/all-feedback-lists", authenticateAdminToken, controller.adminAllFeedbackLists);
router.post("/admin/reply-feedback", authenticateAdminToken, controller.adminReplyFeedback);
router.post("/admin/delete-feedback", authenticateAdminToken, controller.adminDeleteFeedback);


module.exports = router;
