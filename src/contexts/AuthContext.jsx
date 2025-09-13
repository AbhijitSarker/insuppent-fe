// contexts/AuthContext.jsx
import wordpressAuthService from '../api/services/wordpressAuthService';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const WP_LOGIN_URL = import.meta.env.VITE_WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  // Get current URL parameters
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      uid: searchParams.get('uid'),
      token: searchParams.get('token'),
    };
  };

  // Check current authentication status with server
  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await wordpressAuthService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true, user: response.data };
      }
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Verify with WordPress and authenticate
  const authenticateWithWordPress = async (uid, token) => {
    setLoading(true);
    try {
      const response = await wordpressAuthService.verifyToken(uid, token);
      console.log('WordPress auth response:', response);
      
      if (response.success) {
        // Set user data
        setUser(response.data);
        setIsAuthenticated(true);
        
        // Clear URL parameters after successful auth
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // Don't redirect automatically - let the interceptor handle it
        return { success: true, user: response.data };
      }
      
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, message: response.message };
    } catch (error) {
      console.error('WordPress auth error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, message: error.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  // Refresh authentication
  const refreshAuth = async () => {
    try {
      const response = await wordpressAuthService.refreshAuth();
      if (response.success) {
        setUser(response.data.user || response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      logout();
      return { success: false };
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await wordpressAuthService.logout();
    } catch (error) {
      // Always clear local state
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      localStorage.removeItem('adminToken');
      window.location.href = '/auth/login';
    }
  };

  // Redirect to WordPress login
  const redirectToWordPress = () => {
    window.location.href = wordpressAuthService.getLoginUrl();
  };

  // Helper functions
  const isAdmin = () => wordpressAuthService.isAdmin(user);
  const hasRole = (role) => wordpressAuthService.hasRole(user, role);
  const isMember = () => wordpressAuthService.isMember(user);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Initialize authentication
  useEffect(() => {
    const { uid, token } = getUrlParams();
    if (uid && token) {
      authenticateWithWordPress(uid, token);
    }
  }, []);

  // Periodic auth refresh (every 30 minutes)
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        console.log('Refreshing authentication...');
        refreshAuth();
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    hasRole,
    isMember,
    logout,
    refreshAuth,
    redirectToWordPress,
    checkAuthStatus,
    authenticateWithWordPress,
    redirectPath,
    setRedirectPath,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};