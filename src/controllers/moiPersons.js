const Model = require('../models/moiPersons');
const User = require('../models/user');

exports.controller = {
    list: async (req, res) => {
        const { userId, search } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            const persons = await Model.readAll(userId, search);

            if (persons.length === 0) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } 
                });
            }

            const transformed = persons.map(p => ({
                id: p.mp_id,
                firstName: p.mp_first_name,
                secondName: p.mp_second_name,
                business: p.mp_business,
                city: p.mp_city,
                mobile: p.mp_mobile
            }));

            return res.status(200).json({ 
                responseType: "S", 
                count: transformed.length,
                responseValue: transformed 
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    create: async (req, res) => {
        try {
            const { userId, firstName, secondName, business, city, mobile } = req.body;

            if (!userId || !firstName) {
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

            // Check if person with same mobile already exists
            if (mobile) {
                const existing = await Model.findByMobile(userId, mobile);
                if (existing) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { 
                            message: "இந்த மொபைல் எண்ணுடன் ஒரு நபர் ஏற்கனவே உள்ளது.",
                            personId: existing.mp_id
                        } 
                    });
                }
            }

            // Check for duplicate person (same firstName, secondName, business, city, mobile)
            const duplicate = await Model.findDuplicate(userId, firstName, secondName, business, city, mobile);
            if (duplicate) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { 
                        message: "இந்த விவரங்களுடன் ஒரு நபர் ஏற்கனவே உள்ளது.",
                        personId: duplicate.mp_id
                    } 
                });
            }

            const data = {
                userId,
                firstName,
                secondName,
                business,
                city,
                mobile
            };

            const result = await Model.create(data);
            if (result && result.insertId) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { 
                        message: "நபர் வெற்றிகரமாக சேர்க்கப்பட்டது.",
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

    update: async (req, res) => {
        try {
            const { userId, id, firstName, secondName, business, city, mobile } = req.body;

            if (!userId || !id || !firstName) {
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
                    responseValue: { message: "குறிப்பிடப்பட்ட நபர் இல்லை!" } 
                });
            }

            // Check if mobile is being changed and if it conflicts with another person
            if (mobile && mobile !== existing.mp_mobile) {
                const conflict = await Model.findByMobile(userId, mobile);
                if (conflict && conflict.mp_id !== id) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: "இந்த மொபைல் எண் ஏற்கனவே பயன்படுத்தப்படுகிறது." } 
                    });
                }
            }

            const data = {
                id,
                firstName,
                secondName,
                business,
                city,
                mobile
            };

            const result = await Model.update(data);
            if (result) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "நபர் விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } 
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

    delete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const existing = await Model.readById(id);
            
            if (!existing) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'குறிப்பிடப்பட்ட நபர் இல்லை!' } 
                });
            }

            const result = await Model.delete(id);
            if (result && result.affectedRows > 0) {
                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: { message: "நபர் வெற்றிகரமாக நீக்கப்பட்டது." } 
                });
            } else {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "இந்த நபரை நீக்க முடியவில்லை!" } 
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    getById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const person = await Model.readById(id);
            
            if (!person) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'குறிப்பிடப்பட்ட நபர் இல்லை!' } 
                });
            }

            return res.status(200).json({ 
                responseType: "S", 
                responseValue: {
                    id: person.mp_id,
                    userId: person.mp_um_id,
                    firstName: person.mp_first_name,
                    secondName: person.mp_second_name,
                    business: person.mp_business,
                    city: person.mp_city,
                    mobile: person.mp_mobile
                }
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    getPersonDetails: async (req, res) => {
        try {
            const { userId } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } 
                });
            }

            const person = await Model.getPersonDetails(userId);
            
            if (!person) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'நபர் விவரங்கள் கிடைக்கவில்லை.' } 
                });
            }

            return res.status(200).json({ 
                responseType: "S", 
                responseValue: {
                    id: person.mp_id,
                    firstName: person.mp_first_name,
                    secondName: person.mp_second_name,
                    business: person.mp_business,
                    city: person.mp_city,
                    mobile: person.mp_mobile
                }
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    }
}
