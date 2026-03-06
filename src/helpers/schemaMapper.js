/**
 * Schema Mapping Utilities
 * Maps between new schema field names and old schema field names for backward compatibility
 */

const { fromBinaryUUID } = require('./uuid');

/**
 * Map user row from database to both old and new field names
 * @param {Object} userRow - Raw user row from database
 * @returns {Object} User object with both old and new field names
 */
function mapUserRow(userRow) {
    if (!userRow || !userRow.id) return null;
    
    const id = fromBinaryUUID(userRow.id);
    const fcmToken = userRow.fcm_token || userRow.notification_token || null;

    return {
        // New schema names
        id,
        full_name: userRow.full_name,
        email: userRow.email,
        mobile: userRow.mobile,
        referral_code: userRow.referral_code || null,
        status: userRow.status,
        password_hash: userRow.password_hash,
        last_activity_at: userRow.last_activity_at,
        profile_image_url: userRow.profile_image_url,
        notification_token: fcmToken,
        created_at: userRow.created_at,
        updated_at: userRow.updated_at,
        is_verified: userRow.is_verified,
        email_verified_at: userRow.email_verified_at,

        // Old schema names (for backward compatibility)
        um_id: id,
        um_full_name: userRow.full_name,
        um_email: userRow.email,
        um_mobile: userRow.mobile,
        um_referral_code: userRow.referral_code,
        um_status: userRow.status,
        um_password: userRow.password_hash,
        um_last_login: userRow.last_activity_at,
        um_profile_image: userRow.profile_image_url,
        um_notification_token: fcmToken,
        um_create_dt: userRow.created_at,
        um_update_dt: userRow.updated_at
    };
}

/**
 * Map person row from database
 * @param {Object} personRow - Raw person row from database
 * @returns {Object} Person object with both old and new field names
 */
function mapPersonRow(personRow) {
    if (!personRow || !personRow.id) return null;

    const id = fromBinaryUUID(personRow.id);
    const userId = fromBinaryUUID(personRow.user_id);

    return {
        // New schema names
        id,
        user_id: userId,
        first_name: personRow.first_name,
        last_name: personRow.last_name,
        mobile: personRow.mobile,
        city: personRow.city,
        occupation: personRow.occupation,
        created_at: personRow.created_at,
        updated_at: personRow.updated_at,
        is_deleted: personRow.is_deleted || 0,

        // Old schema names (for backward compatibility)
        mp_id: id,
        mp_um_id: userId,
        mp_first_name: personRow.first_name,
        mp_second_name: personRow.last_name,
        mp_mobile: personRow.mobile,
        mp_city: personRow.city,
        mp_business: personRow.occupation,
        mp_create_dt: personRow.created_at,
        mp_update_dt: personRow.updated_at,
        mp_active: (personRow.is_deleted === 0 || personRow.is_deleted === null) ? 'Y' : 'N'
    };
}

/**
 * Map transaction row from database
 * @param {Object} transactionRow - Raw transaction row from database
 * @returns {Object} Transaction object with both old and new field names
 */
function mapTransactionRow(transactionRow) {
    if (!transactionRow || !transactionRow.id) return null;

    const id = fromBinaryUUID(transactionRow.id);
    const userId = transactionRow.user_id ? fromBinaryUUID(transactionRow.user_id) : null;
    const personId = transactionRow.person_id ? fromBinaryUUID(transactionRow.person_id) : null;

    return {
        // New schema names
        id,
        user_id: userId,
        person_id: personId,
        type: transactionRow.type,
        item_type: transactionRow.item_type,
        amount: transactionRow.amount,
        notes: transactionRow.notes,
        transaction_date: transactionRow.transaction_date || transactionRow.createDate,
        created_at: transactionRow.created_at,
        updated_at: transactionRow.updated_at,
        is_deleted: transactionRow.is_deleted || 0,

        // Old schema names (for backward compatibility)
        mr_id: id,
        mom_id: id,
        mr_um_id: userId,
        mom_user_id: userId,
        mcd_um_id: userId,
        mr_person_id: personId,
        mp_id: personId,
        mr_first_name: transactionRow.first_name,
        mr_second_name: transactionRow.last_name,
        mr_city_id: transactionRow.city,
        mr_occupation: transactionRow.occupation,
        mr_amount: transactionRow.amount,
        mom_amount: transactionRow.amount,
        mr_remarks: transactionRow.notes,
        mom_remarks: transactionRow.notes,
        mr_create_dt: transactionRow.transaction_date || transactionRow.createDate,
        mom_create_dt: transactionRow.transaction_date || transactionRow.createDate,
        seimurai: transactionRow.item_type,
        mcd_mode: transactionRow.item_type
    };
}

/**
 * Map function row from database
 * @param {Object} functionRow - Raw function row from database
 * @returns {Object} Function object with both old and new field names
 */
function mapFunctionRow(functionRow) {
    if (!functionRow || !functionRow.id) return null;

    const id = fromBinaryUUID(functionRow.id);
    const userId = fromBinaryUUID(functionRow.user_id);

    return {
        // New schema names
        id,
        user_id: userId,
        title: functionRow.title,
        function_date: functionRow.function_date,
        location: functionRow.location,
        status: functionRow.status,
        created_at: functionRow.created_at,
        updated_at: functionRow.updated_at,
        is_deleted: functionRow.is_deleted || 0,

        // Old schema names (for backward compatibility)
        f_id: id,
        f_um_id: userId,
        function_name: functionRow.title,
        f_name: functionRow.title,
        f_date: functionRow.function_date,
        f_place: functionRow.location,
        place: functionRow.location,
        f_status: functionRow.status,
        f_create_dt: functionRow.created_at,
        f_update_dt: functionRow.updated_at
    };
}

/**
 * Transform API response to use new field names
 * @param {Object} data - Data object with old field names
 * @returns {Object} Transformed object with new field names
 */
function transformToNewSchema(data) {
    return {
        id: data.um_id || data.id,
        full_name: data.um_full_name || data.name,
        email: data.um_email || data.email,
        mobile: data.um_mobile || data.mobile,
        referral_code: data.um_referral_code || data.referral_code,
        status: data.um_status || data.status,
        last_activity_at: data.um_last_login || data.last_login,
        profile_image_url: data.um_profile_image || data.profile_image,
        notification_token: data.um_notification_token || data.notification_token
    };
}

module.exports = {
    mapUserRow,
    mapPersonRow,
    mapTransactionRow,
    mapFunctionRow,
    transformToNewSchema
};
