const Model = require('../models/upcomingFunction');
const User = require('../models/user');
const moment = require('moment');
const logger = require('../config/logger');

// Valid status enum values
const VALID_STATUSES = ['ACTIVE', 'CANCELLED', 'COMPLETED'];

/**
 * Parse and convert date to YYYY-MM-DD format for MySQL
 * Accepts: DD-MMM-YYYY, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY
 * Returns: YYYY-MM-DD or throws error
 */
const parseDateToMySQL = (dateString) => {
    if (!dateString) return null;
    
    // Try different date formats
    const formats = ['DD-MMM-YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'DD-MM-YYYY'];
    
    let parsedDate = null;
    for (const format of formats) {
        const date = moment(dateString, format, true);
        if (date.isValid()) {
            parsedDate = date;
            break;
        }
    }
    
    if (!parsedDate || !parsedDate.isValid()) {
        throw new Error(`Invalid date format: '${dateString}'. Expected: DD-MMM-YYYY, DD-MM-YYYY, or YYYY-MM-DD`);
    }
    
    // Return in MySQL format (YYYY-MM-DD)
    return parsedDate.format('YYYY-MM-DD');
};

exports.controller = {
    /**
     * List all upcoming functions for authenticated user
     * Uses userId from JWT token (req.user.userId)
     */
    list: async (req, res) => {
        try {
            // Get userId from authenticated token
            const userId = req.user?.userId || req.body.userId;
            
            if (!userId) {
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: "Authentication required!" } 
                });
            }

            // Verify user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            // Fetch all functions for user
            const result = await Model.readAll(userId);
            
            // Transform to camelCase response
            const transformKeys = result.map(row => ({
                id: row.id,
                userId: row.user_id,
                title: row.title,
                description: row.description,
                functionDate: moment(row.function_date).local().format('DD-MMM-YYYY'),
                location: row.location,
                invitationUrl: row.invitation_url,
                status: row.status,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }));

            return res.status(200).json({ 
                responseType: "S", 
                count: transformKeys.length, 
                responseValue: transformKeys 
            });
        } catch (error) {
            logger.error('Error listing upcoming functions:', error);
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },
    
    /**
     * Create new upcoming function
     * Uses userId from JWT token (req.user.userId)
     */
    create: async (req, res) => {
        try {
            // Get userId from authenticated token
            const userId = req.user?.userId || req.body.userId;
            
            if (!userId) {
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: "பயனர் ID தேவை!" } 
                });
            }

            // Verify user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            // Validate required fields
            const title = req.body.title || req.body.functionName;
            const rawDate = req.body.functionDate || req.body.date;
            const location = req.body.location || req.body.place;

            if (!title || !rawDate || !location) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: "தலைப்பு, தேதி மற்றும் இடம் அவசியம்!" 
                    } 
                });
            }

            // Parse and validate date format
            let functionDate;
            try {
                functionDate = parseDateToMySQL(rawDate);
            } catch (dateError) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: dateError.message 
                    } 
                });
            }

            // Prepare payload
            const payload = {
                userId,
                title,
                description: req.body.description || null,
                functionDate,
                location,
                invitationUrl: req.body.invitationUrl || req.body.invitation_url || null
            };

            // Create function
            const query = await Model.create(payload);
            
            if (query) {
                return res.status(201).json({ 
                    responseType: "S", 
                    responseValue: { 
                        message: "உங்கள் தரவு வெற்றிகரமாக சேமிக்கப்பட்டது.",
                        id: query.insertId 
                    } 
                });
            } else {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: "தரவு சேமிப்பு தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." 
                    } 
                });
            }
        } catch (error) {
            logger.error('Error creating upcoming function:', error);
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },
    
    /**
     * Update existing upcoming function
     * User can only update their own functions
     */
    update: async (req, res) => {
        try {
            // Get userId from authenticated token
            const userId = req.user?.userId || req.body.userId;
            const functionId = req.body.id;

            if (!functionId) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "செயல்பாட்டு ID அவசியம்!" } 
                });
            }

            // Check if function exists
            const existingFunction = await Model.readById(functionId);
            if (!existingFunction) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பதிவுகள் இல்லை!" } 
                });
            }

            // Verify ownership (user can only update their own functions)
            if (existingFunction.user_id !== userId) {
                return res.status(403).json({ 
                    responseType: "F", 
                    responseValue: { message: "இந்த செயல்பாட்டை புதுப்பிக்க உங்களுக்கு அனுமதி இல்லை!" } 
                });
            }

            // Parse date if provided, otherwise keep existing
            let functionDate = existingFunction.function_date;
            if (req.body.functionDate || req.body.date) {
                try {
                    functionDate = parseDateToMySQL(req.body.functionDate || req.body.date);
                } catch (dateError) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { 
                            message: dateError.message 
                        } 
                    });
                }
            }

            // Prepare update payload
            const payload = {
                id: functionId,
                title: req.body.title || req.body.functionName || existingFunction.title,
                description: req.body.description !== undefined ? req.body.description : existingFunction.description,
                functionDate,
                location: req.body.location || req.body.place || existingFunction.location,
                invitationUrl: req.body.invitationUrl || req.body.invitation_url || existingFunction.invitation_url
            };

            // Update function
            const query = await Model.update(payload);
            
            if (query && query.affectedRows > 0) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "உங்கள் தரவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } 
                });
            } else {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: "தரவு புதுப்பித்தல் தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." 
                    } 
                });
            }
        } catch (error) {
            logger.error('Error updating upcoming function:', error);
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },
    
    /**
     * Delete (soft delete) upcoming function
     * User can only delete their own functions
     */
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const userId = req.user?.userId || req.body.userId;

            if (!id) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "செயல்பாட்டு ID அவசியம்!" } 
                });
            }

            // Check if function exists
            const existingFunction = await Model.readById(id);
            if (!existingFunction) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'குறிப்பிடப்பட்ட பதிவுகள் இல்லை!' } 
                });
            }

            // Verify ownership (user can only delete their own functions)
            if (existingFunction.user_id !== userId) {
                return res.status(403).json({ 
                    responseType: "F", 
                    responseValue: { message: "இந்த செயல்பாட்டை நீக்க உங்களுக்கு அனுமதி இல்லை!" } 
                });
            }

            // Soft delete
            const del = await Model.delete(id);
            
            if (del && del.affectedRows > 0) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "பொருள் வெற்றிகரமாக நீக்கப்பட்டது." } 
                });
            } else {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "இந்த பதிவுகளை நீக்க முடியவில்லை!" } 
                });
            }
        } catch (error) {
            logger.error('Error deleting upcoming function:', error);
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },
    
    /**
     * Update status of upcoming function
     * Allowed statuses: ACTIVE, CANCELLED, COMPLETED
     * User can only update their own functions
     */
    updateStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            const userId = req.user?.userId || req.body.userId;
            
            if (!id) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "செயல்பாட்டு ID அவசியம்!" } 
                });
            }

            if (!status) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "நிலை அவசியம்!" } 
                });
            }

            // Validate status enum
            const upperStatus = status.toString().toUpperCase();
            if (!VALID_STATUSES.includes(upperStatus)) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: `தவறான நிலை! அனுமதிக்கப்பட்ட மதிப்புகள்: ${VALID_STATUSES.join(', ')}` 
                    } 
                });
            }

            // Check if function exists
            const existingFunction = await Model.readById(id);
            if (!existingFunction) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பதிவுகள் இல்லை!" } 
                });
            }

            // Verify ownership (user can only update their own functions)
            if (existingFunction.user_id !== userId) {
                return res.status(403).json({ 
                    responseType: "F", 
                    responseValue: { message: "இந்த செயல்பாட்டை புதுப்பிக்க உங்களுக்கு அனுமதி இல்லை!" } 
                });
            }

            // Update status
            const query = await Model.updateStatus(id, upperStatus);
            
            if (query && query.affectedRows > 0) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } 
                });
            } else {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: "நிலை புதுப்பித்தல் தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." 
                    } 
                });
            }
        } catch (error) {
            logger.error('Error updating function status:', error);
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    }
}
