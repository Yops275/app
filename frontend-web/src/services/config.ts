const getApiUrl = () => {
    // Check if running in a Vite environment with env vars
    if (import.meta.env && import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Default to localhost for development
    return 'http://localhost:4000/api';
};

export const API_URL = getApiUrl();
