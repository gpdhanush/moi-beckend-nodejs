/**
 * API Response Formatting Utilities
 * Standardized response formats for consistent API responses
 */

/**
 * Format success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
function successResponse(data = null, message = "தரவு வெற்றிகரமாக பெறப்பட்டது", statusCode = 200) {
    return {
        statusCode,
        responseType: "S",
        responseValue: {
            message,
            data
        }
    };
}

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} details - Additional error details
 * @returns {Object} Formatted response
 */
function errorResponse(message = "ஏதாவது பிழை ஏற்பட்டது", statusCode = 500, details = null) {
    return {
        statusCode,
        responseType: "F",
        responseValue: {
            message,
            ...(details && { details })
        }
    };
}

/**
 * Format list response with pagination
 * @param {Array} items - List of items
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Success message
 * @returns {Object} Formatted response
 */
function listResponse(items = [], total = 0, page = 1, limit = 10, message = "தரவு வெற்றிகரமாக பெறப்பட்டது") {
    const totalPages = Math.ceil(total / limit);
    
    return {
        statusCode: 200,
        responseType: "S",
        responseValue: {
            message,
            data: items,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
    };
}

/**
 * Format validation error response
 * @param {Array} errors - List of error messages
 * @returns {Object} Formatted response
 */
function validationErrorResponse(errors = []) {
    return {
        statusCode: 400,
        responseType: "F",
        responseValue: {
            message: "சரிபார்ப்பு தோல்வி",
            errors
        }
    };
}

/**
 * Format authentication error response
 * @param {string} message - Error message
 * @returns {Object} Formatted response
 */
function authenticationErrorResponse(message = "அங்கீகாரம் தோல்வி") {
    return {
        statusCode: 401,
        responseType: "F",
        responseValue: {
            message
        }
    };
}

/**
 * Format authorization error response
 * @param {string} message - Error message
 * @returns {Object} Formatted response
 */
function authorizationErrorResponse(message = "அனுமதி மறுக்கப்பட்டது") {
    return {
        statusCode: 403,
        responseType: "F",
        responseValue: {
            message
        }
    };
}

/**
 * Format not found response
 * @param {string} resource - Resource type
 * @returns {Object} Formatted response
 */
function notFoundResponse(resource = "வளம்") {
    return {
        statusCode: 404,
        responseType: "F",
        responseValue: {
            message: `${resource} கண்டுபிடிக்கப்படவில்லை`
        }
    };
}

/**
 * Format duplicate entry response
 * @param {string} field - Field name
 * @returns {Object} Formatted response
 */
function duplicateEntryResponse(field = "நுழைவு") {
    return {
        statusCode: 409,
        responseType: "F",
        responseValue: {
            message: `${field} ஏற்கனவே உள்ளது`
        }
    };
}

/**
 * Format database error response
 * @param {string} message - Error message
 * @returns {Object} Formatted response
 */
function databaseErrorResponse(message = "தரவுத்தளம் பிழை") {
    return {
        statusCode: 500,
        responseType: "F",
        responseValue: {
            message
        }
    };
}

/**
 * Format server error response
 * @param {Error} error - Error object
 * @returns {Object} Formatted response
 */
function serverErrorResponse(error) {
    const message = error?.message || "சேவையகம் பிழை";
    
    return {
        statusCode: 500,
        responseType: "F",
        responseValue: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
        }
    };
}

/**
 * Format profile data for response
 * @param {Object} user - User object from database
 * @returns {Object} Formatted profile response
 */
function formatUserProfile(user) {
    if (!user) return null;

    return {
        id: user.id || user.um_id,
        name: user.full_name || user.um_full_name,
        email: user.email || user.um_email,
        mobile: user.mobile || user.um_mobile,
        status: user.status || user.um_status,
        lastLogin: user.last_activity_at || user.um_last_login,
        profileImage: user.profile_image_url || user.um_profile_image || null,
        referralCode: user.referral_code || user.um_referral_code || null,
        isVerified: user.is_verified || 0,
        createdAt: user.created_at || user.um_create_dt,
        updatedAt: user.updated_at || user.um_update_dt
    };
}

/**
 * Format person data for response
 * @param {Object} person - Person object from database
 * @returns {Object} Formatted person response
 */
function formatPerson(person) {
    if (!person) return null;

    return {
        id: person.id || person.mp_id,
        firstName: person.first_name || person.mp_first_name,
        lastName: person.last_name || person.mp_second_name,
        mobile: person.mobile || person.mp_mobile,
        city: person.city || person.mp_city,
        occupation: person.occupation || person.mp_business,
        createdAt: person.created_at || person.mp_create_dt
    };
}

/**
 * Format transaction data for response
 * @param {Object} transaction - Transaction object from database
 * @returns {Object} Formatted transaction response
 */
function formatTransaction(transaction) {
    if (!transaction) return null;

    // Normalize SQL DATE/ DATETIME to YYYY-MM-DD (local) string to avoid
    // timezone shifts when Date objects are serialized to ISO strings.
    const rawDate = transaction.transaction_date || transaction.mr_create_dt;
    let transactionDate = rawDate;
    if (rawDate instanceof Date) {
        const y = rawDate.getFullYear();
        const m = String(rawDate.getMonth() + 1).padStart(2, '0');
        const d = String(rawDate.getDate()).padStart(2, '0');
        transactionDate = `${y}-${m}-${d}`;
    }

    return {
        id: transaction.id || transaction.mr_id,
        userId: transaction.user_id || transaction.mr_um_id,
        personId: transaction.person_id || transaction.mr_person_id,
        firstName: transaction.first_name || transaction.mr_first_name,
        lastName: transaction.last_name || transaction.mr_second_name,
        city: transaction.city || transaction.mr_city_id,
        amount: transaction.amount || transaction.mr_amount,
        notes: transaction.notes || transaction.mr_remarks,
        type: transaction.type,
        itemType: transaction.item_type || transaction.seimurai,
        transactionDate: transactionDate,
        createdAt: transaction.created_at || transaction.mr_create_dt
    };
}

module.exports = {
    successResponse,
    errorResponse,
    listResponse,
    validationErrorResponse,
    authenticationErrorResponse,
    authorizationErrorResponse,
    notFoundResponse,
    duplicateEntryResponse,
    databaseErrorResponse,
    serverErrorResponse,
    formatUserProfile,
    formatPerson,
    formatTransaction
};
