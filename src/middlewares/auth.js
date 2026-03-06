const jwt = require('jsonwebtoken');
const tokenService = require('./tokenService');
const User = require('../models/user');
const logger = require('../config/logger');

/**
 * Middleware to authenticate JWT tokens
 * Validates token signature, expiration, checks against stored token (single-session policy),
 * and verifies user still exists in database (security protection for deleted users)
 */
function authenticateToken(req, res, next) {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            responseType: "F", 
            responseValue: { message: "அணுகல் மறுக்கப்பட்டது. தயவுசெய்து தொடர உள்நுழையவும்." } 
        });
    }

    // Verify JWT token signature and expiration
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: 'டோக்கன் காலாவதியாகிவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்.' } 
                });
            }
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: 'தவறான டோக்கன். தயவுசெய்து தொடர உள்நுழையவும்.' } 
            });
        }

        // Extract user ID from decoded token (UUID string or legacy number)
        const userId = decoded.userId;
        
        // Validate userId exists
        if (userId === undefined || userId === null || userId === '') {
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: "Invalid token. Please login to continue." } 
            });
        }
        
        // Check if token matches the stored token (enforces single-session policy)
        // This ensures only the latest login token is valid
        const storedToken = tokenService.getTokenForUser(userId);
        
        // If no token stored, null, or doesn't match, reject the request
        if (!storedToken || storedToken !== token) {
            logger.debug('token mismatch for user', userId, { token, storedToken });
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: "அமர்வு காலாவதியாகிவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்." } 
            });
        }

        // ====== NEW SECURITY CHECK: Verify user still exists in database ======
        // This prevents API access after user account deletion (account deletion invalidates token)
        try {
            const user = await User.findById(userId);
            if (!user) {
                // User has been deleted - invalidate the token
                tokenService.removeToken(userId);
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: "உங்கள் கணக்கு நீக்கப்பட்டுவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்." } 
                });
            }

            // Additionally, check if user is deleted (is_deleted flag)
            if (user.is_deleted) {
                tokenService.removeToken(userId);
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: "உங்கள் கணக்கு நீக்கப்பட்டுவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்." } 
                });
            }
        } catch (dbError) {
            logger.error('Database error in auth middleware:', dbError);
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: "Authentication failed. Please login again." } 
            });
        }

        // Token is valid, attach user info to request and proceed
        req.user = {
            ...decoded,
            userId: typeof userId === 'number' ? userId : String(userId)
        };
        next();
    });
}

module.exports = { authenticateToken };