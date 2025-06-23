import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import DashboardLayout from './DashboardLayout';

export default function AppShell() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
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

  // Protected routes - redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      const protectedRoutes = ['/tracking', '/mesocycle', '/microcycle', '/macrocycle'];
      const isProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      if (isProtectedRoute) {        navigate('/auth');
      }
    }
  }, [user, loading, location.pathname, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-lg text-offwhite">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onSignOut={handleSignOut}>
      <Outlet />
    </DashboardLayout>
  );
}
