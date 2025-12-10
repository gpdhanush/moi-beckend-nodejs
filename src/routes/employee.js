const express = require('express');
const { employeeController } = require('../controllers/employee');
const { authenticateToken } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/adminAuth');
const { isEmployee } = require('../middlewares/employeeAuth');

const router = express.Router();

// Admin only routes - Employee management
router.post('/create', authenticateToken, isAdmin, employeeController.create);
router.get('/list', authenticateToken, isAdmin, employeeController.getAll);
router.get('/:id', authenticateToken, employeeController.getById); // Admin and Employee can view
router.put('/:id', authenticateToken, isAdmin, employeeController.update);
router.post('/:id/status', authenticateToken, isAdmin, employeeController.updateStatus);

// Admin only routes - Permission management
router.post('/permission/assign', authenticateToken, isAdmin, employeeController.assignPermission);
router.post('/permission/cancel', authenticateToken, isAdmin, employeeController.cancelPermission);
router.get('/permission/all', authenticateToken, isAdmin, employeeController.getAllPermissions);
router.get('/:id/permissions', authenticateToken, employeeController.getEmployeePermissions); // Admin and Employee can view

module.exports = router;
