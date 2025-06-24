import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar({ user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'HOME' },
    { path: '/tracking', label: 'Volume Tracking', icon: 'TRACK' },
    { path: '/mesocycle', label: 'Mesocycle Plan', icon: 'MESO' },
    { path: '/microcycle', label: 'Weekly Plan', icon: 'WEEK' },
    { path: '/macrocycle', label: 'Year Plan', icon: 'YEAR' },
  ];  return (
    <nav className="bg-gray-900 border-b-2 border-gray-700 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-red-600">PowerHouse</div>
            <div className="text-lg text-white font-semibold">Tracker</div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {navItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center px-6 py-3 rounded-lg transition-all duration-200 min-w-[100px] ${
                  location.pathname === path
                    ? 'bg-red-600 text-white font-bold shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-md'
                }`}
              >
                <span className="text-xs font-bold mb-1 tracking-wider">{icon}</span>
                <span className="text-sm font-semibold">{label}</span>
              </button>
            ))}
          </div>          {/* User Actions */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm text-gray-300 hidden md:inline font-medium">
                  {user.email}
                </span>
                <button 
                  onClick={onSignOut}
                  className="btn-powerhouse text-sm px-6 py-2"
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="btn-powerhouse text-sm px-6 py-2"
              >
                LOGIN / REGISTER
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
