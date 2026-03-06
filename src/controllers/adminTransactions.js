const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const logger = require('../config/logger');

// Helper: normalize SQL DATE/DATETIME values to YYYY-MM-DD local string
function normalizeSqlDateToYMD(rawDate) {
  if (!rawDate) return rawDate;
  if (rawDate instanceof Date) {
    const y = rawDate.getFullYear();
    const m = String(rawDate.getMonth() + 1).padStart(2, '0');
    const d = String(rawDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return rawDate;
}

exports.controller = {
  /**
   * List all transactions across all users with details
   * @body { search?, type?, startDate?, endDate?, limit?, offset? }
   */
  list: async (req, res) => {
    try {
      const { search, type, startDate, endDate, limit = 100, offset = 0 } = req.body;

      let countQuery = `SELECT COUNT(*) as total FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN persons p ON t.person_id = p.id
        LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
        WHERE t.is_deleted = 0`;

      let query = `
        SELECT t.id, t.user_id, t.person_id, t.transaction_function_id, t.transaction_function_name,
               t.transaction_date, t.type, t.amount, t.item_name, t.notes,
               u.full_name as user_name, u.email as user_email,
               p.first_name, p.last_name,
               tf.function_name,
               t.created_at, t.updated_at
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN persons p ON t.person_id = p.id
        LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
        WHERE t.is_deleted = 0
      `;
      const params = [];
      const countParams = [];

      if (search) {
        const clause = ` AND (p.first_name LIKE ? OR p.last_name LIKE ? OR u.full_name LIKE ? OR t.item_name LIKE ?)`;
        query += clause;
        countQuery += clause;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (type && ['INVEST', 'RETURN'].includes(type)) {
        const clause = ` AND t.type = ?`;
        query += clause;
        countQuery += clause;
        params.push(type);
        countParams.push(type);
      }

      if (startDate) {
        const clause = ` AND t.transaction_date >= ?`;
        query += clause;
        countQuery += clause;
        params.push(startDate);
        countParams.push(startDate);
      }

      if (endDate) {
        const clause = ` AND t.transaction_date <= ?`;
        query += clause;
        countQuery += clause;
        params.push(endDate);
        countParams.push(endDate);
      }

      // Get total count
      const [countRows] = await db.query(countQuery, countParams);
      const totalCount = countRows[0]?.total || 0;

      // Get paginated results
      query += ` ORDER BY t.transaction_date DESC, t.created_at DESC LIMIT ? OFFSET ?`;
      params.push(Math.min(parseInt(limit), 500), parseInt(offset));

      logger.info('Fetching transactions with query:', query);
      const [rows] = await db.query(query, params);
      logger.info('Transactions list result count:', rows.length, 'Total:', totalCount);

      return res.status(200).json({
        responseType: "S",
        count: totalCount,
        responseValue: rows.map(r => ({
          id: fromBinaryUUID(r.id),
          userId: fromBinaryUUID(r.user_id),
          userName: r.user_name,
          userEmail: r.user_email,
          personId: fromBinaryUUID(r.person_id),
          personName: `${r.first_name} ${r.last_name || ''}`.trim(),
          transactionFunctionId: r.transaction_function_id ? fromBinaryUUID(r.transaction_function_id) : null,
          functionName: r.function_name || r.transaction_function_name,
          transactionDate: normalizeSqlDateToYMD(r.transaction_date),
          type: r.type,
          amount: r.amount,
          itemName: r.item_name,
          notes: r.notes,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }))
      });
    } catch (error) {
      logger.error('Error fetching admin transactions:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Get transaction details
   * @body { transactionId }
   */
  detail: async (req, res) => {
    try {
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Transaction ID required" }
        });
      }

      const [rows] = await db.query(`
        SELECT t.id, t.user_id, t.person_id, t.transaction_function_id, t.transaction_function_name,
               t.transaction_date, t.type, t.amount, t.item_name, t.notes,
               u.full_name as user_name, u.email as user_email,
               p.first_name, p.last_name,
               tf.function_name,
               t.created_at, t.updated_at
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN persons p ON t.person_id = p.id
        LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
        WHERE t.id = ? AND t.is_deleted = 0
      `, [toBinaryUUID(transactionId)]);

      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Transaction not found" }
        });
      }

      const r = rows[0];
      return res.status(200).json({
        responseType: "S",
        responseValue: {
          id: fromBinaryUUID(r.id),
          userId: fromBinaryUUID(r.user_id),
          userName: r.user_name,
          userEmail: r.user_email,
          personId: fromBinaryUUID(r.person_id),
          personName: `${r.first_name} ${r.last_name || ''}`.trim(),
          transactionFunctionId: r.transaction_function_id ? fromBinaryUUID(r.transaction_function_id) : null,
          functionName: r.function_name || r.transaction_function_name,
          transactionDate: normalizeSqlDateToYMD(r.transaction_date),
          type: r.type,
          amount: r.amount,
          itemName: r.item_name,
          notes: r.notes,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }
      });
    } catch (error) {
      logger.error('Error fetching admin transaction detail:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Create transaction with person data and custom function support
   * @body { 
   *   userId, 
   *   firstName, secondName, city, occupation, mobile (person data),
   *   transactionDate, type(INVEST|RETURN), amount?, itemName?, notes?, 
   *   transactionFunctionId?, transactionFunctionName?,
   *   is_custom?, customFunction?
   * }
   */
  create: async (req, res) => {
    try {
      logger.info('=== TRANSACTION CREATE REQUEST ===');
      logger.info('Request body:', JSON.stringify(req.body, null, 2));
      
      const { 
        userId, 
        firstName, 
        secondName, 
        city, 
        occupation, 
        mobile,
        transactionDate, 
        type, 
        amount, 
        itemName, 
        notes, 
        transactionFunctionId,
        transactionFunctionName,
        is_custom,
        customFunction 
      } = req.body;

      logger.info('Parsed values:', {
        userId: `"${userId}"`,
        firstName: `"${firstName}"`,
        transactionDate: `"${transactionDate}"`,
        type: `"${type}"`
      });

      // Validate required fields
      if (!userId || !firstName || !transactionDate || !type) {
        logger.error('Missing required fields:', { userId, firstName, transactionDate, type });
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "userId, firstName, transactionDate, and type are required" }
        });
      }

      // Validate userId is a valid UUID
      logger.info('Converting userId to binary:', userId, 'Type:', typeof userId);
      const userIdBinary = toBinaryUUID(userId);
      logger.info('userIdBinary result:', userIdBinary?.toString('hex'));
      
      if (!userIdBinary) {
        logger.error('Invalid userId format:', userId);
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Invalid userId format - must be a valid UUID" }
        });
      }

      if (!['INVEST', 'RETURN'].includes(type)) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Type must be INVEST or RETURN" }
        });
      }

      // Try to find existing person or create new one
      let personIdBinary = null;
      const searchQuery = `
        SELECT id FROM persons 
        WHERE first_name = ? AND last_name = ?
        LIMIT 1
      `;
      
      logger.info('Prior to person lookup with query:', searchQuery, 'params:', [firstName.trim(), (secondName || '').trim()]);
      
      try {
        const [existingPersons] = await db.query(searchQuery, [firstName.trim(), (secondName || '').trim()]);
        logger.info('Person lookup result:', existingPersons);
        
        if (existingPersons[0]) {
          // id is already binary from DB
          personIdBinary = existingPersons[0].id;
          logger.info('Found existing person, personIdBinary:', personIdBinary?.toString('hex'));
        } else {
          // Create new person
          const newPersonId = generateUUID();
          const personIdBinaryValue = toBinaryUUID(newPersonId);
          logger.info('Creating new person with id:', newPersonId, 'binary:', personIdBinaryValue?.toString('hex'));
          
          const insertQuery = `
            INSERT INTO persons (id, user_id, first_name, last_name, city, occupation, mobile)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          await db.query(insertQuery, [
            personIdBinaryValue,
            userIdBinary,
            firstName.trim(),
            (secondName || '').trim(),
            (city || '').trim() || null,
            (occupation || '').trim() || null,
            (mobile || '').trim() || null
          ]);
          personIdBinary = personIdBinaryValue;
          logger.info('Person created successfully');
        }
      } catch (personError) {
        logger.error('Error in person lookup/creation:', personError);
        throw personError;
      }

      // Handle transaction function - either use provided ID, custom, or transactionFunctionName
      let finalTransactionFunctionId = null;
      let finalTransactionFunctionName = transactionFunctionName || null;

      if (is_custom && customFunction) {
        // For custom functions, store the name - backend creates it or stores as name
        finalTransactionFunctionName = customFunction.trim();
      } else if (transactionFunctionId) {
        finalTransactionFunctionId = transactionFunctionId;
        // If transactionFunctionName provided, use it; otherwise it will be looked up from DB
        if (transactionFunctionName) {
          finalTransactionFunctionName = transactionFunctionName;
        }
      }

      // Create transaction
      const newId = generateUUID();
      const insertTransactionQuery = `
        INSERT INTO transactions (id, user_id, person_id, transaction_function_id, transaction_function_name, transaction_date, type, amount, item_name, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const insertParams = [
        toBinaryUUID(newId), 
        userIdBinary, 
        personIdBinary,
        finalTransactionFunctionId ? toBinaryUUID(finalTransactionFunctionId) : null,
        finalTransactionFunctionName,
        transactionDate, 
        type, 
        amount || null, 
        itemName || null, 
        notes || null
      ];

      logger.info('About to insert transaction:', {
        newId: toBinaryUUID(newId)?.toString('hex'),
        userIdBinary: userIdBinary?.toString('hex'),
        personIdBinary: personIdBinary?.toString('hex'),
        transactionDate,
        type,
        finalTransactionFunctionName
      });

      logger.info('Insert params array:', {
        param0_newId: insertParams[0]?.toString('hex'),
        param1_userId: insertParams[1]?.toString('hex'),
        param2_personId: insertParams[2]?.toString('hex'),
        param3_functionId: insertParams[3],
        param4_functionName: insertParams[4],
        param5_date: insertParams[5],
        param6_type: insertParams[6],
        param7_amount: insertParams[7],
        param8_itemName: insertParams[8],
        param9_notes: insertParams[9],
        fullArray: insertParams
      });

      await db.query(insertTransactionQuery, insertParams);

      logger.info('Transaction created:', {
        id: newId,
        userId,
        personId: fromBinaryUUID(personIdBinary),
        type,
        amount
      });

      return res.status(201).json({
        responseType: "S",
        responseValue: {
          message: "Transaction created successfully",
          transactionId: newId,
          personId: fromBinaryUUID(personIdBinary)
        }
      });
    } catch (error) {
      logger.error('Error creating transaction:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Update transaction
   * @body { transactionId, transactionDate?, type?, amount?, itemName?, notes?, transactionFunctionId? }
   */
  update: async (req, res) => {
    try {
      const { transactionId, transactionDate, type, amount, itemName, notes, transactionFunctionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Transaction ID required" }
        });
      }

      const [rows] = await db.query(`SELECT id FROM transactions WHERE id = ? AND is_deleted = 0`, [toBinaryUUID(transactionId)]);
      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Transaction not found" }
        });
      }

      const updates = [];
      const params = [];

      if (transactionDate !== undefined) {
        updates.push('transaction_date = ?');
        params.push(transactionDate);
      }
      if (type !== undefined) {
        if (!['INVEST', 'RETURN'].includes(type)) {
          return res.status(400).json({
            responseType: "F",
            responseValue: { message: "Type must be INVEST or RETURN" }
          });
        }
        updates.push('type = ?');
        params.push(type);
      }
      if (amount !== undefined) {
        updates.push('amount = ?');
        params.push(amount);
      }
      if (itemName !== undefined) {
        updates.push('item_name = ?');
        params.push(itemName);
      }
      if (notes !== undefined) {
        updates.push('notes = ?');
        params.push(notes);
      }
      if (transactionFunctionId !== undefined) {
        updates.push('transaction_function_id = ?');
        params.push(transactionFunctionId ? toBinaryUUID(transactionFunctionId) : null);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "No fields to update" }
        });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(toBinaryUUID(transactionId));

      await db.query(`UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`, params);

      return res.status(200).json({
        responseType: "S",
        responseValue: { message: "Transaction updated successfully" }
      });
    } catch (error) {
      logger.error('Error updating transaction:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Delete transaction (soft delete)
   * @body { transactionId }
   */
  delete: async (req, res) => {
    try {
      const { transactionId } = req.body;

      if (!transactionId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Transaction ID required" }
        });
      }

      const [rows] = await db.query(`SELECT id FROM transactions WHERE id = ? AND is_deleted = 0`, [toBinaryUUID(transactionId)]);
      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Transaction not found" }
        });
      }

      const [result] = await db.query(`
        UPDATE transactions 
        SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [toBinaryUUID(transactionId)]);

      if (result.affectedRows > 0) {
        return res.status(200).json({
          responseType: "S",
          responseValue: { message: "Transaction deleted successfully" }
        });
      } else {
        return res.status(500).json({
          responseType: "F",
          responseValue: { message: "Failed to delete transaction" }
        });
      }
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Get transaction statistics
   * @body { type?, startDate?, endDate? }
   */
  stats: async (req, res) => {
    try {
      const { type, startDate, endDate } = req.body;

      let query = `
        SELECT 
          COUNT(*) as totalTransactions,
          SUM(CASE WHEN type = 'INVEST' THEN 1 ELSE 0 END) as investCount,
          SUM(CASE WHEN type = 'RETURN' THEN 1 ELSE 0 END) as returnCount,
          SUM(CASE WHEN type = 'INVEST' THEN amount ELSE 0 END) as totalInvest,
          SUM(CASE WHEN type = 'RETURN' THEN amount ELSE 0 END) as totalReturn,
          SUM(amount) as totalAmount
        FROM transactions
        WHERE is_deleted = 0
      `;
      const params = [];

      if (type && ['INVEST', 'RETURN'].includes(type)) {
        query += ` AND type = ?`;
        params.push(type);
      }

      if (startDate) {
        query += ` AND transaction_date >= ?`;
        params.push(startDate);
      }

      if (endDate) {
        query += ` AND transaction_date <= ?`;
        params.push(endDate);
      }

      const [rows] = await db.query(query, params);
      const stats = rows[0];

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          totalTransactions: stats.totalTransactions || 0,
          investCount: stats.investCount || 0,
          returnCount: stats.returnCount || 0,
          totalInvest: stats.totalInvest || 0,
          totalReturn: stats.totalReturn || 0,
          totalAmount: stats.totalAmount || 0
        }
      });
    } catch (error) {
      logger.error('Error fetching transaction stats:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  }
};
