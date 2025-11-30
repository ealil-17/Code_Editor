import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const executeCode = async (language, code, input = '') => {
    try {
        const response = await api.post('/code/execute', {
            language,
            code,
            input,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw new Error('Failed to connect to server. Make sure backend is running on port 5000.');
    }
};

export const getLanguages = async () => {
    try {
        const response = await api.get('/languages');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch languages:', error);
        return null;
    }
};

export const getBoilerplate = async (language) => {
    try {
        const response = await api.get(`/code/boilerplate/${language}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch boilerplate:', error);
        return null;
    }
};

export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        return { status: 'error', message: 'Server unreachable' };
    }
};

export default api;
