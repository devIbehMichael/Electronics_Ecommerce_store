import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly) {
        // Check role - using app_metadata.role as per requirements
        const isAdmin = user?.app_metadata?.role === 'admin';
        if (!isAdmin) {
            return <Navigate to="/" />;
        }
    }

    return children;
};

export default ProtectedRoute;
