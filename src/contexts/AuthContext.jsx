// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/api/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check authentication status from session
        const authStatus = await authService.checkAuth();

        if (authStatus.isAuthenticated && authStatus.user) {
          setUser(authStatus.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for focus events to refresh auth status
    const handleFocus = () => {
      if (!loading) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const login = async () => {
    // For SSO, redirect to WordPress login
    authService.ssoLogin();
    return Promise.resolve();
  };

  const signup = async () => {
    // For SSO, redirect to WordPress (same as login)
    authService.ssoLogin();
    return Promise.resolve();
  };

  const logout = async () => {
    try {
      await authService.logout();
      // authService.logout() redirects, but in case it doesn't:
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Force local logout even if backend fails
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/auth/login';
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success && response.data) {
        setUser(response.data);
      }
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Refresh user data (useful after SSO callback)
  const refreshUser = async () => {
    try {
      const authStatus = await authService.checkAuth();
      if (authStatus.isAuthenticated && authStatus.user) {
        setUser(authStatus.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('User refresh error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Helper functions
  const hasRole = (role) => {
    return authService.hasRole(user, role);
  };

  const isAdmin = () => {
    return authService.isAdmin(user);
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.username || user.email;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
    hasRole,
    isAdmin,
    getUserDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};