const admin = require('firebase-admin');

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

exports.controller = {
    sendNotification: async (req, res) => {
        const { title, body, token } = req.body;
        if (!token || !title || !body) {
            return res.status(400).json({ responseType: "F", responseValue: { message: 'Token, title, and body are required.' } });
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: token, // Target device token
        };

        try {
            await admin.messaging().send(message);
            return res.status(200).json({ responseType: "S", responseValue: { message: 'Notification sent successfully' } });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
