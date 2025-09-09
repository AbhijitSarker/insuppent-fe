import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://insuppent-be-dev.onrender.com/api/v1';
const WP_LOGIN_URL = import.meta.env.VITE_WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';

// Create axios instances with different configurations
export const axiosOpen = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Dedicated instance for admin routes - no withCredentials
export const axiosAdmin = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // Admin uses JWT, not cookies
});

// For WordPress authenticated requests
export const axiosSecure = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Admin request interceptor - adds JWT token
axiosAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin response interceptor - handles auth errors
axiosAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// WordPress request interceptor - no special handling needed
axiosSecure.interceptors.request.use(
  (config) => {
    // Only add withCredentials for non-admin routes
    if (!config.url?.startsWith('/admin/')) {
      config.withCredentials = true;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// WordPress response interceptor - handles session auth
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Skip WordPress auth for admin routes
    if (error.config?.url?.startsWith('/admin/')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !error.config?._retry) {
      error.config._retry = true;
      try {
        await axiosOpen.post('/auth/refresh');
        return axiosSecure(error.config);
      } catch (refreshError) {
        window.location.href = WP_LOGIN_URL;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Add auth tokens to requests
axiosSecure.interceptors.request.use(
  (config) => {
    // For admin routes, add admin token
    if (config.url?.startsWith('/admin/')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        // Ensure token is properly formatted and not an object
        const token = typeof adminToken === 'string' ? adminToken : JSON.stringify(adminToken);
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
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