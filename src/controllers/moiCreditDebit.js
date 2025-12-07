const Model = require('../models/moiCreditDebit');
const PersonModel = require('../models/moiPersons');
const User = require('../models/user');
const moment = require('moment');

exports.controller = {
    // Get dashboard with summary and list
    dashboard: async (req, res) => {
        const { userId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            // Get person details (for header)
            const personDetails = await PersonModel.getPersonDetails(userId);

            // Get all transactions
            const transactions = await Model.readAll(userId);

            // Get summary
            const summaryData = await Model.getSummary(userId);
            const memberCount = await Model.getMemberCount(userId);

            // Calculate totals
            let moiReturn = 0;
            let moiInvest = 0;

            summaryData.forEach(item => {
                if (item.mcd_type === 'RETURN') {
                    moiReturn = parseFloat(item.total_amount) || 0;
                } else if (item.mcd_type === 'INVEST') {
                    moiInvest = parseFloat(item.total_amount) || 0;
                }
            });

            const total = moiInvest - moiReturn;

            // Transform transactions
            const transformTransactions = transactions.map((t, index) => ({
                id: t.mcd_id,
                index: index + 1,
                date: moment(t.mcd_date).format('DD/MM/YYYY'),
                functionName: t.function_name,
                type: t.mcd_type,
                mode: t.mcd_mode,
                amount: parseFloat(t.mcd_amount) || 0,
                remarks: t.mcd_remarks,
                person: {
                    id: t.mcd_person_id,
                    firstName: t.mp_first_name,
                    secondName: t.mp_second_name,
                    parentName: t.mp_parent_name,
                    business: t.mp_business,
                    city: t.mp_city,
                    mobile: t.mp_mobile
                }
            }));

            return res.status(200).json({
                responseType: "S",
                responseValue: {
                    personDetails: personDetails ? {
                        id: personDetails.mp_id,
                        firstName: personDetails.mp_first_name,
                        secondName: personDetails.mp_second_name,
                        parentName: personDetails.mp_parent_name,
                        business: personDetails.mp_business,
                        city: personDetails.mp_city,
                        mobile: personDetails.mp_mobile
                    } : null,
                    summary: {
                        moiReturn: moiReturn,
                        moiInvest: moiInvest,
                        total: total,
                        memberCount: memberCount
                    },
                    transactions: transformTransactions,
                    count: transformTransactions.length
                }
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    // Get list with filters
    list: async (req, res) => {
        const { userId, type, search, date } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            const filters = {};
            if (type) filters.type = type;
            if (search) filters.search = search;
            if (date) filters.date = date;

            const transactions = await Model.readAll(userId, filters);

            if (transactions.length === 0) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } 
                });
            }

            const transformTransactions = transactions.map((t, index) => ({
                id: t.mcd_id,
                index: index + 1,
                date: moment(t.mcd_date).format('DD/MM/YYYY'),
                functionName: t.function_name,
                type: t.mcd_type,
                mode: t.mcd_mode,
                amount: parseFloat(t.mcd_amount) || 0,
                remarks: t.mcd_remarks,
                person: {
                    id: t.mcd_person_id,
                    firstName: t.mp_first_name,
                    secondName: t.mp_second_name,
                    parentName: t.mp_parent_name,
                    business: t.mp_business,
                    city: t.mp_city,
                    mobile: t.mp_mobile
                }
            }));

            return res.status(200).json({ 
                responseType: "S", 
                count: transformTransactions.length,
                responseValue: transformTransactions 
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    // Add Moi Return (Credit)
    addReturn: async (req, res) => {
        try {
            const { userId, personId, functionId, mode, date, amount, remarks } = req.body;

            if (!userId || !personId || !functionId || !mode || !date) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "தேவையான தரவுகள் வழங்கப்படவில்லை." } 
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            const data = {
                userId,
                personId,
                functionId,
                type: 'RETURN',
                mode: mode.toUpperCase(),
                date,
                amount: mode.toUpperCase() === 'MONEY' ? (amount || 0) : 0,
                remarks
            };

            const result = await Model.create(data);
            if (result && result.insertId) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { 
                        message: "மொய் வரவு வெற்றிகரமாக சேர்க்கப்பட்டது.",
                        id: result.insertId
                    } 
                });
            } else {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "தரவு சேமிப்பு தோல்வியடைந்தது." } 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    // Add Moi Invest (Debit)
    addInvest: async (req, res) => {
        try {
            const { userId, personId, functionId, mode, date, amount, remarks } = req.body;

            if (!userId || !personId || !functionId || !mode || !date) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "தேவையான தரவுகள் வழங்கப்படவில்லை." } 
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            const data = {
                userId,
                personId,
                functionId,
                type: 'INVEST',
                mode: mode.toUpperCase(),
                date,
                amount: mode.toUpperCase() === 'MONEY' ? (amount || 0) : 0,
                remarks
            };

            const result = await Model.create(data);
            if (result && result.insertId) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { 
                        message: "மொய் செலவு வெற்றிகரமாக சேர்க்கப்பட்டது.",
                        id: result.insertId
                    } 
                });
            } else {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "தரவு சேமிப்பு தோல்வியடைந்தது." } 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    // Update transaction
    update: async (req, res) => {
        try {
            const { userId, id, personId, functionId, type, mode, date, amount, remarks } = req.body;

            if (!userId || !id) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: "தேவையான தரவுகள் வழங்கப்படவில்லை." } 
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            const existing = await Model.readById(id);
            if (!existing) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பதிவு இல்லை!" } 
                });
            }

            const data = {
                id,
                personId: personId || existing.mcd_person_id,
                functionId: functionId || existing.mcd_function_id,
                type: type || existing.mcd_type,
                mode: mode ? mode.toUpperCase() : existing.mcd_mode,
                date: date || existing.mcd_date,
                amount: mode && mode.toUpperCase() === 'MONEY' ? (amount || 0) : (existing.mcd_mode === 'MONEY' ? (amount || existing.mcd_amount) : 0),
                remarks: remarks !== undefined ? remarks : existing.mcd_remarks
            };

            const result = await Model.update(data);
            if (result) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "தரவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } 
                });
            } else {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "தரவு புதுப்பித்தல் தோல்வியடைந்தது." } 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    // Delete transaction
    delete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const existing = await Model.readById(id);
            
            if (!existing) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'குறிப்பிடப்பட்ட பதிவு இல்லை!' } 
                });
            }

            const result = await Model.delete(id);
            if (result) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "பதிவு வெற்றிகரமாக நீக்கப்பட்டது." } 
                });
            } else {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "இந்த பதிவை நீக்க முடியவில்லை!" } 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    // Get single transaction by ID
    getById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const transaction = await Model.readById(id);
            
            if (!transaction) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'குறிப்பிடப்பட்ட பதிவு இல்லை!' } 
                });
            }

            const transformed = {
                id: transaction.mcd_id,
                userId: transaction.mcd_um_id,
                personId: transaction.mcd_person_id,
                functionId: transaction.mcd_function_id,
                type: transaction.mcd_type,
                mode: transaction.mcd_mode,
                date: moment(transaction.mcd_date).format('YYYY-MM-DD'),
                amount: parseFloat(transaction.mcd_amount) || 0,
                remarks: transaction.mcd_remarks,
                person: {
                    id: transaction.mcd_person_id,
                    firstName: transaction.mp_first_name,
                    secondName: transaction.mp_second_name,
                    parentName: transaction.mp_parent_name,
                    business: transaction.mp_business,
                    city: transaction.mp_city,
                    mobile: transaction.mp_mobile
                },
                functionName: transaction.function_name
            };

            return res.status(200).json({ 
                responseType: "S", 
                responseValue: transformed 
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    }
}
