import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
// NOTE: In production, you should use a service account file
if (!admin.apps.length) {
    try {
        // Mock initialization for dev if credential not present
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
            console.log('Firebase Admin initialized.');
        } else {
            console.warn('Firebase Admin: GOOGLE_APPLICATION_CREDENTIALS not set. Notifications will be mocked.');
        }
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error);
    }
}

export const sendNotification = async (token: string, title: string, body: string) => {
    if (!admin.apps.length) {
        console.log(`[Mock Notification] To: ${token}, Title: ${title}, Body: ${body}`);
        return true;
    }

    try {
        await admin.messaging().send({
            token,
            notification: {
                title,
                body,
            },
        });
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};
