/**
 * Request Validation Utilities
 * Common validation functions for API requests
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate mobile number format (Indian mobile numbers)
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} True if valid mobile
 */
function isValidMobile(mobile) {
    // Accept 10-digit Indian mobile numbers and +91 prefix
    const mobileRegex = /^(\+91|0)?[6-9]\d{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with details
 */
function validatePassword(password) {
    const result = {
        isValid: false,
        errors: []
    };

    if (!password || password.length < 8) {
        result.errors.push('கடவுச்சொல் குறைந்தது 8 characters இல் இருக்க வேண்டும்');
    }
    if (!/[A-Z]/.test(password)) {
        result.errors.push('கடவுச்சொல்லில் குறைந்தது ஒரு uppercase letter இருக்க வேண்டும்');
    }
    if (!/[a-z]/.test(password)) {
        result.errors.push('கடவுச்சொல்லில் குறைந்தது ஒரு lowercase letter இருக்க வேண்டும்');
    }
    if (!/[0-9]/.test(password)) {
        result.errors.push('கடவுச்சொல்லில் குறைந்தது ஒரு number இருக்க வேண்டும்');
    }

    result.isValid = result.errors.length === 0;
    return result;
}

/**
 * Validate name (not empty, reasonable length)
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid
 */
function isValidName(name) {
    return name && name.trim().length >= 2 && name.trim().length <= 120;
}

/**
 * Validate date format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

/**
 * Validate UUID format (v4)
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} True if valid UUID
 */
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Sanitize user input (basic HTML/script prevention)
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

/**
 * Validate user create request payload
 * @param {Object} payload - Request payload
 * @returns {Object} Validation result
 */
function validateUserCreate(payload) {
    const result = {
        isValid: true,
        errors: []
    };

    if (!payload.name || !isValidName(payload.name)) {
        result.errors.push('பெயர் குறைந்தது 2 characters மற்றும் அதிகபட்சம் 120 characters இல் இருக்க வேண்டும்');
    }

    if (!payload.email || !isValidEmail(payload.email)) {
        result.errors.push('செல்லுபடியாகும் மின்னஞ்சல் address தேவை');
    }

    if (!payload.mobile || !isValidMobile(payload.mobile)) {
        result.errors.push('செல்லுபடியாகும் மொபைல் எண் தேவை');
    }

    if (!payload.password) {
        result.errors.push('கடவுச்சொல் தேவை');
    } else {
        const passwordValidation = validatePassword(payload.password);
        if (!passwordValidation.isValid) {
            result.errors.push(...passwordValidation.errors);
        }
    }

    result.isValid = result.errors.length === 0;
    return result;
}

/**
 * Validate user update request payload
 * @param {Object} payload - Request payload
 * @returns {Object} Validation result
 */
function validateUserUpdate(payload) {
    const result = {
        isValid: true,
        errors: []
    };

    if (!payload.id || !isValidUUID(payload.id)) {
        result.errors.push('செல்லுபடியாகும் பயனர் ID தேவை');
    }

    if (payload.name && !isValidName(payload.name)) {
        result.errors.push('பெயர் குறைந்தது 2 characters மற்றும் அதிகபட்சம் 120 characters இல் இருக்க வேண்டும்');
    }

    if (payload.email && !isValidEmail(payload.email)) {
        result.errors.push('செல்லுபடியாகும் மின்னஞ்சல் address தேவை');
    }

    if (payload.mobile && !isValidMobile(payload.mobile)) {
        result.errors.push('செல்லுபடியாகும் மொபைல் எண் தேவை');
    }

    result.isValid = result.errors.length === 0;
    return result;
}

module.exports = {
    isValidEmail,
    isValidMobile,
    validatePassword,
    isValidName,
    isValidDate,
    isValidUUID,
    sanitizeInput,
    validateUserCreate,
    validateUserUpdate
};
