const crypto = require('crypto');

/**
 * Generate a new UUID v4 string.
 */
function generateUUID() {
    return crypto.randomUUID();
}

function formatUuidHex(hex) {
    return hex.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

/**
 * True when the value is a legacy auto-increment ID (DB not yet migrated to BINARY(16)).
 */
function isLegacyNumericId(value) {
    if (value == null) return false;
    if (typeof value === 'number' && Number.isSafeInteger(value)) return true;
    const s = String(value).trim();
    return /^\d+$/.test(s) && s.length <= 19;
}

/**
 * Convert UUID string to 16-byte Buffer for BINARY(16) columns.
 * Legacy bigint IDs are returned as numbers for BIGINT columns.
 * @param {string|number} uuid - UUID string or legacy numeric id
 * @returns {Buffer|number|null}
 */
function toBinaryUUID(uuid) {
    if (uuid == null || uuid === '') return null;
    if (Buffer.isBuffer(uuid)) {
        return uuid.length === 16 ? uuid : null;
    }
    if (isLegacyNumericId(uuid)) {
        return parseInt(String(uuid).trim(), 10);
    }
    const str = String(uuid).trim().replace(/-/g, '');
    if (str.length !== 32) return null;
    return Buffer.from(str, 'hex');
}

/**
 * Convert BINARY(16) from DB (Buffer) or legacy BIGINT to string id.
 * @param {Buffer|string|number} buf
 * @returns {string|null}
 */
function fromBinaryUUID(buf) {
    if (buf == null) return null;
    if (Buffer.isBuffer(buf)) {
        const hex = buf.toString('hex');
        return hex.length === 32 ? formatUuidHex(hex) : null;
    }
    if (isLegacyNumericId(buf)) {
        return String(buf).trim();
    }
    const str = String(buf).trim();
    const hex = str.replace(/-/g, '');
    if (hex.length === 32) return formatUuidHex(hex);
    return null;
}

module.exports = { generateUUID, toBinaryUUID, fromBinaryUUID, isLegacyNumericId };
