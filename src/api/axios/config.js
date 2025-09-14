import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

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
  withCredentials: false,
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

// Response interceptor for debugging (optional)
axiosOpen.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Open API Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);