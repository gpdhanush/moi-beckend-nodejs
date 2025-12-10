const Employee = require('../models/employee');

/**
 * Middleware to check if the authenticated user is an employee
 * This should be used after authenticateToken middleware
 */
async function isEmployee(req, res, next) {
    try {
        // Get userId from the authenticated token (set by authenticateToken middleware)
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                responseType: "F",
                responseValue: { message: "அணுகல் மறுக்கப்பட்டது. தயவுசெய்து தொடர உள்நுழையவும்." }
            });
        }

        // Check if user exists in employee table
        const employee = await Employee.findById(userId);

        if (!employee || employee.em_status !== 'Y') {
            return res.status(403).json({
                responseType: "F",
                responseValue: { message: "நீங்கள் பணியாளர் அல்ல. இந்த செயலைச் செய்ய அனுமதி இல்லை." }
            });
        }

        // Employee is valid, attach employee info to request
        req.employee = employee;
        req.employeeId = employee.em_id;
        next();
    } catch (error) {
        console.error('Error in isEmployee middleware:', error);
        return res.status(500).json({
            responseType: "F",
            responseValue: { message: "சர்வர் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்." }
        });
    }
}

/**
 * Middleware to check if employee has specific permission
 */
async function hasEmployeePermission(permissionType) {
    return async (req, res, next) => {
        try {
            const employeeId = req.employeeId || req.user?.userId;
            const functionId = req.body.functionId || req.params.functionId || req.query.functionId || null;

            if (!employeeId) {
                return res.status(401).json({
                    responseType: "F",
                    responseValue: { message: "அணுகல் மறுக்கப்பட்டது." }
                });
            }

            const hasPermission = await Employee.hasPermission(employeeId, functionId, permissionType);

            if (!hasPermission) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: "இந்த செயலைச் செய்ய உங்களுக்கு அனுமதி இல்லை." }
                });
            }

            next();
        } catch (error) {
            console.error('Error in hasEmployeePermission middleware:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: "சர்வர் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்." }
            });
        }
    };
}

module.exports = { isEmployee, hasEmployeePermission };
