const Model = require('../models/moi');
const User = require('../models/user');
const Employee = require('../models/employee');
const moment = require('moment');
const PersonModel = require('../models/moiPersons');


exports.controller = {
    list: async (req, res) => {
        const { userId } = req.body;
        try {
            // Check if user exists (either regular user or employee)
            const user = await User.findById(userId);
            const employee = user ? null : await Employee.findById(userId);
            
            if (!user && !employee) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }

            const result = await Model.readAll(userId);
            if (result.length === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } });
            }

            const changeKeyNames = (arr) => {
                return arr.map(({
                    // FUNCTION DEATILS
                    mr_function_id: functionId, functionName:functionName, 
                    functionDate: functionDate, f_firstName: f_firstName, f_secondName: f_secondName,
                    f_place: f_place, f_native: f_native, f_invitation: f_invitation,
                    // MOI DETAILS
                    mr_id: id, mr_um_id: userId, mr_city_id: cityName, mr_first_name: firstName, mr_second_name: secondName, 
                    mr_amount: amount, mr_occupation: occupation, mr_remarks: remarks, seimurai, things
                    }) => ({
                    // FUNCTION DEATILS
                        functionId, functionName, functionDate, f_firstName, f_secondName, f_place, f_native, f_invitation,
                    // MOI DETAILS
                        id, userId, cityName, firstName, secondName, amount, occupation, remarks, seimurai, things,
                    }))
                    .map(event => {
                        return {
                            ...event,
                            functionDate: moment(event.functionDate).local().format('DD-MMM-YYYY')  
                        };
                    });
            };
            const transformKeys = changeKeyNames(result);

            return res.status(200).json({ responseType: "S", count: transformKeys.length, responseValue: transformKeys });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    create: async (req, res) => {
        try {
            const { userId, function: functionId } = req.body;
            
            // Check if user exists (either regular user or employee)
            const user = await User.findById(userId);
            const employee = user ? null : await Employee.findById(userId);
            
            if (!user && !employee) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }

            // If it's an employee, check if they have MOI_INSERT permission
            if (employee) {
                const hasPermission = await Employee.hasPermission(userId, functionId || null, 'MOI_INSERT');
                if (!hasPermission) {
                    return res.status(403).json({ 
                        responseType: "F", 
                        responseValue: { message: "மொய் பதிவு உருவாக்க அனுமதி இல்லை. நிர்வாகியைத் தொடர்பு கொள்ளவும்." } 
                    });
                }
            }

            var query = await Model.create(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் தரவு வெற்றிகரமாக சேமிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "தரவு சேமிப்பு தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    update: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }
            const moidata = await Model.readById(req.body.id);
            if (!moidata) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பதிவுகள் இல்லை!" } });
            }

            var query = await Model.update(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் தரவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "தரவு புதுப்பித்தல் தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    delete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const userId = parseInt(req.query.userId || req.body.userId);
            
            // Check if user is an employee - employees cannot delete
            if (userId) {
                const employee = await Employee.findById(userId);
                if (employee && employee.em_status === 'Y') {
                    return res.status(403).json({ 
                        responseType: "F", 
                        responseValue: { message: "பணியாளர்களுக்கு நீக்கும் அனுமதி இல்லை. நிர்வாகியைத் தொடர்பு கொள்ளவும்." } 
                    });
                }
            }

            var already = await Model.readById(id);
            if (!already) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'The specified records does not exist!' } });
            }

            var del = await Model.delete(id);
            if (del && del.affectedRows > 0) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "பொருள் வெற்றிகரமாக நீக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "இந்த பதிவுகளை நீக்க முடியவில்லை!" } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    dashboard: async (req, res) => {
        const { userId } = req.body;
        try {
            // Check if user exists (either regular user or employee)
            const user = await User.findById(userId);
            const employee = user ? null : await Employee.findById(userId);
            
            if (!user && !employee) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }

            const data = await Model.getDashboard(userId);
            
            // Group transactions by person
            // First, create a map of persons from gp_moi_persons
            const personMap = new Map();
            
            // Helper function to create person key for matching
            const createPersonKey = (firstName, secondName, city, mobile) => {
                return `${(firstName || '').toLowerCase().trim()}_${(secondName || '').toLowerCase().trim()}_${(city || '').toLowerCase().trim()}_${(mobile || '').trim()}`;
            };
            
            // Initialize persons from gp_moi_persons
            data.persons.forEach(person => {
                const key = createPersonKey(person.firstName, person.secondName, person.city, person.mobile);
                personMap.set(key, {
                    personDetails: {
                        id: person.id,
                        firstName: person.firstName,
                        secondName: person.secondName || '',
                        business: person.business || '',
                        city: person.city || '',
                        mobile: person.mobile || ''
                    },
                    investTransactions: [],
                    returnTransactions: []
                });
            });

            // Process INVEST transactions - match by person details
            data.investTransactions.forEach((txn) => {
                const personKey = createPersonKey(txn.personFirstName, txn.personSecondName, txn.personCity, '');
                let personEntry = personMap.get(personKey);
                
                // If person doesn't exist in map, create from transaction
                if (!personEntry) {
                    personEntry = {
                        personDetails: {
                            id: null,
                            firstName: txn.personFirstName,
                            secondName: txn.personSecondName || '',
                            business: txn.personBusiness || '',
                            city: txn.personCity || '',
                            mobile: ''
                        },
                        investTransactions: [],
                        returnTransactions: []
                    };
                    personMap.set(personKey, personEntry);
                }

                personEntry.investTransactions.push({
                    id: txn.id,
                    date: moment(txn.functionDate || txn.createDate).format('DD-MMM-YYYY'),
                    functionName: txn.functionName || '',
                    type: 'INVEST',
                    mode: (txn.mode || 'Money').toUpperCase(),
                    amount: parseFloat(txn.amount) || 0,
                    remarks: txn.remarks || null,
                    firstName: txn.functionFirstName || '',
                    secondName: txn.functionSecondName || '',
                    city: txn.functionCity || ''
                });
            });

            // Process RETURN transactions - match by person details
            data.returnTransactions.forEach((txn) => {
                const personKey = createPersonKey(txn.personFirstName, txn.personSecondName, txn.personCity, '');
                let personEntry = personMap.get(personKey);
                
                // If person doesn't exist in map, create from transaction
                if (!personEntry) {
                    personEntry = {
                        personDetails: {
                            id: null,
                            firstName: txn.personFirstName,
                            secondName: txn.personSecondName || '',
                            business: txn.personBusiness || '',
                            city: txn.personCity || '',
                            mobile: ''
                        },
                        investTransactions: [],
                        returnTransactions: []
                    };
                    personMap.set(personKey, personEntry);
                }

                // For RETURN transactions, function owner details might be from user or empty
                // Based on example, they seem to come from the transaction person details or user
                personEntry.returnTransactions.push({
                    id: txn.id,
                    date: moment(txn.functionDate || txn.createDate).format('DD-MMM-YYYY'),
                    functionName: txn.functionName || '',
                    type: 'RETURN',
                    mode: (txn.mode || 'Money').toUpperCase(),
                    amount: parseFloat(txn.amount) || 0,
                    remarks: txn.remarks || null,
                    firstName: txn.personFirstName || '',
                    secondName: txn.personSecondName || '',
                    city: txn.personCity || ''
                });
            });

            // Build response
            let totalMoiReturn = 0;
            let totalMoiInvest = 0;
            const persons = [];

            personMap.forEach((personEntry) => {
                // Calculate person summary
                const personMoiInvest = personEntry.investTransactions.reduce((sum, t) => sum + t.amount, 0);
                const personMoiReturn = personEntry.returnTransactions.reduce((sum, t) => sum + t.amount, 0);
                const personTotal = personMoiReturn - personMoiInvest;

                // Combine and sort transactions by date (newest first), then by id for consistent ordering
                const allTransactions = [...personEntry.investTransactions, ...personEntry.returnTransactions]
                    .sort((a, b) => {
                        const dateA = moment(a.date, 'DD-MMM-YYYY');
                        const dateB = moment(b.date, 'DD-MMM-YYYY');
                        if (dateB.isSame(dateA)) {
                            return b.id - a.id; // If same date, sort by id descending
                        }
                        return dateB - dateA;
                    })
                    .map((txn, idx) => ({
                        ...txn,
                        index: idx + 1
                    }));

                persons.push({
                    personDetails: personEntry.personDetails,
                    summary: {
                        moiReturn: personMoiReturn,
                        moiInvest: personMoiInvest,
                        total: personTotal
                    },
                    transactions: allTransactions,
                    count: allTransactions.length
                });

                totalMoiInvest += personMoiInvest;
                totalMoiReturn += personMoiReturn;
            });

            const response = {
                responseType: "S",
                responseValue: {
                    summary: {
                        moiReturn: totalMoiReturn,
                        moiInvest: totalMoiInvest,
                        total: totalMoiReturn - totalMoiInvest,
                        memberCount: persons.length
                    },
                    persons: persons,
                    count: persons.length
                }
            };

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
