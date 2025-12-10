const db = require('../config/database');
const employeeTable = "gp_moi_employee_master";
const permissionTable = "gp_moi_employee_permissions";

const Employee = {
    // Find employee by email
    async findByEmail(email) {
        const [rows] = await db.query(`SELECT * FROM ${employeeTable} WHERE em_email = ?`, [email]);
        return rows[0];
    },

    // Find employee by ID
    async findById(employeeId) {
        const [rows] = await db.query(`SELECT * FROM ${employeeTable} WHERE em_id = ?`, [employeeId]);
        return rows[0];
    },

    // Find employee by mobile
    async findByMobile(mobile) {
        const [rows] = await db.query(`SELECT * FROM ${employeeTable} WHERE em_mobile = ?`, [mobile]);
        return rows[0];
    },

    // Check if mobile number exists (excluding current employee)
    async checkMobileNo(mobile, id) {
        const [rows] = await db.query(`SELECT * FROM ${employeeTable} WHERE em_mobile = ? AND em_id != ?`, [mobile, id]);
        return rows[0];
    },

    // Create new employee
    async create(employeeData) {
        const [result] = await db.query(
            `INSERT INTO ${employeeTable} (em_full_name, em_email, em_mobile, em_password, em_created_by) VALUES (?, ?, ?, ?, ?)`,
            [employeeData.name, employeeData.email, employeeData.mobile, employeeData.password, employeeData.createdBy]
        );
        return result;
    },

    // Get all employees
    async getAll() {
        const [rows] = await db.query(
            `SELECT em_id, em_full_name, em_email, em_mobile, em_status, em_created_by, em_create_dt, em_update_dt 
             FROM ${employeeTable} 
             ORDER BY em_create_dt DESC`
        );
        return rows;
    },

    // Update employee
    async update(employeeData) {
        const [result] = await db.query(
            `UPDATE ${employeeTable} SET em_full_name = ?, em_mobile = ?, em_email = ? WHERE em_id = ?`,
            [employeeData.name, employeeData.mobile, employeeData.email, employeeData.id]
        );
        return result;
    },

    // Update employee status
    async updateStatus(employeeId, status) {
        const [result] = await db.query(
            `UPDATE ${employeeTable} SET em_status = ? WHERE em_id = ?`,
            [status, employeeId]
        );
        return result;
    },

    // Delete employee (soft delete by setting status to 'N')
    async delete(employeeId) {
        const [result] = await db.query(
            `UPDATE ${employeeTable} SET em_status = 'N' WHERE em_id = ?`,
            [employeeId]
        );
        return result;
    },

    // ========== PERMISSION METHODS ==========

    // Assign permission to employee
    async assignPermission(permissionData) {
        const [result] = await db.query(
            `INSERT INTO ${permissionTable} (ep_em_id, ep_function_id, ep_permission_type, ep_assigned_by) VALUES (?, ?, ?, ?)`,
            [permissionData.employeeId, permissionData.functionId || null, permissionData.permissionType, permissionData.assignedBy]
        );
        return result;
    },

    // Cancel permission (set status to 'N')
    async cancelPermission(permissionId, cancelledBy) {
        const [result] = await db.query(
            `UPDATE ${permissionTable} SET ep_status = 'N', ep_cancelled_dt = NOW(), ep_cancelled_by = ? WHERE ep_id = ?`,
            [cancelledBy, permissionId]
        );
        return result;
    },

    // Get all permissions for an employee
    async getEmployeePermissions(employeeId) {
        const [rows] = await db.query(
            `SELECT ep.*, 
                    mf.function_name, mf.function_date,
                    admin.um_full_name as assigned_by_name
             FROM ${permissionTable} ep
             LEFT JOIN gp_moi_functions mf ON ep.ep_function_id = mf.f_id
             LEFT JOIN gp_moi_user_master admin ON ep.ep_assigned_by = admin.um_id
             WHERE ep.ep_em_id = ? AND ep.ep_status = 'Y'
             ORDER BY ep.ep_assigned_dt DESC`,
            [employeeId]
        );
        return rows;
    },

    // Get all permissions (for admin view)
    async getAllPermissions() {
        const [rows] = await db.query(
            `SELECT ep.*, 
                    e.em_full_name as employee_name, e.em_email as employee_email,
                    mf.function_name, mf.function_date,
                    admin.um_full_name as assigned_by_name
             FROM ${permissionTable} ep
             LEFT JOIN ${employeeTable} e ON ep.ep_em_id = e.em_id
             LEFT JOIN gp_moi_functions mf ON ep.ep_function_id = mf.f_id
             LEFT JOIN gp_moi_user_master admin ON ep.ep_assigned_by = admin.um_id
             WHERE ep.ep_status = 'Y'
             ORDER BY ep.ep_assigned_dt DESC`
        );
        return rows;
    },

    // Check if employee has permission for a specific function
    async hasPermission(employeeId, functionId, permissionType) {
        let query;
        let params;
        
        if (functionId === null || functionId === undefined) {
            // Check for permissions with NULL function_id (all functions permission)
            query = `SELECT * FROM ${permissionTable} 
                     WHERE ep_em_id = ? 
                     AND ep_status = 'Y' 
                     AND ep_permission_type = ?
                     AND ep_function_id IS NULL`;
            params = [employeeId, permissionType];
        } else {
            // Check for permissions with specific function_id OR NULL function_id (all functions)
            query = `SELECT * FROM ${permissionTable} 
                     WHERE ep_em_id = ? 
                     AND ep_status = 'Y' 
                     AND ep_permission_type = ?
                     AND (ep_function_id = ? OR ep_function_id IS NULL)`;
            params = [employeeId, permissionType, functionId];
        }
        
        const [rows] = await db.query(query, params);
        return rows.length > 0;
    },

    // Get permission by ID
    async getPermissionById(permissionId) {
        const [rows] = await db.query(`SELECT * FROM ${permissionTable} WHERE ep_id = ?`, [permissionId]);
        return rows[0];
    },
}

module.exports = Employee;
