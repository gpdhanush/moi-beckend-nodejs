const admin = require('firebase-admin');
const Notification = require('../models/notificationModels');

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
    /**
     * Send push notification via FCM and save notification to database
     * Body: { userId, title, body, token }
     */
    sendNotification: async (req, res) => {
        const { userId, title, body, token } = req.body;
        
        // Validate required fields
        if (!token || !title || !body) {
            return res.status(400).json({ 
                responseType: "F", 
                responseValue: { message: 'Token, title, and body are required.' } 
            });
        }

        if (!userId) {
            return res.status(400).json({ 
                responseType: "F", 
                responseValue: { message: 'User ID is required.' } 
            });
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: token, // Target device FCM token
        };

        try {
            // Send notification via FCM
            await admin.messaging().send(message);
            
            // If FCM send is successful, save notification to database
            try {
                await Notification.create({
                    userId: userId,
                    title: title,
                    body: body
                });
            } catch (dbError) {
                // Log database error but don't fail the request since FCM send was successful
                console.error('Error saving notification to database:', dbError);
                // Continue - notification was sent successfully
            }

            return res.status(200).json({ 
                responseType: "S", 
                responseValue: { message: 'Notification sent successfully' } 
            });
        } catch (error) {
            // FCM send failed, don't save to database
            console.error('FCM send error:', error);
            
            // Handle FCM-specific errors
            let errorMessage = 'Failed to send notification.';
            let statusCode = 500;

            if (error.code) {
                switch (error.code) {
                    case 'messaging/invalid-registration-token':
                    case 'messaging/registration-token-not-registered':
                        errorMessage = 'Invalid or expired device token. The user may have uninstalled the app or the token is no longer valid.';
                        statusCode = 400;
                        break;
                    case 'messaging/invalid-argument':
                        errorMessage = 'Invalid notification data provided.';
                        statusCode = 400;
                        break;
                    case 'messaging/unavailable':
                        errorMessage = 'FCM service is temporarily unavailable. Please try again later.';
                        statusCode = 503;
                        break;
                    case 'messaging/internal-error':
                        errorMessage = 'Internal FCM error occurred. Please try again later.';
                        statusCode = 500;
                        break;
                    default:
                        // Check error message for common patterns
                        if (error.message && error.message.includes('Requested entity was not found')) {
                            errorMessage = 'Invalid or expired device token. The device may have been uninstalled or the token is no longer valid.';
                            statusCode = 400;
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                }
            } else if (error.message) {
                // Handle error messages directly
                if (error.message.includes('Requested entity was not found')) {
                    errorMessage = 'Invalid or expired device token. The device may have been uninstalled or the token is no longer valid.';
                    statusCode = 400;
                } else {
                    errorMessage = error.message;
                }
            }

            return res.status(statusCode).json({ 
                responseType: "F", 
                responseValue: { message: errorMessage } 
            });
        }
    },
}
