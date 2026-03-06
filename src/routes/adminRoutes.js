const express = require('express');
const { adminController } = require('../controllers/admin');
const { controller } = require('../controllers/adminControllers');
const { logsController } = require('../controllers/logsController');
const { controller: feedbacksController } = require('../controllers/feedbacks');
// const { authenticateToken } = require('../middlewares/auth');
// const { isAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

// ==================== ADMIN AUTHENTICATION ====================

/**
 * @route   POST /apis/admin/login
 * @desc    Admin login - Issue JWT token
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', adminController.login);

/**
 * @route   POST /apis/admin/create
 * @desc    Create new admin (Super-admin only)
 * @access  Private (JWT required, super-admin only)
 * @body    { full_name, email, mobile, password }
 */
router.post('/create', adminController.create);

// ==================== ADMIN PROFILE MANAGEMENT ====================

/**
 * @route   GET /apis/admin/details/:id
 * @desc    Get admin details
 * @access  Private (JWT required)
 * @params  { id }
 */
router.get('/details/:id',  adminController.getAdminDetails);

/**
 * @route   POST /apis/admin/update-profile
 * @desc    Update admin profile
 * @access  Private (JWT required)
 * @body    { id, full_name, email, mobile, status }
 */
router.post('/update-profile',  adminController.updateProfile);

/**
 * @route   POST /apis/admin/update-password
 * @desc    Update admin password
 * @access  Private (JWT required)
 * @body    { id, currentPassword, newPassword }
 */
router.post('/update-password',  adminController.updatePassword);

// ==================== ADMIN MANAGEMENT (Super-admin) ====================

/**
 * @route   GET /apis/admin/list
 * @desc    Get all admins
 * @access  Private (JWT required, super-admin only)
 * @query   { limit, offset }
 */
router.get('/list', adminController.getAllAdmins);

/**
 * @route   POST /apis/admin/update-status
 * @desc    Update admin status
 * @access  Private (JWT required, super-admin only)
 * @body    { id, status }
 */
router.post('/update-status',  adminController.updateAdminStatus);

/**
 * @route   POST /apis/admin/delete
 * @desc    Soft delete admin
 * @access  Private (JWT required, super-admin only)
 * @body    { id }
 */
router.post('/delete',  adminController.deleteAdmin);

// ==================== USER MANAGEMENT ====================
router.get('/moi-users',  controller.moiUsers);
router.post('/moi-users',  controller.createMoiUser);
router.get('/moi-user-list',  controller.moiUserList);
router.get('/moi-user-list/:id',  controller.moiUserListId);
router.put('/moi-users/:id',  controller.updateMoiUser);
router.delete('/moi-users/:id',  controller.deleteMoiUser);

// ==================== FUNCTIONS & TRANSACTIONS ====================
router.get('/moi-user-function', controller.moiUserFunction);
router.get('/moi-user-function/:userId', controller.moiFunctionsUserId);
router.get('/moi-out-all', controller.moiOutAll);
router.get('/moi-out-all/:userId', controller.moiOutAllUser);

// ==================== FEEDBACK MANAGEMENT ====================
// Admin Feedback Management
router.post('/feedbacks/list-all',  feedbacksController.adminListAll);
router.get('/feedbacks/statistics',  feedbacksController.adminStats);
router.post('/feedbacks/detail',  feedbacksController.adminGetDetail);
router.post('/feedbacks/update-status',  feedbacksController.adminUpdateStatus);
router.post('/feedbacks/add-response',  feedbacksController.adminAddResponse);
router.post('/feedbacks/delete',  feedbacksController.adminDelete);

// ==================== ANALYTICS & DASHBOARD ====================
router.get('/analytics/overview',  controller.getPlatformOverview);
router.get('/analytics/users',  controller.getUserStats);
router.get('/analytics/transactions',  controller.getTransactionStats);
router.get('/analytics/feedbacks',  controller.getFeedbackStats);
router.get('/analytics/referrals',  controller.getReferralStats);

// ==================== SERVER LOGS & SESSION TRACKING ====================
router.get('/logs/sessions', logsController.getSessionLogs);

// ==================== ADMIN PERSONS MANAGEMENT ====================
// POST /apis/admin/persons/list
// @body { search?, limit?, offset? }
// @response { responseType, count, responseValue: [{ id, userId, userName, userEmail, firstName, lastName, mobile, city, occupation, ... }] }
router.post('/persons/list', require('../controllers/adminPersons').controller.list);

// POST /apis/admin/persons/create
// @body { userId, firstName, lastName?, mobile?, city?, occupation? }
// @response { responseType, responseValue: { message, personId } }
router.post('/persons/create', require('../controllers/adminPersons').controller.create);

// POST /apis/admin/persons/update
// @body { personId, firstName?, lastName?, mobile?, city?, occupation? }
// @response { responseType, responseValue: { message } }
router.post('/persons/update', require('../controllers/adminPersons').controller.update);

// DELETE /apis/admin/persons/:id
// @body { personId } OR @params { id }
// @response { responseType, responseValue: { message } }
router.delete('/persons/:id', require('../controllers/adminPersons').controller.delete);

// POST /apis/admin/persons/detail
// @body { personId }
// @response { responseType, responseValue: { id, userId, userName, userEmail, firstName, lastName, mobile, city, occupation, ... } }
router.post('/persons/detail', require('../controllers/adminPersons').controller.detail);

