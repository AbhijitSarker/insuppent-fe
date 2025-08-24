import { axiosOpen, axiosSecure } from '../axios/config';

export const authService = {
  // SSO Login - redirects to WordPress OAuth
  ssoLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/login`;
  },

  checkAuth: async () => {
    try {
      console.log('🔍 Checking authentication status...');
      console.log('API URL:', import.meta.env.VITE_API_URL);
      console.log('Current cookies:', document.cookie);

      const response = await axiosOpen.get('/auth/check', {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('✅ Auth check response:', response.data);
      console.log('Response headers:', response.headers);

      if (response.data.debug) {
        console.log('🐛 Debug info:', response.data.debug);
      }

      return response.data;

    } catch (error) {
      console.error('❌ Auth check error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          withCredentials: error.config?.withCredentials
        }
      });

      return {
        success: false,
        isAuthenticated: false,
        user: null,
        error: error.message
      };
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