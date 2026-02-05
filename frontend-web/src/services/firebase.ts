import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Placeholder config - user needs to replace with their own from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSy_Placeholder_Key",
    authDomain: "package-match.firebaseapp.com",
    projectId: "package-match",
    storageBucket: "package-match.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // Get the token
            // VAPID key is required for web push (User needs to generate this in Firebase Console)
            const token = await getToken(messaging, {
                vapidKey: 'BC_Placeholder_Vapid_Key'
            });
            console.log('FCM Token:', token);
            return token;
        } else {
            console.log('Notification permission denied');
            return null;
        }
    } catch (error) {
        console.error('Error getting permission required', error);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
