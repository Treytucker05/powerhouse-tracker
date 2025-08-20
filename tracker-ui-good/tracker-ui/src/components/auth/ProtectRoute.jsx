import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

// Simple inline fallback (avoid circular imports)
function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] text-gray-400">
            Loading...
        </div>
    );
}

export function ProtectRoute({ children }) {
    const { user, loading } = useApp();
    const loc = useLocation();
    const isLoading = !!loading && (loading.user === true); // loading is an object in context

    if (isLoading) return <LoadingScreen />;
    if (!user) {
        return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
    }
    return children;
}
