import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosOpen, axiosSecure } from '@/api/axios/config';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login admin
  const loginAdmin = async (email, password) => {
    try {
      const response = await axiosOpen.post('/admin/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { admin, token } = response.data.data;
        localStorage.setItem('adminToken', token);
        setAdmin(admin);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // Check admin auth status
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No token');
      }

      const response = await axiosSecure.get('/admin/auth/profile');
      if (response.data.success) {
        setAdmin(response.data.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      setAdmin(null);
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsAuthenticated(false);
    window.location.href = '/admin/login';
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
