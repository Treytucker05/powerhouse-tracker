import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import TopNav from '../components/navigation/TopNav';

export default function AppShell() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false by default for better UX
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn('Auth session check failed:', error);
        setUser(null);
      }
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const _handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Show loading only briefly and only if explicitly loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-lg text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <TopNav user={user} onSignOut={_handleSignOut} />
      <main className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
