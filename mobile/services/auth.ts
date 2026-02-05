import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Platform } from 'react-native';
import { API_URL } from './config';


const TOKEN_KEY = 'auth_token';

export const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = response.data;
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            return user;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    },

    getToken: async () => {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    }
};

