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
      const protectedRoutes = ['/tracking', '/mesocycle', '/microcycle', '/macrocycle'];
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
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-black border-b border-gray-800 text-white p-4">
        <div className="flex justify-between items-center">          <div className="flex space-x-1">
            <button 
              onClick={() => navigate('/')}
              className={`px-4 py-2 transition-colors duration-200 relative ${
                location.pathname === '/' 
                  ? 'text-white border-b-4 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </button>
            <div className="w-px h-6 bg-gray-600 self-center"></div>            <button 
              onClick={() => navigate('/tracking')}
              className={`px-4 py-2 transition-colors duration-200 relative ${
                location.pathname === '/tracking' 
                  ? 'text-white border-b-4 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tracking
            </button>
            <div className="w-px h-6 bg-gray-600 self-center"></div>            <button 
              onClick={() => navigate('/mesocycle')}
              className={`px-4 py-2 transition-colors duration-200 relative ${
                location.pathname === '/mesocycle' 
                  ? 'text-white border-b-4 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mesocycle
            </button>
            <div className="w-px h-6 bg-gray-600 self-center"></div>            <button 
              onClick={() => navigate('/microcycle')}
              className={`px-4 py-2 transition-colors duration-200 relative ${
                location.pathname === '/microcycle' 
                  ? 'text-white border-b-4 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Microcycle
            </button>
            <div className="w-px h-6 bg-gray-600 self-center"></div>            <button 
              onClick={() => navigate('/macrocycle')}
              className={`px-4 py-2 transition-colors duration-200 relative ${
                location.pathname === '/macrocycle' 
                  ? 'text-white border-b-4 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Macrocycle
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
