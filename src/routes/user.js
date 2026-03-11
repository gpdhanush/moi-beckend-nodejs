const express = require('express');
const router = express.Router();
const { userController } = require('../controllers/user');
const { authenticateToken } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ==================== EXISTING ROUTES ====================

// User Authentication Routes
router.post('/login', userController.login);
router.post('/create', userController.create);
// Device & Notification Routes
router.post('/update-notification-token', authenticateToken, userController.updateNotificationToken);

// OTP Routes
// router.post('/request-verification-otp', userController.requestVerificationOTP);
// router.post('/verify-email-otp', userController.verifyEmailOTP);
// router.post('/resend-verification-otp', userController.resendVerificationOTP);
// router.post('/request-restore-otp', userController.requestRestoreOTP);
// router.post('/verify-restore-otp', userController.verifyRestoreOTP);
// router.get('/verification-status/:id', userController.checkVerificationStatus);
// Password Management Routes
router.post('/update-password', authenticateToken, userController.updatePassword);
router.post('/reset-password', userController.resetPassword);

// User Profile Routes
// Explicit referral-code route (must be before '/:id' to avoid route collision)
router.get('/referral-code', authenticateToken, userController.getReferralCode);
// router.get('/:id', authenticateToken, userController.getUser);
router.post('/update', authenticateToken, userController.update);
router.get('/details/:id', authenticateToken, userController.getImportantUserDetails);
router.post('/delete', authenticateToken, userController.deleteUser);
// Direct account restore (no OTP) - kept for admin/backend use
router.post('/restore', userController.restoreAccount);


// Profile Picture Routes
// (multer configuration with diskStorage for profile picture uploads)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(process.env.UPLOAD_DIR || './uploads', 'temp');
        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        // Accept only image files - check extension
        const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        
        if (allowedExtensions.includes(fileExtension)) {
            return cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${fileExtension}. Allowed types: ${allowedExtensions.join(', ')}`));
        }
    }
});

/**
 * Middleware to handle multer errors
 */
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                responseType: "F",
                responseValue: { message: 'கோப்பு மிக பெரியது! 10 MB வரை மட்டுமே அனுமதிக்கப்படுகிறது.' }
            });
        }
    } else if (err && err.message) {
        return res.status(400).json({
            responseType: "F",
            responseValue: { message: `கோப்பு பிழை: ${err.message}` }
        });
    }
    next();
};

router.post(
  "/update-profile-picture",
  authenticateToken,
  upload.single("profile_image"),
  handleMulterErrors,
  userController.updateProfilePicture,
);

module.exports = router;