import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar({ user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/tracking', label: 'Tracking', icon: '📊' },
    { path: '/mesocycle', label: 'Mesocycle', icon: '📅' },
    { path: '/microcycle', label: 'Microcycle', icon: '🔄' },
    { path: '/macrocycle', label: 'Macrocycle', icon: '📈' },
  ];  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-accent shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-primary">PowerHouse</div>
            <div className="text-sm text-offwhite/70">Tracker</div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-primary text-black font-semibold shadow-md'
                    : 'text-offwhite/80 hover:text-offwhite hover:bg-accent/20'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-offwhite/70 hidden md:inline">
                  {user.email}
                </span>
                <button 
                  onClick={onSignOut}
                  className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 text-offwhite text-sm font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black text-sm font-medium transition-colors duration-200"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
