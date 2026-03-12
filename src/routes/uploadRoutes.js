const express = require('express');
const { controller } = require('../controllers/uploadControllers');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

router.post('/saveFiles', authenticateToken, controller.saveFiles);
// router.get('/getFile', controller.getFile); // Public access to get files (optional - for direct file access)
router.delete('/deleteImage', authenticateToken, controller.deleteImage);

module.exports = router;
