const express = require('express');
const { controller } = require('../controllers/uploadControllers');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/saveFiles', controller.saveFiles);

module.exports = router;
