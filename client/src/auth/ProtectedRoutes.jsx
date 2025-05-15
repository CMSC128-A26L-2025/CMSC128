import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

export const RoleRoute = ({ allowedRoles, children }) => {
    const { user, accessToken, logout, isLoading} = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (accessToken && user && user.user_type && !allowedRoles.includes(user.user_type)) {
            logout();
        }
    }, [user, accessToken, allowedRoles, logout, location]);

    // TODO: Add loading screen
    if (isLoading) {
        return <div> Loading... </div>;
    }

    // navigate to login if not authenticated
    if (!accessToken || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // conditionally render route
    if (user.user_type && allowedRoles.includes(user.user_type)) {
        return children || <Outlet />;
    }

    // navigate to login if user type not authorized
    return <Navigate to="/login" state={{ from: location }} replace />;
};