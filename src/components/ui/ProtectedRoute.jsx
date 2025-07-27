import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context';

export default function ProtectedRoute({ children, requiresAssessment = false }) {
    const { user, assessment, loading } = useApp();
    const location = useLocation();

    // Show loading spinner while checking auth state
    if (loading.user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to assessment if required but not completed
    if (requiresAssessment && !assessment) {
        return <Navigate to="/assessment" replace />;
    }

    // Render the protected component
    return children;
}
