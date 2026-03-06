const db = require('../config/database');
const { toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const logger = require('../config/logger');

exports.controller = {
  /**
   * List all persons across all users with user details
   * @body { search?, limit?, offset? }
   */
  list: async (req, res) => {
    try {
      const { search, limit = 100, offset = 0 } = req.body;
      
      let query = `
        SELECT p.id, p.user_id, p.first_name, p.last_name, p.mobile, p.city, p.occupation,
               u.full_name as user_name, u.email as user_email,
               p.created_at, p.updated_at
        FROM persons p
        LEFT JOIN users u ON p.user_id = u.id
      `;
      const params = [];

      const conditions = [];
      if (search) {
        conditions.push(`(p.first_name LIKE ? OR p.last_name LIKE ? OR p.mobile LIKE ? OR p.city LIKE ? OR u.full_name LIKE ?)`);
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY p.first_name ASC, p.last_name ASC LIMIT ? OFFSET ?`;
      params.push(Math.min(parseInt(limit), 500), parseInt(offset));

      console.log('[adminPersons] query:', query.replace(/\n/g, ' ').substring(0, 300));
      console.log('[adminPersons] params:', params);
      const [rows] = await db.query(query, params);
      console.log('[adminPersons] result count:', rows.length, 'rows');

      return res.status(200).json({
        responseType: "S",
        count: rows.length,
        responseValue: rows.map(r => ({
          id: fromBinaryUUID(r.id),
          userId: fromBinaryUUID(r.user_id),
          userName: r.user_name || 'Unknown',
          userEmail: r.user_email || 'N/A',
          firstName: r.first_name,
          lastName: r.last_name,
          mobile: r.mobile,
          city: r.city,
          occupation: r.occupation,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }))
      });
    } catch (error) {
      logger.error('Error fetching admin persons list:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Get person details by ID
   * @body { personId }
   */
  detail: async (req, res) => {
    try {
      const personId = req.body?.personId || req.params?.id;

      if (!personId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Person ID required" }
        });
      }

      const binaryId = toBinaryUUID(personId);
      logger.info('Fetching person detail with ID:', personId, 'Binary:', binaryId);

      const [rows] = await db.query(`
        SELECT p.id, p.user_id, p.first_name, p.last_name, p.mobile, p.city, p.occupation,
               u.full_name as user_name, u.email as user_email,
               p.created_at, p.updated_at
        FROM persons p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `, [binaryId]);

      if (!rows || rows.length === 0) {
        logger.warn('Person not found for ID:', personId);
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Person not found" }
        });
      }

      const r = rows[0];
      return res.status(200).json({
        responseType: "S",
        responseValue: {
          id: fromBinaryUUID(r.id),
          userId: fromBinaryUUID(r.user_id),
          userName: r.user_name || 'Unknown',
          userEmail: r.user_email || 'N/A',
          firstName: r.first_name,
          lastName: r.last_name,
          mobile: r.mobile,
          city: r.city,
          occupation: r.occupation,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }
      });
    } catch (error) {
      logger.error('Error fetching admin person detail:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Create new person
   * @body { userId, firstName, lastName?, mobile?, city?, occupation? }
   */
  create: async (req, res) => {
    try {
      const { userId, firstName, lastName, mobile, city, occupation } = req.body;

      if (!userId || !firstName) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "userId and firstName are required" }
        });
      }

      const newId = generateUUID();
      const [result] = await db.query(`
        INSERT INTO persons (id, user_id, first_name, last_name, mobile, city, occupation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [toBinaryUUID(newId), toBinaryUUID(userId), firstName, lastName || null, mobile || null, city || null, occupation || null]);

      return res.status(201).json({
        responseType: "S",
        responseValue: {
          message: "Person created successfully",
          personId: newId
        }
      });
    } catch (error) {
      logger.error('Error creating person:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Update person
   * @body { personId, firstName?, lastName?, mobile?, city?, occupation? }
   */
  update: async (req, res) => {
    try {
      const { personId, firstName, lastName, mobile, city, occupation } = req.body;

      if (!personId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Person ID required" }
        });
      }

      const [rows] = await db.query(`SELECT id FROM persons WHERE id = ?`, [toBinaryUUID(personId)]);
      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Person not found" }
        });
      }

      const updates = [];
      const params = [];

      if (firstName !== undefined) {
        updates.push('first_name = ?');
        params.push(firstName);
      }
      if (lastName !== undefined) {
        updates.push('last_name = ?');
        params.push(lastName);
      }
      if (mobile !== undefined) {
        updates.push('mobile = ?');
        params.push(mobile);
      }
      if (city !== undefined) {
        updates.push('city = ?');
        params.push(city);
      }
      if (occupation !== undefined) {
        updates.push('occupation = ?');
        params.push(occupation);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "No fields to update" }
        });
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(toBinaryUUID(personId));

      await db.query(`UPDATE persons SET ${updates.join(', ')} WHERE id = ?`, params);

      return res.status(200).json({
        responseType: "S",
        responseValue: { message: "Person updated successfully" }
      });
    } catch (error) {
      logger.error('Error updating person:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * Delete person
   * @body { personId }
   */
  delete: async (req, res) => {
    try {
      const { personId } = req.body || req.params;

      if (!personId) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Person ID required" }
        });
      }

      const [rows] = await db.query(`SELECT id FROM persons WHERE id = ?`, [toBinaryUUID(personId)]);
      if (!rows[0]) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "Person not found" }
        });
      }

      const [result] = await db.query(`DELETE FROM persons WHERE id = ?`, [toBinaryUUID(personId)]);

      if (result.affectedRows > 0) {
        return res.status(200).json({
          responseType: "S",
          responseValue: { message: "Person deleted successfully" }
        });
      } else {
        return res.status(500).json({
          responseType: "F",
          responseValue: { message: "Failed to delete person" }
        });
      }
    } catch (error) {
      logger.error('Error deleting person:', error);
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
        SELECT id, CONCAT(first_name, ' ', COALESCE(last_name, '')) as name
        FROM persons
        ORDER BY first_name ASC
        LIMIT ? OFFSET ?
      `, [Math.min(parseInt(limit), 1000), parseInt(offset)]);

      return res.status(200).json({
        responseType: "S",
        responseValue: rows.map(r => ({
          id: fromBinaryUUID(r.id),
          name: r.name.trim()
        }))
      });
    } catch (error) {
      logger.error('Error fetching persons dropdown:', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  }
};
