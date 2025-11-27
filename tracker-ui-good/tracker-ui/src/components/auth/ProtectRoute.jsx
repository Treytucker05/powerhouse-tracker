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

    // Dev-only E2E bypass to avoid redirect races before context hydrates
    let devBypass = false;
    try {
        devBypass = !!import.meta.env?.DEV && typeof window !== 'undefined' && window.localStorage.getItem('ph.e2e.user') === '1';
    } catch { /* no-op */ }

    if (isLoading && !devBypass) return <LoadingScreen />;
    if (!user && !devBypass) {
        return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
    }
    return children;
}
