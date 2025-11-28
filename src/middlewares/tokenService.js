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
    // Ensure userId is consistently stored as a number
    const normalizedUserId = Number(userId);
    const token = jwt.sign({ userId: normalizedUserId }, process.env.JWT_SECRET, { expiresIn: '30 days' });
    userTokens[normalizedUserId] = token;
    return token;
}

/**
 * Invalidate the previous token for a user (single-session policy)
 * @param {number} userId - The user ID
 */
function invalidatePreviousToken(userId) {
    if (userId) {
        const normalizedUserId = Number(userId);
        if (userTokens[normalizedUserId]) {
            delete userTokens[normalizedUserId];
        }
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
    // Ensure userId is consistently retrieved as a number
    const normalizedUserId = Number(userId);
    return userTokens[normalizedUserId];
}

/**
 * Remove token for a user (e.g., on logout or account deletion)
 * @param {number} userId - The user ID
 */
function removeToken(userId) {
    if (userId) {
        const normalizedUserId = Number(userId);
        if (userTokens[normalizedUserId]) {
            delete userTokens[normalizedUserId];
        }
    }
}

/**
 * Check if a token exists for a user
 * @param {number} userId - The user ID
 * @returns {boolean} - True if token exists, false otherwise
 */
function hasToken(userId) {
    if (!userId) {
        return false;
    }
    const normalizedUserId = Number(userId);
    return userTokens[normalizedUserId] !== undefined;
}

module.exports = {
    generateToken,
    invalidatePreviousToken,
    getTokenForUser,
    removeToken,
    hasToken
};
