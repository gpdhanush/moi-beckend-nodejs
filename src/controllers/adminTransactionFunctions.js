const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const logger = require('../config/logger');

exports.controller = {
  /**
   * List all transaction functions across all users with user details
   * @body { search?, startDate?, endDate?, limit?, offset? }
   */
  list: async (req, res) => {
    try {
      const { search, startDate, endDate, limit = 100, offset = 0 } = req.body;

      let query = `
        SELECT tf.id, tf.user_id, tf.function_name, tf.function_date, tf.location, tf.notes, tf.image_url,
               u.full_name as user_name, u.email as user_email,
               tf.created_at, tf.updated_at
        FROM transaction_functions tf
        LEFT JOIN users u ON tf.user_id = u.id
        WHERE tf.is_deleted = 0
      `;
      const params = [];

      if (search) {
        query += ` AND (tf.function_name LIKE ? OR tf.location LIKE ? OR u.full_name LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (startDate) {
        query += ` AND tf.function_date >= ?`;
        params.push(startDate);
      }

      if (endDate) {
        query += ` AND tf.function_date <= ?`;
        params.push(endDate);
      }

      query += ` ORDER BY tf.function_date DESC, tf.created_at DESC LIMIT ? OFFSET ?`;
      params.push(Math.min(parseInt(limit), 500), parseInt(offset));

      logger.info('Fetching transaction functions with query:', query);
      const [rows] = await db.query(query, params);
      logger.info('Transaction functions list result count:', rows.length);

      return res.status(200).json({
        responseType: "S",
        count: rows.length,
        responseValue: rows.map(r => ({
          id: fromBinaryUUID(r.id),
          userId: fromBinaryUUID(r.user_id),
          userName: r.user_name,
          userEmail: r.user_email,
          functionName: r.function_name,
          functionDate: r.function_date,
          location: r.location,
          notes: r.notes,
          imageUrl: r.image_url,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }))
      });
    } catch (error) {
      logger.error('Error fetching admin transaction functions:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Get transaction function details
   * @body { functionId }
   */
  detail: async (req, res) => {
    try {
      const { functionId } = req.body;

      if (!functionId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Function ID required" }
        });
      }

      const [rows] = await db.query(`
        SELECT tf.id, tf.user_id, tf.function_name, tf.function_date, tf.location, tf.notes, tf.image_url,
               u.full_name as user_name, u.email as user_email,
               tf.created_at, tf.updated_at
        FROM transaction_functions tf
        LEFT JOIN users u ON tf.user_id = u.id
        WHERE tf.id = ? AND tf.is_deleted = 0
      `, [toBinaryUUID(functionId)]);

      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Transaction function not found" }
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
          functionName: r.function_name,
          functionDate: r.function_date,
          location: r.location,
          notes: r.notes,
          imageUrl: r.image_url,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }
      });
    } catch (error) {
      logger.error('Error fetching admin transaction function detail:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Create transaction function
   * @body { userId, functionName, functionDate?, location?, notes?, imageUrl? }
   */
  create: async (req, res) => {
    try {
      const { userId, functionName, functionDate, location, notes, imageUrl } = req.body;

      if (!userId || !functionName) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "userId and functionName are required" }
        });
      }

      const newId = generateUUID();
      const [result] = await db.query(`
        INSERT INTO transaction_functions (id, user_id, function_name, function_date, location, notes, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [toBinaryUUID(newId), toBinaryUUID(userId), functionName, functionDate || null, location || null, notes || null, imageUrl || null]);

      return res.status(201).json({
        responseType: "S",
        responseValue: {
          message: "Transaction function created successfully",
          functionId: newId
        }
      });
    } catch (error) {
      logger.error('Error creating transaction function:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Update transaction function
   * @body { functionId, functionName?, functionDate?, location?, notes?, imageUrl? }
   */
  update: async (req, res) => {
    try {
      const { functionId, functionName, functionDate, location, notes, imageUrl } = req.body;

      if (!functionId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Function ID required" }
        });
      }

      const [rows] = await db.query(`SELECT id FROM transaction_functions WHERE id = ? AND is_deleted = 0`, [toBinaryUUID(functionId)]);
      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Transaction function not found" }
        });
      }

      const updates = [];
      const params = [];

      if (functionName !== undefined) {
        updates.push('function_name = ?');
        params.push(functionName);
      }
      if (functionDate !== undefined) {
        updates.push('function_date = ?');
        params.push(functionDate);
      }
      if (location !== undefined) {
        updates.push('location = ?');
        params.push(location);
      }
      if (notes !== undefined) {
        updates.push('notes = ?');
        params.push(notes);
      }
      if (imageUrl !== undefined) {
        updates.push('image_url = ?');
        params.push(imageUrl);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "No fields to update" }
        });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(toBinaryUUID(functionId));

      await db.query(`UPDATE transaction_functions SET ${updates.join(', ')} WHERE id = ?`, params);

      return res.status(200).json({
        responseType: "S",
        responseValue: { message: "Transaction function updated successfully" }
      });
    } catch (error) {
      logger.error('Error updating transaction function:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Delete transaction function (soft delete)
   * @body { functionId }
   */
  delete: async (req, res) => {
    try {
      const { functionId } = req.body;

      if (!functionId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Function ID required" }
        });
      }

      const [rows] = await db.query(`SELECT id FROM transaction_functions WHERE id = ? AND is_deleted = 0`, [toBinaryUUID(functionId)]);
      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Transaction function not found" }
        });
      }

      const [result] = await db.query(`
        UPDATE transaction_functions 
        SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [toBinaryUUID(functionId)]);

      if (result.affectedRows > 0) {
        return res.status(200).json({
          responseType: "S",
          responseValue: { message: "Transaction function deleted successfully" }
        });
      } else {
        return res.status(500).json({
          responseType: "F",
          responseValue: { message: "Failed to delete transaction function" }
        });
      }
    } catch (error) {
      logger.error('Error deleting transaction function:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Get dropdown list (id + name)
   * @body { limit?, offset? }
   */
  dropdown: async (req, res) => {
    try {
      const { limit = 500, offset = 0 } = req.body;

      const [rows] = await db.query(`
        SELECT id, function_name as name
        FROM transaction_functions
        WHERE is_deleted = 0
        ORDER BY function_date DESC, function_name ASC
        LIMIT ? OFFSET ?
      `, [Math.min(parseInt(limit), 1000), parseInt(offset)]);

      return res.status(200).json({
        responseType: "S",
        responseValue: rows.map(r => ({
          id: fromBinaryUUID(r.id),
          name: r.name
        }))
      });
    } catch (error) {
      logger.error('Error fetching transaction functions dropdown:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  }
};
