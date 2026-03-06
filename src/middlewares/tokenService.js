const jwt = require('jsonwebtoken');

// In-memory token storage (consider using Redis for production with multiple servers)
const userTokens = {};

/**
 * Normalize user ID (supports both legacy integer and new UUID string)
 * @param {string|number} userId
 * @returns {string|number}
 */
function normalizeUserId(userId) {
    if (userId == null) return userId;
    if (typeof userId === 'string' && userId.length === 36) return userId; // UUID
    const n = Number(userId);
    return isNaN(n) ? userId : n;
}

/**
 * Generate a new JWT token for a user and store it
 * @param {string|number} userId - The user ID (UUID string or legacy number)
 * @returns {string} - The generated JWT token
 */
function generateToken(userId) {
    if (!userId) {
        throw new Error('User ID is required to generate token');
    }
    const key = normalizeUserId(userId);
    const token = jwt.sign({ userId: key }, process.env.JWT_SECRET, { expiresIn: '30 days' });
    userTokens[key] = token;
    return token;
}

/**
 * Invalidate the previous token for a user (single-session policy)
 * @param {string|number} userId - The user ID
 */
function invalidatePreviousToken(userId) {
    if (userId != null) {
        const key = normalizeUserId(userId);
        if (userTokens[key] !== undefined) delete userTokens[key];
    }
}

/**
 * Get the current valid token for a user
 * @param {string|number} userId - The user ID
 * @returns {string|undefined} - The token if exists, undefined otherwise
 */
function getTokenForUser(userId) {
    if (userId == null) return undefined;
    return userTokens[normalizeUserId(userId)];
}

/**
 * Remove token for a user (e.g., on logout or account deletion)
 * @param {string|number} userId - The user ID
 */
function removeToken(userId) {
    if (userId != null) {
        const key = normalizeUserId(userId);
        if (userTokens[key] !== undefined) delete userTokens[key];
    }
}

/**
 * Check if a token exists for a user
 * @param {string|number} userId - The user ID
 * @returns {boolean} - True if token exists, false otherwise
 */
function hasToken(userId) {
    if (userId == null) return false;
    return userTokens[normalizeUserId(userId)] !== undefined;
}

module.exports = {
    generateToken,
    invalidatePreviousToken,
    getTokenForUser,
    removeToken,
    hasToken
};
