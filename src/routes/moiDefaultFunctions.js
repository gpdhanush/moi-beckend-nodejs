const express = require('express');
const { controller } = require('../controllers/moiDefaultFunctions');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * Global default function management
 * all routes require a valid token
 */

// dropdown: return global defaults + user's transaction functions
router.post('/dropdown', authenticateToken, controller.dropdown);
// list all global defaults
router.post('/list', authenticateToken, controller.list);
// get one by id
router.get('/:id', authenticateToken, controller.getById);
// create new default function
router.post('/create', authenticateToken, controller.create);
// update default function
router.post('/update', authenticateToken, controller.update);
// soft delete
router.post('/delete', authenticateToken, controller.delete);

module.exports = router;
