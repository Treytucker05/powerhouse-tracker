import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
      const protectedRoutes = ['/logger', '/sessions', '/intelligence'];
      const isProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      if (isProtectedRoute) {
        navigate('/auth');
      }
    }
  }, [user, loading, location.pathname, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/')}
              className={`px-3 py-1 rounded ${location.pathname === '/' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/sessions')}
              className={`px-3 py-1 rounded ${location.pathname === '/sessions' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
            >
              Sessions
            </button>
            <button 
              onClick={() => navigate('/intelligence')}
              className={`px-3 py-1 rounded ${location.pathname === '/intelligence' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
            >
              Intelligence
            </button>
            <button 
              onClick={() => navigate('/logger')}
              className={`px-3 py-1 rounded ${location.pathname === '/logger' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
            >
              Logger
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-300">
                  {user.email}
                </span>
                <button 
                  onClick={handleSignOut}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
