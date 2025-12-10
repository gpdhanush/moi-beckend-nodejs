const Employee = require('../models/employee');
const bcrypt = require('bcryptjs');

exports.employeeController = {
    /**
     * Create a new employee (Admin only)
     * Body: { name, email, mobile, password }
     */
    create: async (req, res) => {
        const { name, email, mobile, password } = req.body;
        const createdBy = req.user?.userId; // Admin ID from token

        try {
            // Validate required fields
            if (!name || !email || !mobile || !password) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'அனைத்து புலங்களும் (பெயர், மின்னஞ்சல், மொபைல், கடவுச்சொல்) தேவையானவை!' }
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'தவறான மின்னஞ்சல் வடிவம்.' }
                });
            }

            // Validate mobile number (should be 10 digits)
            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'மொபைல் எண் 10 இலக்கங்களாக இருக்க வேண்டும்.' }
                });
            }

            // Check if email already exists
            const existingEmployeeByEmail = await Employee.findByEmail(email);
            if (existingEmployeeByEmail) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!' }
                });
            }

            // Check if mobile already exists
            const existingEmployeeByMobile = await Employee.findByMobile(mobile);
            if (existingEmployeeByMobile) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!' }
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create employee
            const newEmployee = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobile: mobile.trim(),
                password: hashedPassword,
                createdBy: createdBy
            };

            const result = await Employee.create(newEmployee);

            if (result && result.insertId) {
                // Get created employee data (without password)
                const createdEmployee = await Employee.findById(result.insertId);
                delete createdEmployee.em_password;

                return res.status(201).json({
                    responseType: "S",
                    responseValue: {
                        message: 'பணியாளர் வெற்றிகரமாக உருவாக்கப்பட்டார்.',
                        employee: createdEmployee
                    }
                });
            } else {
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் உருவாக்கம் தோல்வியடைந்தது.' }
                });
            }
        } catch (error) {
            console.error('Error creating employee:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all employees (Admin only)
     */
    getAll: async (req, res) => {
        try {
            const employees = await Employee.getAll();
            return res.status(200).json({
                responseType: "S",
                count: employees.length,
                responseValue: employees
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get employee by ID (Admin and Employee can view)
     */
    getById: async (req, res) => {
        const employeeId = parseInt(req.params.id);

        try {
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை.' }
                });
            }

            // Remove password from response
            delete employee.em_password;

            return res.status(200).json({
                responseType: "S",
                responseValue: employee
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update employee (Admin only)
     * Body: { name, email, mobile }
     */
    update: async (req, res) => {
        const employeeId = parseInt(req.params.id);
        const { name, email, mobile } = req.body;

        try {
            // Check if employee exists
            const existingEmployee = await Employee.findById(employeeId);
            if (!existingEmployee) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை.' }
                });
            }

            // Check if mobile number is unique (excluding current employee)
            if (mobile) {
                const chkMobile = await Employee.checkMobileNo(mobile, employeeId);
                if (chkMobile) {
                    return res.status(400).json({
                        responseType: "F",
                        responseValue: { message: 'இந்த மொபைல் எண் ஏற்கனவே மற்றொரு பணியாளருக்கு பதிவு செய்யப்பட்டுள்ளது.' }
                    });
                }
            }

            // Check if email is unique (excluding current employee)
            if (email) {
                const chkEmail = await Employee.findByEmail(email);
                if (chkEmail && chkEmail.em_id !== employeeId) {
                    return res.status(400).json({
                        responseType: "F",
                        responseValue: { message: 'இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!' }
                    });
                }
            }

            const updateData = {
                id: employeeId,
                name: name || existingEmployee.em_full_name,
                email: email || existingEmployee.em_email,
                mobile: mobile || existingEmployee.em_mobile
            };

            const result = await Employee.update(updateData);

            if (result.affectedRows > 0) {
                const updatedEmployee = await Employee.findById(employeeId);
                delete updatedEmployee.em_password;

                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: 'பணியாளர் தகவல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.',
                        employee: updatedEmployee
                    }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை அல்லது மாற்றங்கள் செய்யப்படவில்லை.' }
                });
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Assign permission to employee (Admin only)
     * Body: { employeeId, functionId (optional), permissionType }
     */
    assignPermission: async (req, res) => {
        const { employeeId, functionId, permissionType } = req.body;
        const assignedBy = req.user?.userId; // Admin ID

        try {
            // Validate required fields
            if (!employeeId || !permissionType) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் ஐடி மற்றும் அனுமதி வகை தேவையானவை.' }
                });
            }

            // Check if employee exists
            const employee = await Employee.findById(employeeId);
            if (!employee || employee.em_status !== 'Y') {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை அல்லது செயலில் இல்லை.' }
                });
            }

            // If functionId is provided, verify function exists
            if (functionId) {
                const db = require('../config/database');
                const [functionRows] = await db.query(
                    `SELECT * FROM gp_moi_functions WHERE f_id = ? AND f_active = 'Y'`,
                    [functionId]
                );
                if (functionRows.length === 0) {
                    return res.status(404).json({
                        responseType: "F",
                        responseValue: { message: 'விழா கிடைக்கவில்லை.' }
                    });
                }
            }

            const permissionData = {
                employeeId: employeeId,
                functionId: functionId || null,
                permissionType: permissionType,
                assignedBy: assignedBy
            };

            const result = await Employee.assignPermission(permissionData);

            if (result && result.insertId) {
                const permission = await Employee.getPermissionById(result.insertId);
                return res.status(201).json({
                    responseType: "S",
                    responseValue: {
                        message: 'அனுமதி வெற்றிகரமாக வழங்கப்பட்டது.',
                        permission: permission
                    }
                });
            } else {
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: 'அனுமதி வழங்குதல் தோல்வியடைந்தது.' }
                });
            }
        } catch (error) {
            console.error('Error assigning permission:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Cancel permission (Admin only)
     * Body: { permissionId }
     */
    cancelPermission: async (req, res) => {
        const { permissionId } = req.body;
        const cancelledBy = req.user?.userId; // Admin ID

        try {
            if (!permissionId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'அனுமதி ஐடி தேவையானது.' }
                });
            }

            // Check if permission exists
            const permission = await Employee.getPermissionById(permissionId);
            if (!permission) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அனுமதி கிடைக்கவில்லை.' }
                });
            }

            if (permission.ep_status === 'N') {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அனுமதி ஏற்கனவே ரத்து செய்யப்பட்டது.' }
                });
            }

            const result = await Employee.cancelPermission(permissionId, cancelledBy);

            if (result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: 'அனுமதி வெற்றிகரமாக ரத்து செய்யப்பட்டது.' }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அனுமதி கிடைக்கவில்லை.' }
                });
            }
        } catch (error) {
            console.error('Error cancelling permission:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get permissions for an employee (Admin and Employee can view)
     */
    getEmployeePermissions: async (req, res) => {
        const employeeId = parseInt(req.params.id);

        try {
            // Check if employee exists
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை.' }
                });
            }

            const permissions = await Employee.getEmployeePermissions(employeeId);
            return res.status(200).json({
                responseType: "S",
                count: permissions.length,
                responseValue: permissions
            });
        } catch (error) {
            console.error('Error fetching employee permissions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all permissions (Admin only)
     */
    getAllPermissions: async (req, res) => {
        try {
            const permissions = await Employee.getAllPermissions();
            return res.status(200).json({
                responseType: "S",
                count: permissions.length,
                responseValue: permissions
            });
        } catch (error) {
            console.error('Error fetching all permissions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update employee status (Admin only)
     * Body: { status } - 'Y' for active, 'N' for inactive
     */
    updateStatus: async (req, res) => {
        const employeeId = parseInt(req.params.id);
        const { status } = req.body;

        try {
            if (!status || !['Y', 'N'].includes(status)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'செல்லுபடியாகும் நிலை தேவையானது (Y அல்லது N).' }
                });
            }

            // Check if employee exists
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை.' }
                });
            }

            const result = await Employee.updateStatus(employeeId, status);

            if (result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: `பணியாளர் நிலை வெற்றிகரமாக ${status === 'Y' ? 'செயல்படுத்தப்பட்டது' : 'முடக்கப்பட்டது'}.`
                    }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'பணியாளர் கிடைக்கவில்லை.' }
                });
            }
        } catch (error) {
            console.error('Error updating employee status:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },
}
