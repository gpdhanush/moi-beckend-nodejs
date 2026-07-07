const { isLegacyNumericId } = require('./uuid');

const INVALID_ID_MESSAGE = 'செல்லுபடியாகாத ID. எண் ID மட்டும் அனுமதிக்கப்படுகிறது (எ.கா. 2, 29).';

/**
 * Validate numeric entity IDs (bigint auto-increment).
 */
function validateUuid(value, fieldName = 'id') {
    if (value == null || String(value).trim() === '') {
        return { ok: false, message: `${fieldName} தேவை.` };
    }

    const str = String(value).trim();
    if (!isLegacyNumericId(str)) {
        return { ok: false, message: `${fieldName}: ${INVALID_ID_MESSAGE}` };
    }

    return { ok: true, value: str };
}

/**
 * Validate multiple ID fields. Skips null/undefined/empty optional fields.
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
    INVALID_ID_MESSAGE,
};
