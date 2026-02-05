import { Platform } from 'react-native';

const getApiUrl = () => {
    // In production, you would check for a release environment variable
    if (!__DEV__) {
        return 'https://api.example.com/api'; // Replace with real Production URL
    }

    // Development Environment
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:4000/api';
    }

    // Replace with your local machine's IP for physical device testing
    return 'http://172.20.104.165:4000/api';
};

export const API_URL = getApiUrl();
