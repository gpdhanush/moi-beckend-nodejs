const crypto = require('crypto');

/**
 * Generate a new UUID v4 string.
 */
function generateUUID() {
    return crypto.randomUUID();
}

/**
 * Convert UUID string to 16-byte Buffer for BINARY(16) columns.
 * Works on MariaDB 10.4 and earlier (no UUID_TO_BIN).
 * @param {string} uuid - e.g. '550e8400-e29b-41d4-a716-446655440000'
 * @returns {Buffer} 16 bytes
 */
function toBinaryUUID(uuid) {
    if (!uuid) return null;
    const str = typeof uuid === 'string' ? uuid.replace(/-/g, '') : String(uuid).replace(/-/g, '');
    if (str.length !== 32) return null;
    return Buffer.from(str, 'hex');
}

/**
 * Convert BINARY(16) from DB (Buffer or hex string) to UUID string.
 * @param {Buffer|string} buf - 16-byte buffer or 32-char hex string
 * @returns {string} UUID with hyphens
 */
function fromBinaryUUID(buf) {
    if (buf == null) return null;
    if (Buffer.isBuffer(buf)) {
        const hex = buf.toString('hex');
        return hex.length === 32 ? hex.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5') : null;
    }
    const str = String(buf).replace(/-/g, '');
    return str.length === 32 ? str.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5') : null;
}

module.exports = { generateUUID, toBinaryUUID, fromBinaryUUID };
