const express = require('express');
const { controller } = require('../controllers/upcomingFunction');
const { authenticateToken } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/adminAuth');

const router = express.Router();

// ==================== USER ENDPOINTS ====================

/**
 * @route   POST /apis/upcoming-functions/list
 * @desc    Get all upcoming functions for authenticated user
 * @access  Private (requires valid JWT token)
 * 
 * @headers {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 * 
 * @body    {} - Empty body, userId extracted from JWT token
 * 
 * @success {
 *   "responseType": "S",
 *   "count": 2,
 *   "responseValue": [
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "userId": "123e4567-e89b-12d3-a456-426614174000",
 *       "title": "Wedding Ceremony",
 *       "description": "Grand wedding celebration",
 *       "functionDate": "15-Mar-2026",
 *       "location": "Chennai, Tamil Nadu",
 *       "invitationUrl": "https://invitation.com/wedding123",
 *       "status": "ACTIVE",
 *       "createdAt": "2026-02-28T10:30:00.000Z",
 *       "updatedAt": "2026-02-28T10:30:00.000Z"
 *     }
 *   ]
 * }
 * 
 * @error {
 *   "responseType": "F",
 *   "responseValue": {
 *     "message": "குறிப்பிடப்பட்ட பயனர் இல்லை!"
 *   }
 * }
 */
router.post('/list', authenticateToken, controller.list);

/**
 * @route   POST /apis/upcoming-functions/create
 * @desc    Create new upcoming function
 * @access  Private (requires valid JWT token)
 * 
 * @headers {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 * 
 * @body {
 *   "title": "Wedding Ceremony",                // Required
 *   "functionDate": "2026-03-15",              // Required (YYYY-MM-DD)
 *   "location": "Chennai, Tamil Nadu",         // Required
 *   "description": "Grand wedding celebration", // Optional
 *   "invitationUrl": "https://invite.com/123"  // Optional
 * }
 * 
 * @body_alternatives {
 *   "functionName": "Wedding",    // Alternative to "title"
 *   "date": "2026-03-15",        // Alternative to "functionDate"
 *   "place": "Chennai"           // Alternative to "location"
 * }
 * 
 * @success {
 *   "responseType": "S",
 *   "responseValue": {
 *     "message": "உங்கள் தரவு வெற்றிகரமாக சேமிக்கப்பட்டது.",
 *     "id": "550e8400-e29b-41d4-a716-446655440000"
 *   }
 * }
 * 
 * @error {
 *   "responseType": "F",
 *   "responseValue": {
 *     "message": "தலைப்பு, தேதி மற்றும் இடம் அவசியம்!"
 *   }
 * }
 */
router.post('/create', authenticateToken, controller.create);

/**
 * @route   POST /apis/upcoming-functions/update
 * @desc    Update existing upcoming function (only own functions)
 * @access  Private (requires valid JWT token)
 * 
 * @headers {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 * 
 * @body {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",  // Required
 *   "title": "Updated Wedding Ceremony",           // Optional
 *   "functionDate": "2026-03-20",                  // Optional
 *   "location": "Madurai, Tamil Nadu",             // Optional
 *   "description": "Updated description",          // Optional
 *   "invitationUrl": "https://new-invite.com"      // Optional
 * }
 * 
 * @success {
 *   "responseType": "S",
 *   "responseValue": {
 *     "message": "உங்கள் தரவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
 *   }
 * }
 * 
 * @error {
 *   "responseType": "F",
 *   "responseValue": {
 *     "message": "இந்த செயல்பாட்டை புதுப்பிக்க உங்களுக்கு அனுமதி இல்லை!"
 *   }
 * }
 */
router.post('/update', authenticateToken, controller.update);

/**
 * @route   POST /apis/upcoming-functions/update-status
 * @desc    Update status of upcoming function (only own functions)
 * @access  Private (requires valid JWT token)
 * 
 * @headers {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 * 
 * @body {
 *   "id": "550e8400-e29b-41d4-a716-446655440000",  // Required
 *   "status": "COMPLETED"                          // Required: ACTIVE | CANCELLED | COMPLETED
 * }
 * 
 * @success {
 *   "responseType": "S",
 *   "responseValue": {
 *     "message": "நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
 *   }
 * }
 * 
 * @error {
 *   "responseType": "F",
 *   "responseValue": {
 *     "message": "தவறான நிலை! அனுமதிக்கப்பட்ட மதிப்புகள்: ACTIVE, CANCELLED, COMPLETED"
 *   }
 * }
 */
router.post('/update-status', authenticateToken, controller.updateStatus);

/**
 * @route   GET /apis/upcoming-functions/delete/:id
 * @desc    Soft delete upcoming function (only own functions)
 * @access  Private (requires valid JWT token)
 * 
 * @headers {
 *   "Authorization": "Bearer <jwt_token>"
 * }
 * 
 * @params {
 *   "id": "550e8400-e29b-41d4-a716-446655440000"  // Function ID in URL
 * }
 * 
 * @example GET /apis/upcoming-functions/delete/550e8400-e29b-41d4-a716-446655440000
 * 
 * @success {
 *   "responseType": "S",
 *   "responseValue": {
 *     "message": "பொருள் வெற்றிகரமாக நீக்கப்பட்டது."
 *   }
 * }
 * 
 * @error {
 *   "responseType": "F",
 *   "responseValue": {
 *     "message": "இந்த செயல்பாட்டை நீக்க உங்களுக்கு அனுமதி இல்லை!"
 *   }
 * }
 */
router.get('/delete/:id', authenticateToken, controller.delete);

// ==================== ADMIN ENDPOINTS ====================

/**
 * @route   POST /apis/upcoming-functions/admin/list-all
 * @desc    Get all upcoming functions across all users (Admin only)
 * @access  Private (requires admin role)
 */
router.post('/admin/list-all', authenticateToken, isAdmin, controller.adminListAll);

/**
 * @route   GET /apis/upcoming-functions/admin/statistics
 * @desc    Get upcoming functions statistics (Admin only)
 * @access  Private (requires admin role)
 */
router.get('/admin/statistics', authenticateToken, isAdmin, controller.adminStats);

/**
 * @route   POST /apis/upcoming-functions/admin/by-date-range
 * @desc    Get upcoming functions by date range (Admin only)
 * @access  Private (requires admin role)
 */
router.post('/admin/by-date-range', authenticateToken, isAdmin, controller.adminGetByDateRange);

module.exports = router;
