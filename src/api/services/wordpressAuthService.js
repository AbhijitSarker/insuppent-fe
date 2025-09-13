// services/wordpressAuthService.js
import { axiosOpen, axiosSecure } from '../axios/config';

class WordPressAuthService {
    // Verify WordPress token
    async verifyToken(uid, token) {
        try {
            const response = await axiosOpen.get(`/auth/verify?uid=${uid}&token=${token}`, {
                withCredentials: true
            });
            console.log('WordPress verify response:', response.data);
            return response.data;
        } catch (error) {
            console.error('WordPress verify error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || error.message
            };
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            const response = await axiosSecure.get('/auth/me', { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Get current user error:', error.response?.data || error.message);
            return { 
                success: false, 
                message: error.response?.data?.message || error.message 
            };
        }
    }

    // Refresh authentication
    async refreshAuth() {
        try {
            const response = await axiosSecure.post('/auth/refresh', {}, { withCredentials: true });
            console.log('Refresh response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Refresh error:', error.response?.data || error.message);
            return { 
                success: false, 
                message: error.response?.data?.message || error.message,
                error: error.response?.data 
            };
        }
    }

    // Logout - uses the main auth context logout
    async logout() {
        try {
            const response = await axiosSecure.post('/auth/logout', {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            window.location.href = '/auth/login';
            return { success: false, message: error.message };
        }
    }

    // Check if user has specific role
    hasRole(user, role) {
        if (!user || !user.role) return false;
        const roles = Array.isArray(user.role) ? user.role : [user.role];
        return roles.includes(role);
    }

    // Check if user is admin
    isAdmin(user) {
        return this.hasRole(user, 'administrator') || this.hasRole(user, 'bbp_keymaster');
    }

    // Check if user is member (not just subscriber)
    isMember(user) {
        return user?.membership && user.membership !== 'Subscriber';
    }

    // Get WordPress login URL
    getLoginUrl() {
        return import.meta.env.VITE_WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';
    }
}

export default new WordPressAuthService();