// POST /apis/admin/persons/dropdown
// @body { limit?, offset? }
// @response { responseType, responseValue: [{ id, name }] }
router.post('/persons/dropdown', require('../controllers/adminPersons').controller.dropdown);

// ==================== ADMIN TRANSACTION FUNCTIONS MANAGEMENT ====================
// POST /apis/admin/transaction-functions/create
// @body { userId, functionName, functionDate?, location?, notes?, imageUrl? }
// @response { responseType, responseValue: { message, functionId } }
router.post('/transaction-functions/create', require('../controllers/adminTransactionFunctions').controller.create);

// POST /apis/admin/transaction-functions/list
// @body { search?, startDate?, endDate?, limit?, offset? }
// @response { responseType, count, responseValue: [{ id, userId, userName, userEmail, functionName, functionDate, location, notes, imageUrl, ... }] }
router.post('/transaction-functions/list', require('../controllers/adminTransactionFunctions').controller.list);

// POST /apis/admin/transaction-functions/detail
// @body { functionId }
// @response { responseType, responseValue: { id, userId, userName, userEmail, functionName, functionDate, location, notes, imageUrl, ... } }
router.post('/transaction-functions/detail', require('../controllers/adminTransactionFunctions').controller.detail);

// POST /apis/admin/transaction-functions/dropdown
// @body { limit?, offset? }
// @response { responseType, responseValue: [{ id, name }] }
router.post('/transaction-functions/dropdown', require('../controllers/adminTransactionFunctions').controller.dropdown);

// POST /apis/admin/transaction-functions/update
// @body { functionId, functionName?, functionDate?, location?, notes?, imageUrl? }
// @response { responseType, responseValue: { message } }
router.post('/transaction-functions/update', require('../controllers/adminTransactionFunctions').controller.update);

// POST /apis/admin/transaction-functions/delete
// @body { functionId }
// @response { responseType, responseValue: { message } }
router.post('/transaction-functions/delete', require('../controllers/adminTransactionFunctions').controller.delete);

// ==================== ADMIN DEFAULT FUNCTIONS MANAGEMENT ====================
// POST /apis/admin/default-functions/create
// @body { name }
// @response { responseType, responseValue: { message, functionId } }
router.post('/default-functions/create', require('../controllers/adminDefaultFunctions').controller.create);

// POST /apis/admin/default-functions/list
// @body { search?, limit?, offset? }
// @response { responseType, count, responseValue: [{ id, name, createdAt, updatedAt }] }
router.post('/default-functions/list', require('../controllers/adminDefaultFunctions').controller.list);

// POST /apis/admin/default-functions/detail
// @body { functionId }
// @response { responseType, responseValue: { id, name, createdAt, updatedAt } }
router.post('/default-functions/detail', require('../controllers/adminDefaultFunctions').controller.detail);

// POST /apis/admin/default-functions/dropdown
// @body { limit?, offset? }
// @response { responseType, responseValue: [{ id, name }] }
router.post('/default-functions/dropdown', require('../controllers/adminDefaultFunctions').controller.dropdown);

// POST /apis/admin/default-functions/update
// @body { functionId, name }
// @response { responseType, responseValue: { message } }
router.post('/default-functions/update', require('../controllers/adminDefaultFunctions').controller.update);

// POST /apis/admin/default-functions/delete
// @body { functionId }
// @response { responseType, responseValue: { message } }
router.post('/default-functions/delete', require('../controllers/adminDefaultFunctions').controller.delete);

// ==================== ADMIN TRANSACTIONS MANAGEMENT ====================
// POST /apis/admin/transactions/create
// @body { userId, personId, transactionDate, type(INVEST|RETURN), amount?, itemName?, notes?, transactionFunctionId? }
// @response { responseType, responseValue: { message, transactionId } }
router.post('/transactions/create', require('../controllers/adminTransactions').controller.create);

// POST /apis/admin/transactions/list
// @body { search?, type?, startDate?, endDate?, limit?, offset? }
// @response { responseType, count, responseValue: [{ id, userId, userName, userEmail, personId, personName, transactionFunctionId, functionName, transactionDate, type, amount, itemName, notes, ... }] }
router.post('/transactions/list', require('../controllers/adminTransactions').controller.list);

// POST /apis/admin/transactions/detail
// @body { transactionId }
// @response { responseType, responseValue: { id, userId, userName, userEmail, personId, personName, transactionFunctionId, functionName, transactionDate, type, amount, itemName, notes, ... } }
router.post('/transactions/detail', require('../controllers/adminTransactions').controller.detail);

// POST /apis/admin/transactions/update
// @body { transactionId, transactionDate?, type?, amount?, itemName?, notes?, transactionFunctionId? }
// @response { responseType, responseValue: { message } }
router.post('/transactions/update', require('../controllers/adminTransactions').controller.update);

// POST /apis/admin/transactions/delete
// @body { transactionId }
// @response { responseType, responseValue: { message } }
router.post('/transactions/delete', require('../controllers/adminTransactions').controller.delete);

// POST /apis/admin/transactions/stats
// @body { type?, startDate?, endDate? }
// @response { responseType, responseValue: { totalTransactions, investCount, returnCount, totalInvest, totalReturn, totalAmount } }
router.post('/transactions/stats', require('../controllers/adminTransactions').controller.stats);

module.exports = router;
