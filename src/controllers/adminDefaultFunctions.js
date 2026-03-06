const db = require('../config/database');
const { toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const logger = require('../config/logger');

exports.controller = {
  /**
   * List all global default functions with optional search
   * @body { search?, limit?, offset? }
   */
  list: async (req, res) => {
    try {
      const { search, limit = 100, offset = 0 } = req.body;

      let query = `
        SELECT id, name, created_at, updated_at
        FROM default_functions
        WHERE is_deleted = 0
      `;
      const params = [];

      if (search) {
        query += ` AND name LIKE ?`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY name ASC LIMIT ? OFFSET ?`;
      params.push(Math.min(parseInt(limit), 500), parseInt(offset));

      logger.info('Fetching default functions with query:', query);
      const [rows] = await db.query(query, params);
      logger.info('Default functions list result count:', rows.length);

      return res.status(200).json({
        responseType: 'S',
        count: rows.length,
        responseValue: rows.map(r => ({
          id: fromBinaryUUID(r.id),
          name: r.name,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }))
      });
    } catch (error) {
      logger.error('Error fetching admin default functions:', error);
      return res.status(500).json({
        responseType: 'F',
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Get details for a default function
   * @body { functionId }
   */
  detail: async (req, res) => {
    try {
      const { functionId } = req.body;
      if (!functionId) {
        return res.status(400).json({
          responseType: 'F',
          responseValue: { message: 'Function ID required' }
        });
      }

      const [rows] = await db.query(
        `SELECT id, name, created_at, updated_at
         FROM default_functions
         WHERE id = ? AND is_deleted = 0`,
        [toBinaryUUID(functionId)]
      );

      if (!rows[0]) {
        return res.status(404).json({
          responseType: 'F',
          responseValue: { message: 'Default function not found' }
        });
      }

      const r = rows[0];
      return res.status(200).json({
        responseType: 'S',
        responseValue: {
          id: fromBinaryUUID(r.id),
          name: r.name,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }
      });
    } catch (error) {
      logger.error('Error fetching admin default function detail:', error);
      return res.status(500).json({
        responseType: 'F',
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Create new default function
   * @body { name }
   */
  create: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          responseType: 'F',
          responseValue: { message: 'Name is required' }
        });
      }

      // use model helper to generate UUID and insert correctly
      const Model = require('../models/moiDefaultFunctions');
      const result = await Model.create(name);

      return res.status(201).json({
        responseType: 'S',
        responseValue: {
          message: 'Default function created successfully',
          functionId: result.insertId
        }
      });
    } catch (error) {
      logger.error('Error creating admin default function:', error);
      return res.status(500).json({
        responseType: 'F',
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Update default function name
   * @body { functionId, name }
   */
  update: async (req, res) => {
    try {
      const { functionId, name } = req.body;
      if (!functionId) {
        return res.status(400).json({
          responseType: 'F',
          responseValue: { message: 'Function ID required' }
        });
      }

      const [rows] = await db.query(
        `SELECT id FROM default_functions WHERE id = ? AND is_deleted = 0`,
        [toBinaryUUID(functionId)]
      );
      if (!rows[0]) {
        return res.status(404).json({
          responseType: 'F',
          responseValue: { message: 'Default function not found' }
        });
      }

      if (name !== undefined) {
        await db.query(
          `UPDATE default_functions SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [name, toBinaryUUID(functionId)]
        );
      }

      return res.status(200).json({
        responseType: 'S',
        responseValue: { message: 'Default function updated successfully' }
      });
    } catch (error) {
      logger.error('Error updating admin default function:', error);
      return res.status(500).json({
        responseType: 'F',
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Delete (soft) a default function
   * @body { functionId }
   */
  delete: async (req, res) => {
    try {
      const { functionId } = req.body;
      if (!functionId) {
        return res.status(400).json({
          responseType: 'F',
          responseValue: { message: 'Function ID required' }
        });
      }

      const [rows] = await db.query(
        `SELECT id FROM default_functions WHERE id = ? AND is_deleted = 0`,
        [toBinaryUUID(functionId)]
      );
      if (!rows[0]) {
        return res.status(404).json({
          responseType: 'F',
          responseValue: { message: 'Default function not found' }
        });
      }

      const [result] = await db.query(
        `UPDATE default_functions SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [toBinaryUUID(functionId)]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({
          responseType: 'S',
          responseValue: { message: 'Default function deleted successfully' }
        });
      } else {
        return res.status(500).json({
          responseType: 'F',
          responseValue: { message: 'Failed to delete default function' }
        });
      }
    } catch (error) {
      logger.error('Error deleting admin default function:', error);
      return res.status(500).json({
        responseType: 'F',
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Dropdown list (id + name)
   * @body { limit?, offset? }
   */
  dropdown: async (req, res) => {
    try {
      const { limit = 500, offset = 0 } = req.body;
      const [rows] = await db.query(
        `SELECT id, name FROM default_functions WHERE is_deleted = 0 ORDER BY name ASC LIMIT ? OFFSET ?`,
        [Math.min(parseInt(limit), 500), parseInt(offset)]
      );
      return res.status(200).json({
        responseType: 'S',
        responseValue: rows.map(r => ({ id: fromBinaryUUID(r.id), name: r.name }))
      });
    } catch (error) {
      logger.error('Error fetching admin default functions dropdown:', error);
      return res.status(500).json({
        responseType: 'F',
        responseValue: { message: error.toString() }
      });
    }
  }
};
