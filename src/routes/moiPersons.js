const express = require('express');
const { controller } = require('../controllers/moiPersons');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Get list of persons with optional search
router.post('/list', authenticateToken, controller.list);

// Get person details for current user (for header)
router.post('/details', authenticateToken, controller.getPersonDetails);

// Create new person
router.post('/create', authenticateToken, controller.create);

// Update person
router.put('/update', authenticateToken, controller.update);

// Get single person by ID
router.get('/:id', authenticateToken, controller.getById);

// Delete person
router.delete('/:id', authenticateToken, controller.delete);

module.exports = router;
