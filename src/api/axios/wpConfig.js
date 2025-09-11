// lib/api.js
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const WP_LOGIN_URL = import.meta.env.WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';
const api = axios.create({
    baseURL: VITE_API_URL,
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
            window.location.href = WP_LOGIN_URL;
        }
        return Promise.reject(error);
    }
);

export default api;