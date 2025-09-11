import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosAdmin } from '@/api/axios/config';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login admin
  const loginAdmin = async (email, password) => {
    try {
      const response = await axiosAdmin.post('/admin/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const token = response.data.data.token;
        if (!token) {
          throw new Error('No token received from server');
        }
        localStorage.setItem('adminToken', token);
        setAdmin(response.data.data.admin);
        setIsAuthenticated(true);
        return { success: true };
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Admin login failed:', error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  };

  // Check admin auth status
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        throw new Error('No token');
      }

      const response = await axiosAdmin.get('/admin/auth/profile');
      if (response.data.success) {
        setAdmin(response.data.data);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      }
      throw new Error('Profile fetch failed');
    } catch (error) {
      console.log('Admin auth check failed:', error.message);
      setAdmin(null);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
      setLoading(false);
      return { success: false };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Attempt to call logout endpoint if it exists
      await axiosAdmin.post('/admin/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('adminToken');
      setAdmin(null);
      setIsAuthenticated(false);
      window.location.href = '/admin/login';
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    admin,
    loading,
    isAuthenticated,
    loginAdmin,
    logout,
    checkAuthStatus,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
