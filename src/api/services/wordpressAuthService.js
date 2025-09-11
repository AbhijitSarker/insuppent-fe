// services/wordpressAuthService.js
import { axiosOpen, axiosSecure } from '../axios/config';

class WordPressAuthService {
    // Verify WordPress token
    async verifyToken(uid, token) {
        try {
            const response = await axiosOpen.get(`/auth/verify?uid=${uid}&token=${token}`);
            return response.data;
            console.log('WordPress verification response:', response.data);
        } catch (error) {
            console.error('WordPress verification error:', error);
            throw error;
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            const response = await axiosSecure.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    }

    // Refresh authentication
    async refreshAuth() {
        try {
            const response = await axiosSecure.post('/auth/refresh');
            return response.data;
        } catch (error) {
            console.error('Refresh auth error:', error);
            throw error;
        }
    }

    // Logout - uses the main auth context logout
    async logout() {
        try {
            const response = await axiosSecure.post('/auth/logout', {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            // Always clear cookies on the client side even if server request fails
            window.location.href = '/auth/login';
            throw error;
        }
    }

    // Check if user has specific role
    hasRole(user, role) {
        return user?.role?.includes(role) || false;
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