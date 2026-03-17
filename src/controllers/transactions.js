const Model = require('../models/transactions');
const PersonModel = require('../models/moiPersons');
const FunctionModel = require('../models/transactionFunctions');
const DefaultModel = require('../models/moiDefaultFunctions');
const User = require('../models/user');
const logger = require('../config/logger');

exports.controller = {
    /**
     * Create a new transaction
     * Body: { userId, personId, transactionFunctionId?, transactionDate, type, itemType, amount?, itemName?, notes? }
     * type: INVEST | RETURN
     * itemType: MONEY | THING
     */
    create: async (req, res) => {
        try {
            const {
                userId,
                personId,
                transactionFunctionId,
                transactionFunctionName,
                transactionDate,
                type,
                itemType,
                amount,
                itemName,
                notes
            } = req.body;

            // Validate required fields
            if (!userId || !personId || !transactionDate || !type || !itemType) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "தேவையான தரவுகள் வழங்கப்படவில்லை." }
                });
            }

            // Validate type
            if (!['INVEST', 'RETURN'].includes(type)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "வகை INVEST அல்லது RETURN ஆக இருக்க வேண்டும்." }
                });
            }

            // Validate itemType
            if (!['MONEY', 'THING'].includes(itemType)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பொருளின் வகை MONEY அல்லது THING ஆக இருக்க வேண்டும்." }
                });
            }

            // For MONEY type, amount is required
            if (itemType === 'MONEY' && (!amount || amount <= 0)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பணத்திற்கான தொகை தேவை." }
                });
            }

            // For THING type, itemName is required
            if (itemType === 'THING' && !itemName) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பொருளுக்கான பெயர் தேவை." }
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

            // Verify person exists and belongs to user
            const person = await PersonModel.readById(personId);
            const personUserId = person.user_id || person.userId;
            if (!person || personUserId !== userId) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "இந்த நபர் கிடைக்கவில்லை அல்லது உங்களுக்கு சொந்தமாக இல்லை." }
                });
            }

            // For INVEST transactions, transactionFunctionId is required (must be linked to an existing function)
            if (type === 'INVEST') {
                if (!transactionFunctionId) {
                    return res.status(400).json({
                        responseType: "F",
                        responseValue: { message: "INVEST வகைக்கு transactionFunctionId தேவை." }
                    });
                }

                const func = await FunctionModel.readById(transactionFunctionId);
                const funcUserId = func && (func.user_id || func.userId);
                if (!func || funcUserId !== userId) {
                    return res.status(404).json({
                        responseType: "F",
                        responseValue: { message: "இந்த நிகழ்வு கிடைக்கவில்லை அல்லது உங்களுக்கு சொந்தமாக இல்லை." }
                    });
                }
            } else {
                // For RETURN transactions, transactionFunctionId is optional. If provided, validate ownership.
                if (transactionFunctionId) {
                    const func = await FunctionModel.readById(transactionFunctionId);
                    const funcUserId = func && (func.user_id || func.userId);
                    if (!func || funcUserId !== userId) {
                        return res.status(404).json({
                            responseType: "F",
                            responseValue: { message: "இந்த நிகழ்வு கிடைக்கவில்லை அல்லது உங்களுக்கு சொந்தமாக இல்லை." }
                        });
                    }
                }
            }

            const payload = {
                userId,
                personId,
                transactionFunctionId: transactionFunctionId || null,
                transactionFunctionName: transactionFunctionName || null,
                transactionDate,
                type,
                itemType,
                amount: amount ?? null,
                itemName: itemType === 'THING' ? itemName : null,
                notes: notes || null
            };

            const result = await Model.create(payload);

            return res.status(201).json({
                responseType: "S",
                responseValue: {
                    message: "வெற்றிகரமாக உருவாக்கப்பட்டது.",
                    transactionId: result.insertId
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
     * Create a new transaction (V2) - Supports both embedded person data and personId
     * Scenario A - With person details: { userId, firstName, secondName?, business?, city?, mobile?, transactionDate, type, amount?, itemName?, notes?, is_custom, transactionFunctionId?, transactionFunctionName?, customFunction? }
     * Scenario B - With personId: { userId, personId, transactionDate, type, amount?, itemName?, notes?, is_custom, transactionFunctionId?, transactionFunctionName?, customFunction? }
     * type: INVEST | RETURN
     */
    createV2: async (req, res) => {
        try {
            const {
                userId,
                personId,
                firstName,
                secondName,
                business,
                city,
                mobile,
                transactionDate,
                type,
                amount,
                itemName,
                notes,
                isCustom,
                is_custom,
                transactionFunctionId,
                transactionFunctionName,
                customFunction
            } = req.body;

            // Normalize is_custom parameter (accept both camelCase and snake_case)
            const finalIsCustom = isCustom !== undefined ? isCustom : (is_custom !== undefined ? is_custom : false);

            // Validate required fields
            if (!userId || !transactionDate || !type) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "userId, transactionDate, type are required." }
                });
            }

            // Validate type
            if (!['INVEST', 'RETURN'].includes(type)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Type must be INVEST or RETURN." }
                });
            }

            // Verify user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "User not found!" }
                });
            }

            let finalPersonId = null;

            // Scenario A: Handle embedded person data
            if (firstName) {
                // Check for duplicate person
                const duplicate = await PersonModel.findDuplicate(userId, firstName, secondName, business, city, mobile);
                if (duplicate) {
                    finalPersonId = duplicate.id || duplicate.mp_id;
                } else {
                    // Create new person
                    const personData = {
                        userId,
                        firstName,
                        secondName: secondName || null,
                        business: business || null,
                        city: city || null,
                        mobile: mobile || null
                    };
                    const personResult = await PersonModel.create(personData);
                    finalPersonId = personResult.insertId;
                }
            } else if (personId) {
                // Scenario B: Use provided personId
                const person = await PersonModel.readById(personId);
                const personUserId = person.user_id || person.userId;
                if (!person || personUserId !== userId) {
                    return res.status(404).json({
                        responseType: "F",
                        responseValue: { message: "Person not found or does not belong to user." }
                    });
                }
                finalPersonId = personId;
            } else {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Either personId or firstName is required." }
                });
            }

            // Validate function (optional but if provided, must be valid)
            // Can be either a default function or a user's transaction function
            let finalFunctionId = null;
            let finalFunctionName = transactionFunctionName || null;
            
            if (transactionFunctionId) {
                // First check if it's a default function
                let func = await DefaultModel.readById(transactionFunctionId);
                
                if (func) {
                    // It's a default function - we can now store the ID as well.
                    finalFunctionId = transactionFunctionId;
                    finalFunctionName = func.name;
                } else {
                    // Check if it's a user's transaction function
                    func = await FunctionModel.readById(transactionFunctionId);
                    const funcUserId = func && (func.user_id || func.userId);
                    if (!func || funcUserId !== userId) {
                        return res.status(404).json({
                            responseType: "F",
                            responseValue: { message: "Transaction function not found or does not belong to user." }
                        });
                    }
                    // It's a user's transaction function - store the ID
                    finalFunctionId = transactionFunctionId;
                    finalFunctionName = func.functionName || transactionFunctionName || null;
                }
            }

            const payload = {
                userId,
                personId: finalPersonId,
                transactionFunctionId: finalFunctionId,
                transactionFunctionName: finalFunctionName,
                transactionDate,
                type,
                amount: amount ?? null,
                itemName: itemName || null,
                notes: notes || null,
                isCustom: finalIsCustom ? 1 : 0,
                customFunction: customFunction || null
            };

            const result = await Model.create(payload);

            // Fetch full transaction details to return
            const transaction = await Model.readById(result.insertId);

            return res.status(201).json({
                responseType: "S",
                responseValue: {
                    message: "Transaction created successfully.",
                    transaction: transaction
                }
            });
        } catch (error) {
            logger.error('Error creating transaction (V2):', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Create multiple transactions (V2 Bulk)
     * Body: { transactions: Array of transaction objects }
     * Each transaction object: { userId, personId?, firstName?, secondName?, business?, city?, mobile?, transactionDate, type, amount?, itemName?, notes?, isCustom?, transactionFunctionId?, transactionFunctionName?, customFunction? }
     */
    createV2Bulk: async (req, res) => {
        try {
            const { transactions } = req.body;

            if (!Array.isArray(transactions) || transactions.length === 0) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "transactions must be a non-empty array." }
                });
            }

            const results = [];
            const errors = [];

            for (let i = 0; i < transactions.length; i++) {
                const transactionData = transactions[i];
                try {
                    const {
                        userId,
                        personId,
                        firstName,
                        secondName,
                        business,
                        city,
                        mobile,
                        transactionDate,
                        type,
                        amount,
                        itemName,
                        notes,
                        isCustom,
                        is_custom,
                        transactionFunctionId,
                        transactionFunctionName,
                        customFunction
                    } = transactionData;

                    // Normalize is_custom parameter (accept both camelCase and snake_case)
                    const finalIsCustom = isCustom !== undefined ? isCustom : (is_custom !== undefined ? is_custom : false);

                    // Validate required fields
                    if (!userId || !transactionDate || !type) {
                        errors.push({ index: i, error: "userId, transactionDate, type are required." });
                        continue;
                    }

                    // Validate type
                    if (!['INVEST', 'RETURN'].includes(type)) {
                        errors.push({ index: i, error: "Type must be INVEST or RETURN." });
                        continue;
                    }

                    // Verify user exists
                    const user = await User.findById(userId);
                    if (!user) {
                        errors.push({ index: i, error: "User not found!" });
                        continue;
                    }

                    let finalPersonId = null;

                    // Scenario A: Handle embedded person data
                    if (firstName) {
                        // Check for duplicate person
                        const duplicate = await PersonModel.findDuplicate(userId, firstName, secondName, business, city, mobile);
                        if (duplicate) {
                            finalPersonId = duplicate.id || duplicate.mp_id;
                        } else {
                            // Create new person
                            const personData = {
                                userId,
                                firstName,
                                secondName: secondName || null,
                                business: business || null,
                                city: city || null,
                                mobile: mobile || null
                            };
                            const personResult = await PersonModel.create(personData);
                            finalPersonId = personResult.insertId;
                        }
                    } else if (personId) {
                        // Scenario B: Use provided personId
                        const person = await PersonModel.readById(personId);
                        const personUserId = person.user_id || person.userId;
                        if (!person || personUserId !== userId) {
                            errors.push({ index: i, error: "Person not found or does not belong to user." });
                            continue;
                        }
                        finalPersonId = personId;
                    } else {
                        errors.push({ index: i, error: "Either personId or firstName is required." });
                        continue;
                    }

                    // Validate function (optional but if provided, must be valid)
                    let finalFunctionId = null;
                    let finalFunctionName = transactionFunctionName || null;

                    if (transactionFunctionId) {
                        // First check if it's a default function
                        let func = await DefaultModel.readById(transactionFunctionId);
                        
                        if (func) {
                            // It's a default function - we can now store the ID as well.
                            finalFunctionId = transactionFunctionId;
                            finalFunctionName = func.name;
                        } else {
                            // Check if it's a user's transaction function
                            func = await FunctionModel.readById(transactionFunctionId);
                            const funcUserId = func && (func.user_id || func.userId);
                            if (!func || funcUserId !== userId) {
                                errors.push({ index: i, error: "Transaction function not found or does not belong to user." });
                                continue;
                            }
                            // It's a user's transaction function - store the ID
                            finalFunctionId = transactionFunctionId;
                            finalFunctionName = func.functionName || transactionFunctionName || null;
                        }
                    }

                    const payload = {
                        userId,
                        personId: finalPersonId,
                        transactionFunctionId: finalFunctionId,
                        transactionFunctionName: finalFunctionName,
                        transactionDate,
                        type,
                        amount: amount ?? null,
                        itemName: itemName || null,
                        notes: notes || null,
                        isCustom: finalIsCustom ? 1 : 0,
                        customFunction: customFunction || null
                    };

                    const result = await Model.create(payload);

                    // Fetch full transaction details to return
                    const transaction = await Model.readById(result.insertId);

                    results.push({
                        index: i,
                        transaction: transaction
                    });

                } catch (error) {
                    logger.error(`Error creating transaction at index ${i}:`, error);
                    errors.push({ index: i, error: error.toString() });
                }
            }

            return res.status(201).json({
                responseType: "S",
                responseValue: {
                    message: `Processed ${transactions.length} transactions. Created: ${results.length}, Errors: ${errors.length}`,
                    results: results,
                    errors: errors
                }
            });
        } catch (error) {
            logger.error('Error creating transactions (V2 Bulk):', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all transactions with filters
     * Body: { userId, personId?, transactionFunctionId?, type?, startDate?, endDate?, limit, offset }
     */
    list: async (req, res) => {
        try {
            const {
                userId,
                personId,
                transactionFunctionId,
                type,
                startDate,
                endDate
            } = req.body;

            if (!userId) {
                return res.status(400).json({
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

            const filters = {
                personId: personId || null,
                transactionFunctionId: transactionFunctionId || null,
                type: type || null,
                startDate: startDate || null,
                endDate: endDate || null
            };

            const transactions = await Model.readAll(userId, filters);

            return res.status(200).json({
                responseType: "S",
                count: transactions.length,
                responseValue: transactions
            });
        } catch (error) {
            logger.error('Error fetching transactions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get single transaction details
     * Body: { transactionId }
     */
    detail: async (req, res) => {
        try {
            const { transactionId } = req.body;

            if (!transactionId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பொருள் ID தேவை!" }
                });
            }

            const transaction = await Model.readById(transactionId);

            if (!transaction) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "பொருள் கிடைக்கவில்லை!" }
                });
            }

            return res.status(200).json({
                responseType: "S",
                responseValue: transaction
            });
        } catch (error) {
            logger.error('Error fetching transaction detail:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update transaction
     * Body: { transactionId, transactionDate, type, itemType, amount?, itemName?, notes? }
     */
    update: async (req, res) => {
        try {
            const { userId, transactionId, firstName, secondName, business, city, mobile, 
                    transactionDate, type, amount, itemName, notes, isCustom, is_custom, customFunction,
                    transactionFunctionId, transactionFunctionName } = req.body;

            // Normalize is_custom parameter (accept both camelCase and snake_case)
            const finalIsCustom = isCustom !== undefined ? isCustom : (is_custom !== undefined ? is_custom : 0);

            // Validate required fields
            if (!transactionId || !transactionDate || !type) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Required fields missing: transactionId, transactionDate, type." }
                });
            }

            // Verify transaction exists
            const transaction = await Model.readById(transactionId);
            if (!transaction) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "Transaction not found!" }
                });
            }

            // Validate type
            if (!['INVEST', 'RETURN'].includes(type)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Type must be INVEST or RETURN." }
                });
            }

            // Update person info if provided (optional)
            if (firstName && userId) {
                const personToUpdate = await PersonModel.readById(transaction.personId);
                if (personToUpdate && personToUpdate.userId === userId) {
                    const personPayload = {
                        id: transaction.personId,
                        firstName,
                        secondName: secondName || null,
                        business: business || null,
                        city: city || null,
                        mobile: mobile || null
                    };
                    await PersonModel.update(personPayload);
                }
            }

            // Determine final function id/name similar to createV2
            let finalFunctionId = null;
            let finalFunctionName = transactionFunctionName || null;
            if (transactionFunctionId) {
                let func = await DefaultModel.readById(transactionFunctionId);
                if (func) {
                    finalFunctionId = transactionFunctionId;
                    finalFunctionName = func.name;
                } else {
                    func = await FunctionModel.readById(transactionFunctionId);
                    const funcUserId = func && (func.user_id || func.userId);
                    if (!func || funcUserId !== (await User.findById(userId))?.id) {
                        return res.status(404).json({
                            responseType: "F",
                            responseValue: { message: "Transaction function not found or does not belong to user." }
                        });
                    }
                    finalFunctionId = transactionFunctionId;
                    finalFunctionName = func.functionName || transactionFunctionName || null;
                }
            }

            const payload = {
                transactionDate,
                type,
                amount: amount ?? null,
                itemName: itemName || null,
                notes: notes || null,
                transactionFunctionId: finalFunctionId,
                transactionFunctionName: finalFunctionName,
                isCustom: finalIsCustom ? 1 : 0,
                customFunction: customFunction || null
            };

            const success = await Model.update(transactionId, payload);

            if (success) {
                // Fetch full transaction details to return
                const updatedTransaction = await Model.readById(transactionId);
                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: "Transaction updated successfully.",
                        transaction: updatedTransaction
                    }
                });
            } else {
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: "Failed to update transaction!" }
                });
            }
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
     * Body: { transactionId }
     */
    delete: async (req, res) => {
        try {
            const { transactionId } = req.body;

            if (!transactionId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பொருள் ID தேவை!" }
                });
            }

            // Verify transaction exists
            const transaction = await Model.readById(transactionId);
            if (!transaction) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "பொருள் கிடைக்கவில்லை!" }
                });
            }

            const success = await Model.delete(transactionId);

            if (success) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "பொருள் வெற்றிகரமாக நீக்கப்பட்டது." }
                });
            } else {
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: "பொருள் நீக்குதல் தோல்வியடைந்தது!" }
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
     * Body: { userId, personId?, transactionFunctionId?, startDate?, endDate? }
     */
    getStats: async (req, res) => {
        try {
            const { userId, personId, transactionFunctionId, startDate, endDate } = req.body;

            if (!userId) {
                return res.status(400).json({
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

            const filters = {
                personId: personId || null,
                transactionFunctionId: transactionFunctionId || null,
                startDate: startDate || null,
                endDate: endDate || null
            };

            const stats = await Model.getStats(userId, filters);

            return res.status(200).json({
                responseType: "S",
                responseValue: stats
            });
        } catch (error) {
            logger.error('Error fetching transaction stats:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all transactions for a specific person
     * Body: { userId, personId, limit?, offset? }
     */
    getByPerson: async (req, res) => {
        try {
            const { userId, personId, limit = 50, offset = 0 } = req.body;

            if (!userId || !personId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பயனர் ID மற்றும் நபர் ID தேவை!" }
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

            // Verify person exists and belongs to user
            const person = await PersonModel.readById(personId);
            const personUserId = person.user_id || person.userId;
            if (!person || personUserId !== userId) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "விரும்பிய நபர் கிடைக்கவில்லை!" }
                });
            }

            const transactions = await Model.getByPerson(userId, personId, limit, offset);

            return res.status(200).json({
                responseType: "S",
                count: transactions.length,
                responseValue: transactions
            });
        } catch (error) {
            logger.error('Error fetching person transactions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Admin: get all transactions across users
     * Body: { search?, userId?, personId?, transactionFunctionId?, type?, startDate?, endDate? }
     */
    adminList: async (req, res) => {
        try {
            const {
                search,
                userId,
                personId,
                transactionFunctionId,
                type,
                startDate,
                endDate
            } = req.body;

            const filters = {
                search: search ? String(search).trim() : null,
                userId: userId ? String(userId).trim() : null,
                personId: personId ? String(personId).trim() : null,
                transactionFunctionId: transactionFunctionId ? String(transactionFunctionId).trim() : null,
                type: type || null,
                startDate: startDate || null,
                endDate: endDate || null
            };

            const transactions = await Model.readAllForAdmin(filters);

            return res.status(200).json({
                responseType: "S",
                count: transactions.length,
                responseValue: transactions
            });
        } catch (error) {
            logger.error('Error fetching admin transactions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },
};
