import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosOpen } from '@/api/axios/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Track if we are currently handling a WP redirect
  const [wpRedirectLoading, setWpRedirectLoading] = useState(false);

  // Login with WordPress user credentials
  const loginWithWpCredentials = async (uid, token) => {
    try {
      setLoading(true);
      setWpRedirectLoading(true);

      const response = await axiosOpen.post('/user/auth/verify-wp-user', {
        uid: uid,
        token: token,
      });

      if (response.data.success) {
        const { user: userData, token: jwtToken } = response.data.data;

        // Store token and user data
        localStorage.setItem('userToken', jwtToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }

      throw new Error('Authentication failed');
    } catch (error) {
      console.error('WordPress login failed:', error.message);

      // Clear any existing data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);

      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Authentication failed'
      };
    } finally {
      setLoading(false);
      setWpRedirectLoading(false);
    }
  };

  // Get user profile from backend
  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axiosOpen.get('/user/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const userData = response.data.data;
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData };
      }

      throw new Error('Failed to get profile');
    } catch (error) {
      console.error('Get profile failed:', error.message);

      // If token is invalid, clear everything
      if (error.response?.status === 401) {
        logout();
      }

      return { success: false, error: error.message };
    }
  };

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const userData = localStorage.getItem('userData');

      if (!token || !userData) {
        setLoading(false);
        return { success: false };
      }

      // Parse stored user data
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
      setIsAuthenticated(true);

      // Verify token is still valid by getting fresh profile
      const profileResult = await getUserProfile();
      setLoading(false);

      return profileResult;
    } catch (error) {
      console.error('Auth check failed:', error.message);
      logout();
      setLoading(false);
      return { success: false };
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token to refresh');
      }

      const response = await axiosOpen.post('/api/v1/user/auth/refresh-token', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const { user: userData, token: newToken } = response.data.data;

        localStorage.setItem('userToken', newToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh failed:', error.message);
      logout();
      return { success: false };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);

    // Redirect to login page
    window.location.href = '/auth/login';
  };

  // Handle URL parameters for WordPress redirect
  const handleWpRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('uid');
    const token = urlParams.get('token');

    if (uid && token) {
      setWpRedirectLoading(true);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      // Attempt to authenticate
      const result = await loginWithWpCredentials(uid, token);

      if (result.success) {
        // Redirect to main app
        window.location.href = '/';
      } else {
        // Handle authentication error
        console.error('WordPress authentication failed:', result.error);
        // You might want to show an error message to the user here
      }
      setWpRedirectLoading(false);
    }
  };

  // Check auth status on mount and handle WordPress redirects
  useEffect(() => {
    const initAuth = async () => {
      // First check if this is a WordPress redirect
      const urlParams = new URLSearchParams(window.location.search);
      const uid = urlParams.get('uid');
      const token = urlParams.get('token');

      if (uid && token) {
        setLoading(true);
        setWpRedirectLoading(true);
        await handleWpRedirect();
      } else {
        // Normal auth check
        await checkAuthStatus();
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    loading: loading || wpRedirectLoading,
    isAuthenticated,
    loginWithWpCredentials,
    getUserProfile,
    refreshToken,
    logout,
    checkAuthStatus,
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