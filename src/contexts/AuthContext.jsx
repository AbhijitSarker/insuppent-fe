// contexts/AuthContext.jsx
import { axiosOpen, axiosSecure } from '@/api/axios/config';
import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

const WP_LOGIN_URL = import.meta.env.VITE_WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Get current URL parameters directly
  const currentLocation = window.location;
  const searchParams = new URLSearchParams(currentLocation.search);

  // Extract URL parameters
  const getUrlParams = () => {
    return {
      uid: searchParams.get('uid'),
      token: searchParams.get('token'),
    };
  };

  // Verify with WordPress and authenticate
  const authenticateWithWordPress = async (uid, token) => {
    try {
      setLoading(true);
      const response = await axiosOpen.get(`/auth/verify?uid=${uid}&token=${token}`);

      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);

        // Clear URL parameters after successful auth
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        return { success: true, user: response.data.data.user };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Authentication failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Check current authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.data.user };
      }
      return { success: false };
    } catch (error) {
      // Not authenticated
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Refresh authentication
  const refreshAuth = async () => {
    try {
      const response = await axiosSecure.post('/auth/refresh');
      if (response.data.success) {
        setUser(response.data.data.user);
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
    try {
      await axiosSecure.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      // Redirect to WordPress login
      window.location.href = WP_LOGIN_URL;
    }
  };

  // Redirect to WordPress login
  const redirectToWordPress = () => {
    window.location.href = WP_LOGIN_URL;
  };

  // Helper functions
  const isAdmin = () => {
    return user?.role?.includes('administrator') || user?.role?.includes('bbp_keymaster') || false;
  };

  const hasRole = (role) => {
    return user?.role?.includes(role) || false;
  };

  const isMember = () => {
    return user?.membership && user.membership !== 'Subscriber';
  };

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      const { uid, token } = getUrlParams();

      // If we have uid and token in URL, authenticate with WordPress
      if (uid && token) {
        console.log('Authenticating with WordPress...', { uid, token: token.substring(0, 10) + '...' });
        const result = await authenticateWithWordPress(uid, token);
        if (!result.success) {
          console.error('WordPress authentication failed:', result.message);
          // Don't redirect immediately, show error or let user try again
          setLoading(false);
        }
      } else {
        // Check if user is already authenticated via session
        console.log('Checking existing auth status...');
        await checkAuthStatus();
      }
    };

    initAuth();
  }, [location.search]);

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