const jwt = require('jsonwebtoken');

// In-memory token storage (consider using Redis for production with multiple servers)
const userTokens = {};

/**
 * Generate a new JWT token for a user and store it
 * @param {number} userId - The user ID
 * @returns {string} - The generated JWT token
 */
function generateToken(userId) {
    if (!userId) {
        throw new Error('User ID is required to generate token');
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7 days' });
    userTokens[userId] = token;
    return token;
}

/**
 * Invalidate the previous token for a user (single-session policy)
 * @param {number} userId - The user ID
 */
function invalidatePreviousToken(userId) {
    if (userId && userTokens[userId]) {
        delete userTokens[userId];
    }
}

/**
 * Get the current valid token for a user
 * @param {number} userId - The user ID
 * @returns {string|undefined} - The token if exists, undefined otherwise
 */
function getTokenForUser(userId) {
    if (!userId) {
        return undefined;
    }
    return userTokens[userId];
}

/**
 * Remove token for a user (e.g., on logout or account deletion)
 * @param {number} userId - The user ID
 */
function removeToken(userId) {
    if (userId && userTokens[userId]) {
        delete userTokens[userId];
    }
}

/**
 * Check if a token exists for a user
 * @param {number} userId - The user ID
 * @returns {boolean} - True if token exists, false otherwise
 */
function hasToken(userId) {
    return userId ? userTokens[userId] !== undefined : false;
}

module.exports = {
    generateToken,
    invalidatePreviousToken,
    getTokenForUser,
    removeToken,
    hasToken
};
