import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://insuppent-be-dev.onrender.com/api/v1';
const WP_LOGIN_URL = import.meta.env.VITE_WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';

// For public/open requests (no auth required)
export const axiosOpen = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// For authenticated requests (session-based)
export const axiosSecure = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Response interceptor for handling auth errors
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't try to refresh on auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes('/auth/')) {
        console.error('Auth endpoint failed, redirecting to WordPress login');
        window.location.href = WP_LOGIN_URL;
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh auth...');
        // Try to refresh the session
        await axiosOpen.post('/auth/refresh', {}, { withCredentials: true });
        console.log('Auth refresh successful, retrying original request');
        // Retry the original request
        return axiosSecure(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to WordPress login
        console.error('Token refresh failed:', refreshError);
        window.location.href = WP_LOGIN_URL;
        return Promise.reject(refreshError);
      }
    }

    // Handle other 401 errors or if retry failed
    if (error.response?.status === 401) {
      console.error('Authentication required, redirecting to WordPress login');
      window.location.href = WP_LOGIN_URL;
    }

    return Promise.reject(error);
  }
);

// Add request interceptor for debugging (optional)
axiosSecure.interceptors.request.use(
  (config) => {
    // Add any additional headers or auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging (optional)
axiosOpen.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Open API Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Add response interceptor for axiosSecure for debugging
axiosSecure.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't log 401 errors as they're handled above
    if (error.response?.status !== 401) {
      console.error('Secure API Response error:', error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);