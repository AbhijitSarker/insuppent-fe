// hooks/useAuthGuard.js
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Hook to guard components that require authentication
export const useAuthGuard = (requiredRole = null) => {
    const { user, isAuthenticated, hasRole, loading, redirectToWordPress } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            redirectToWordPress();
            return;
        }

        if (!loading && isAuthenticated && requiredRole && !hasRole(requiredRole)) {
            navigate('/unauthorized');
            return;
        }
    }, [loading, isAuthenticated, hasRole, requiredRole, navigate, redirectToWordPress]);

    return {
        user,
        isAuthenticated,
        loading,
        hasRole,
        isAuthorized: !requiredRole || hasRole(requiredRole)
    };
};

// Hook for admin-only components
export const useAdminGuard = () => {
    const { user, isAuthenticated, isAdmin, loading, redirectToWordPress } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            redirectToWordPress();
            return;
        }

        if (!loading && isAuthenticated && !isAdmin()) {
            navigate('/unauthorized');
            return;
        }
    }, [loading, isAuthenticated, isAdmin, navigate, redirectToWordPress]);

    return {
        user,
        isAuthenticated,
        loading,
        isAdmin: isAdmin(),
        isAuthorized: isAdmin()
    };
};

// Hook for member-only components  
export const useMemberGuard = () => {
    const { user, isAuthenticated, isMember, loading, redirectToWordPress } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            redirectToWordPress();
            return;
        }

        if (!loading && isAuthenticated && !isMember()) {
            // Don't navigate away, just show upgrade prompt
            console.log('User needs membership upgrade');
            return;
        }
    }, [loading, isAuthenticated, isMember, redirectToWordPress]);

    return {
        user,
        isAuthenticated,
        loading,
        isMember: isMember(),
        needsUpgrade: isAuthenticated && !isMember(),
        isAuthorized: isMember()
    };
};