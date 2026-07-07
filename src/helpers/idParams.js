const { isValidUUID } = require('./validators');
const { isLegacyNumericId } = require('./uuid');

const INVALID_UUID_MESSAGE = 'செல்லுபடியாகாத ID வடிவம். UUID string தேவை (எ.கா. 550e8400-e29b-41d4-a716-446655440000).';

/**
 * Reject legacy integer IDs and invalid UUID strings.
 */
function validateUuid(value, fieldName = 'id') {
    if (value == null || String(value).trim() === '') {
        return { ok: false, message: `${fieldName} தேவை.` };
    }

    const str = String(value).trim();
    if (isLegacyNumericId(str)) {
        return { ok: true, value: str };
    }

    if (!isValidUUID(str)) {
        return { ok: false, message: `${fieldName}: ${INVALID_UUID_MESSAGE}` };
    }

    return { ok: true, value: str };
}

/**
 * Validate multiple UUID fields. Skips null/undefined/empty optional fields.
 */
function validateUuidFields(fieldMap) {
    for (const [fieldName, value] of Object.entries(fieldMap)) {
        if (value == null || String(value).trim() === '') continue;
        const result = validateUuid(value, fieldName);
        if (!result.ok) return result;
    }
    return { ok: true };
}

function validateUuidList(values, fieldName = 'userIds') {
    if (!Array.isArray(values) || values.length === 0) {
        return { ok: false, message: `${fieldName} must be a non-empty array.` };
    }
    for (let i = 0; i < values.length; i++) {
        const result = validateUuid(values[i], `${fieldName}[${i}]`);
        if (!result.ok) return result;
    }
    return { ok: true };
}

function sendUuidError(res, message) {
    return res.status(400).json({
        responseType: 'F',
        responseValue: { message },
    });
}

module.exports = {
    validateUuid,
    validateUuidFields,
    validateUuidList,
    sendUuidError,
    INVALID_UUID_MESSAGE,
};
