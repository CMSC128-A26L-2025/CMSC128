import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Role-based route component
export const RoleRoute = ({ allowedRoles, children }) => {
    const { user, accessToken } = useAuth();
    const location = useLocation();
  
    if (!user || !accessToken) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  
    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(user.user_type)) {
      // Redirect to home page if role not allowed
      return <Navigate to="/login" replace />;
    }
  
    return children || <Outlet />;
  };