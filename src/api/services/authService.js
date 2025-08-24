import { axiosOpen, axiosSecure } from '../axios/config';

export const authService = {
  // SSO Login - redirects to WordPress OAuth
  ssoLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/login`;
  },

  // Check authentication status from session
  checkAuth: async () => {
    try {
      const response = await axiosOpen.get('/auth/check', {
        withCredentials: true // Important for session cookies
      });
      console.log('Auth check response:', response);
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error);
      return { isAuthenticated: false, user: null };
    }
  },

  // Get current user info
  getUser: async () => {
    try {
      const response = await axiosOpen.get('/auth/user', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Logout - destroys session
  logout: async () => {
    try {
      // This will redirect to frontend after logout
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/logout`;
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect to login page even if logout fails
      window.location.href = '/auth/login';
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await axiosOpen.post('/auth/refresh', {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Update profile (if you have this endpoint)
  updateProfile: async (data) => {
    try {
      const response = await axiosOpen.put('/profile', data, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Check if user has specific role
  hasRole: (user, role) => {
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }
    return user.roles.includes(role);
  },

  // Check if user is admin
  isAdmin: (user) => {
    return authService.hasRole(user, 'admin') || authService.hasRole(user, 'administrator');
  }
};