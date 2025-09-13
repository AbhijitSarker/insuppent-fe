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

// WordPress request interceptor - add withCredentials for non-admin routes
axiosSecure.interceptors.request.use(
  (config) => {
    if (!config.url?.startsWith('/admin/')) {
      config.withCredentials = true;
    }
    // For admin routes, add admin token
    if (config.url?.startsWith('/admin/')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers['Authorization'] = `Bearer ${adminToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// WordPress response interceptor - handles session auth and debugging
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.config?.url?.startsWith('/admin/')) {
      return Promise.reject(error);
    }

    const currentPath = window.location.pathname;
    const isAuthPath = currentPath.startsWith('/auth/') || currentPath === '/';

    // Don't attempt refresh for /auth/verify endpoint
    if (error.config?.url?.includes('/auth/verify')) {
      return Promise.reject(error);
    }

    // // Only try to refresh if it's a 401 and we haven't tried yet
    // if (error.response?.status === 401 && !error.config?._retry) {
    //   error.config._retry = true;
    //   try {
    //     // First try to refresh the token
    //     console.log('Attempting token refresh...');
    //     const refreshResponse = await axiosOpen.post('/auth/refresh', {}, { withCredentials: true });
        
    //     if (refreshResponse.data.success) {
    //       console.log('Token refresh successful');
    //       // Retry the original request
    //       return axiosSecure(error.config);
    //     }
    //   } catch (refreshError) {
    //     console.log('Token refresh failed:', refreshError.response?.data);
    //     // Only redirect to WP login if:
    //     // 1. Refresh fails
    //     // 2. We're not on an auth page
    //     // 3. The original request wasn't a refresh attempt
    //     if (!isAuthPath && !error.config.url.includes('/auth/refresh')) {
    //       window.location.href = WP_LOGIN_URL;
    //     }
    //   }
    // }

    // Log errors
    if (error.response?.status !== 401 || isAuthPath) {
      console.error('API Response error:', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// Response interceptor for debugging (optional)
axiosOpen.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Open API Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);