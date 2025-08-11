import React, { useEffect, useState, useCallback, memo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/api/supabaseClient';
import TopNav from '../components/navigation/TopNav';

const AppShell = memo(function AppShell() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false by default for better UX
  const navigate = useNavigate();
  const location = useLocation();

  // Memoized auth handlers to prevent re-creation on every render
  const handleAuthStateChange = useCallback((event, session) => {
    setUser(session?.user ?? null);

    // Only redirect to auth if we're not already there and no user
    if (event === 'SIGNED_OUT' && location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.warn('Auth session check failed:', error);
        if (mounted) {
          setUser(null);
        }
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes with the memoized handler
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // Protected routes - redirect to auth if not logged in (only for specific routes)
  useEffect(() => {
    if (!loading && !user) {
      const protectedRoutes = ['/tracking', '/mesocycle', '/microcycle', '/macrocycle'];
      const isProtectedRoute = protectedRoutes.some(route =>
        location.pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        navigate('/auth');
      }
    }
  }, [user, loading, location.pathname, navigate]);

  // Memoized sign out handler
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/');
  }, [navigate]);

  // Show loading only briefly and only if explicitly loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <TopNav user={user} onSignOut={handleSignOut} />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Outlet />
      </main>
    </div>
  );
});

export default AppShell;
