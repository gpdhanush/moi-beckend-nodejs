const Model = require('../models/moiCreditDebit');
const PersonModel = require('../models/moiPersons');
const User = require('../models/user');
const moment = require('moment');

exports.controller = {
    // Get dashboard with summary and list
    dashboard: async (req, res) => {
        const { userId, personId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            // If personId is provided, return person details with their transactions
            if (personId) {
                const person = await PersonModel.readById(personId);
                if (!person || person.mp_um_id !== userId) {
                    return res.status(404).json({ 
                        responseType: "F", 
                        responseValue: { message: "குறிப்பிடப்பட்ட நபர் இல்லை!" } 
                    });
                }

                // Get person's transactions
                const transactions = await Model.readByPersonId(userId, personId);
                
                // Get person's summary
                const personSummary = await Model.getPersonSummary(userId, personId);
                const moiReturn = parseFloat(personSummary.moi_return) || 0;
                const moiInvest = parseFloat(personSummary.moi_invest) || 0;
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
                    remarks: t.mcd_remarks
                }));

                return res.status(200).json({
                    responseType: "S",
                    responseValue: [{
                        personDetails: {
                            id: person.mp_id,
                            firstName: person.mp_first_name,
                            secondName: person.mp_second_name,
                            business: person.mp_business,
                            city: person.mp_city,
                            mobile: person.mp_mobile
                        },
                        summary: {
                            moiReturn: moiReturn,
                            moiInvest: moiInvest,
                            total: total
                        },
                        transactions: transformTransactions,
                        count: transformTransactions.length
                    }]
                });
            }

            // If no personId, return list of all persons with their summaries and transactions
            // Optimize: Fetch all data in parallel with minimal queries
            // Get ALL persons (not just those with transactions) and all transactions
            const [allPersons, allTransactions] = await Promise.all([
                PersonModel.readAll(userId), // Get all persons
                Model.readAll(userId) // Get all transactions in one query
            ]);

            // Get overall summary
            const summaryData = await Model.getSummary(userId);
            const memberCount = await Model.getMemberCount(userId);

            // Calculate overall totals
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

            // Group transactions by personId and calculate summaries
            const transactionsByPerson = {};
            const summariesByPerson = {};

            allTransactions.forEach(t => {
                const personId = t.mcd_person_id;
                if (!transactionsByPerson[personId]) {
                    transactionsByPerson[personId] = [];
                    summariesByPerson[personId] = { moiReturn: 0, moiInvest: 0 };
                }
                transactionsByPerson[personId].push(t);
                
                // Calculate summary for this person
                if (t.mcd_type === 'RETURN' && t.mcd_mode === 'MONEY') {
                    summariesByPerson[personId].moiReturn += parseFloat(t.mcd_amount) || 0;
                } else if (t.mcd_type === 'INVEST' && t.mcd_mode === 'MONEY') {
                    summariesByPerson[personId].moiInvest += parseFloat(t.mcd_amount) || 0;
                }
            });

            // Transform all persons with their summaries and transactions
            const personsList = allPersons.map((p, index) => {
                const personSummary = summariesByPerson[p.mp_id] || { moiReturn: 0, moiInvest: 0 };
                const personMoiReturn = personSummary.moiReturn;
                const personMoiInvest = personSummary.moiInvest;
                const personTotal = personMoiInvest - personMoiReturn;
                
                // Get transactions for this person from grouped data
                const personTransactions = (transactionsByPerson[p.mp_id] || []).sort((a, b) => {
                    // Sort by date descending, then by id descending
                    const dateA = new Date(a.mcd_date);
                    const dateB = new Date(b.mcd_date);
                    if (dateB.getTime() !== dateA.getTime()) {
                        return dateB.getTime() - dateA.getTime();
                    }
                    return b.mcd_id - a.mcd_id;
                });
                const transformTransactions = personTransactions.map((t, tIndex) => ({
                    id: t.mcd_id,
                    index: tIndex + 1,
                    date: moment(t.mcd_date).format('DD/MM/YYYY'),
                    functionName: t.function_name,
                    type: t.mcd_type,
                    mode: t.mcd_mode,
                    amount: parseFloat(t.mcd_amount) || 0,
                    remarks: t.mcd_remarks
                }));
                
                return {
                    personDetails: {
                        id: p.mp_id,
                        firstName: p.mp_first_name,
                        secondName: p.mp_second_name,
                        business: p.mp_business,
                        city: p.mp_city,
                        mobile: p.mp_mobile
                    },
                    summary: {
                        moiReturn: personMoiReturn,
                        moiInvest: personMoiInvest,
                        total: personTotal
                    },
                    transactions: transformTransactions,
                    count: transformTransactions.length
                };
            });

            return res.status(200).json({
                responseType: "S",
                responseValue: {
                    summary: {
                        moiReturn: moiReturn,
                        moiInvest: moiInvest,
                        total: total,
                        memberCount: memberCount
                    },
                    persons: personsList,
                    count: personsList.length
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
