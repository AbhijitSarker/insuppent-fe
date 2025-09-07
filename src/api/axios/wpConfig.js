// lib/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for session cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to WordPress login on authentication errors
            const WP_LOGIN_URL = 'https://staging2.insuppent.com/wp-login.php';
            window.location.href = WP_LOGIN_URL;
        }
        return Promise.reject(error);
    }
);

export default api;