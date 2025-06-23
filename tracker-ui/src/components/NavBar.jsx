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
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-red-600">PowerHouse</div>
            <div className="text-sm text-white/70">Tracker</div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
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
                <span className="text-sm text-white/70 hidden md:inline">
                  {user.email}
                </span>
                <button 
                  onClick={onSignOut}
                  className="btn-powerhouse"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="btn-powerhouse"
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
