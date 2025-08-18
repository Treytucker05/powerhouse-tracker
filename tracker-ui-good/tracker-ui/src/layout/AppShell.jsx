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
  const protectedRoutes = ['/tracking', '/mesocycle', '/microcycle', '/macrocycle'];

  const isProtectedPath = useCallback((path) => {
    return protectedRoutes.some(route => path.startsWith(route));
  }, [protectedRoutes]);

  const handleAuthStateChange = useCallback((event, session) => {
    setUser(session?.user ?? null);
    if (event === 'SIGNED_OUT') {
      const path = location.pathname;
      if (path !== '/auth' && isProtectedPath(path)) {
        navigate('/auth');
      }
    }
  }, [navigate, location.pathname, isProtectedPath]);

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
      // Single place initial guard: redirect only if current path is protected & not authenticated
      try {
        if (mounted) {
          const path = location.pathname;
          if (!session?.user && path !== '/auth' && isProtectedPath(path)) {
            navigate('/auth');
          }
        }
      } catch { /* noop */ }
    };

    getSession();

    // Listen for auth changes with the memoized handler
    const authListenerResult = supabase.auth.onAuthStateChange?.(handleAuthStateChange);
    const subscription = authListenerResult && authListenerResult.data && authListenerResult.data.subscription
      ? authListenerResult.data.subscription
      : { unsubscribe: () => { } };

    return () => {
      mounted = false;
      try { subscription.unsubscribe?.(); } catch { /* noop */ }
    };
  }, [handleAuthStateChange]);

  // Removed duplicate protected-route redirect effect; logic centralized in initial session fetch & auth state change handler.

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
