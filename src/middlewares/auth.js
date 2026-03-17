const jwt = require('jsonwebtoken');
const tokenService = require('./tokenService');
const User = require('../models/user');
const Admin = require('../models/admin');
const logger = require('../config/logger');

const LOGIN_REQUIRED_MESSAGE = "அணுகல் மறுக்கப்பட்டது. தயவுசெய்து தொடர உள்நுழையவும்.";
const EXPIRED_TOKEN_MESSAGE = "டோக்கன் காலாவதியாகிவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்.";
const INVALID_TOKEN_MESSAGE = "தவறான டோக்கன். தயவுசெய்து தொடர உள்நுழையவும்.";
const INVALID_TOKEN_LOGIN_MESSAGE = "Invalid token. Please login to continue.";
const SESSION_EXPIRED_MESSAGE = "அமர்வு காலாவதியாகிவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்.";
const ACCOUNT_DELETED_MESSAGE = "உங்கள் கணக்கு நீக்கப்பட்டுவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்.";
const AUTH_FAILED_MESSAGE = "Authentication failed. Please login again.";

/**
 * Middleware to authenticate JWT tokens
 * Validates token signature, expiration, checks against stored token (single-session policy),
 * and verifies user still exists in database (security protection for deleted users)
 */
function authenticateRequest(req, res, next, { resolveAccount, accountType }) {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            responseType: "F", 
            responseValue: { message: LOGIN_REQUIRED_MESSAGE } 
        });
    }

    // Verify JWT token signature and expiration
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: EXPIRED_TOKEN_MESSAGE } 
                });
            }
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: INVALID_TOKEN_MESSAGE } 
            });
        }

        // Extract user ID from decoded token (UUID string or legacy number)
        const userId = decoded.userId;
        
        // Validate userId exists
        if (userId === undefined || userId === null || userId === '') {
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: INVALID_TOKEN_LOGIN_MESSAGE } 
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
                responseValue: { message: SESSION_EXPIRED_MESSAGE } 
            });
        }

        // Verify account still exists in the corresponding table.
        try {
            const account = await resolveAccount(userId);
            if (!account) {
                tokenService.removeToken(userId);
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: ACCOUNT_DELETED_MESSAGE } 
                });
            }

            if (account.is_deleted) {
                tokenService.removeToken(userId);
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: ACCOUNT_DELETED_MESSAGE } 
                });
            }
        } catch (dbError) {
            logger.error('Database error in auth middleware:', dbError);
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: AUTH_FAILED_MESSAGE } 
            });
        }

        // Token is valid, attach user info to request and proceed
        req.user = {
            ...decoded,
            userId: typeof userId === 'number' ? userId : String(userId),
            accountType
        };
        if (accountType === 'admin') req.admin = req.user;
        next();
    });
}

function authenticateToken(req, res, next) {
    return authenticateRequest(req, res, next, {
        resolveAccount: (userId) => User.findById(userId),
        accountType: 'user'
    });
}

function authenticateAdminToken(req, res, next) {
    return authenticateRequest(req, res, next, {
        resolveAccount: (adminId) => Admin.findById(adminId),
        accountType: 'admin'
    });
}

module.exports = { authenticateToken, authenticateAdminToken };
