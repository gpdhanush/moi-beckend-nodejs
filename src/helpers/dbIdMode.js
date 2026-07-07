let dbIdMode = null;

/**
 * Detect whether primary keys use BINARY(16) UUID or BIGINT auto-increment.
 * Uses users.id as the reference column. Result is cached per process.
 */
async function getDbIdMode(db) {
    if (dbIdMode) return dbIdMode;
    const [cols] = await db.query("SHOW COLUMNS FROM users WHERE Field = 'id'");
    const type = String(cols[0]?.Type || '').toLowerCase();
    dbIdMode = type.includes('binary') ? 'uuid' : 'bigint';
    return dbIdMode;
}

function usesNumericIds(mode) {
    return mode === 'bigint';
}

/** @deprecated use getDbIdMode */
const getUsersIdMode = getDbIdMode;

module.exports = { getDbIdMode, getUsersIdMode, usesNumericIds };
