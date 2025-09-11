// contexts/AuthContext.jsx
import { axiosOpen, axiosSecure } from '@/api/axios/config';
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

  // Check if user is authenticated by checking the authStatus cookie
  const checkAuthStatusFromCookie = () => {
    return document.cookie.includes('authStatus=true');
  };

  // Check current authentication status with server
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // First check if we have the auth status cookie
      if (!checkAuthStatusFromCookie()) {
        console.log('No auth status cookie found');
        setUser(null);
        setIsAuthenticated(false);
        return { success: false };
      }

      const response = await axiosOpen.get('/auth/check', { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        return { success: true, user: response.data.data };
      }

      console.log('Auth check failed:', response.data);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Verify with WordPress and authenticate
  const authenticateWithWordPress = async (uid, token) => {
    try {
      setLoading(true);
      const response = await axiosOpen.get(`/auth/verify?uid=${uid}&token=${token}`);

      if (response.data.success) {
        const userData = response.data.data;

        // Set user data in state
        setUser(userData);
        setIsAuthenticated(true);

        // Clear URL parameters after successful auth
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        // Check role and redirect
        const roles = Array.isArray(userData.role) ? userData.role : [userData.role];
        const isAdminUser = roles.includes('administrator') || roles.includes('bbp_keymaster');

        // Only redirect if not already authenticated
        if (!checkAuthStatusFromCookie()) {
          window.location.href = '/';
        }

        return { success: true, user: userData };
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
    setLoading(true);
    try {
      const response = await axiosSecure.post('/auth/logout', {}, { withCredentials: true });
      if (response.data.success) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      // Clear any local storage if you're using it
      localStorage.removeItem('adminToken');
      
      // Force reload and redirect to ensure clean state
      window.location.href = '/auth/login';
    }
  };

  // Redirect to WordPress login
  const redirectToWordPress = () => {
    window.location.href = WP_LOGIN_URL;
  };

  // Helper functions
  const isAdmin = () => {
    // If role is a string, convert it to array
    const roles = Array.isArray(user?.role) ? user?.role : [user?.role];
    const result = roles.includes('administrator') || roles.includes('bbp_keymaster');

    console.log('isAdmin result:', result);
    return result;
  };

  const hasRole = (role) => {
    return user?.role?.includes(role) || false;
  };

  const isMember = () => {
    return user?.membership && user.membership !== 'Subscriber';
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (checkAuthStatusFromCookie()) {
          const response = await axiosOpen.get('/auth/check');
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const { uid, token } = getUrlParams();

        // If we have uid and token in URL, authenticate with WordPress
        if (uid && token) {
          console.log('Authenticating with WordPress...', { uid, token: token.substring(0, 10) + '...' });
          const result = await authenticateWithWordPress(uid, token);
          if (!result.success) {
            console.error('WordPress authentication failed:', result.message);
            setLoading(false);
            window.location.href = '/auth/login';
            return;
          }
        }
        
        // Check auth status if we're not on auth routes
        if (!window.location.pathname.startsWith('/auth/')) {
          console.log('Checking existing auth status...');
          const authStatus = await checkAuthStatus();
          
          // Only redirect if we're not loading and auth failed
          if (!authStatus.success) {
            console.log('Auth check failed, redirecting to login');
            window.location.href = '/auth/login';
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Removed location.search dependency as it's not defined

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