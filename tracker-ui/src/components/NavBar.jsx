import { useNavigate, useLocation } from 'react-router-dom';

export default function NavBar({ user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'HOME' },
    { path: '/tracking', label: 'Progress', icon: 'TRACK' },
    { path: '/mesocycle', label: 'Planning', icon: 'MESO' },
    { path: '/microcycle', label: 'Planning', icon: 'MICRO' },
    { path: '/macrocycle', label: 'Planning', icon: 'MACRO' },
  ];

  return (
    <nav style={{
      backgroundColor: '#111827',
      borderBottom: '3px solid #dc2626',
      boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.1)',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
    }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#dc2626',
              textShadow: '0 0 15px #dc2626, 0 0 30px rgba(220, 38, 38, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              PowerHouse
            </div>
            <div style={{
              fontSize: '1.25rem',
              color: '#ffffff',
              fontWeight: '600',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
            }}>
              Tracker
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  minWidth: '100px',
                  transition: 'all 0.3s ease',
                  border: location.pathname === path ? '3px solid #ff0000' : '3px solid transparent',
                  backgroundColor: location.pathname === path 
                    ? '#dc2626' 
                    : 'transparent',
                  color: location.pathname === path ? '#ffffff' : '#ffffff',
                  fontWeight: location.pathname === path ? 'bold' : '600',
                  boxShadow: location.pathname === path 
                    ? '0 8px 25px rgba(255, 0, 0, 0.4), 0 0 20px rgba(220, 38, 38, 0.3)' 
                    : 'none',
                  transform: location.pathname === path ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== path) {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.color = '#ffffff';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                    e.target.style.border = '3px solid #dc2626';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== path) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ffffff';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.border = '3px solid transparent';
                  }
                }}
              >
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.1em',
                  textShadow: location.pathname === path 
                    ? '0 0 12px #ff0000, 1px 1px 2px #000000, -1px -1px 2px #000000, 1px -1px 2px #000000, -1px 1px 2px #000000' 
                    : '1px 1px 2px rgba(0,0,0,0.5)',
                  color: location.pathname === path ? '#ffffff' : '#ffffff'
                }}>
                  {icon}
                </span>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: location.pathname === path ? 'bold' : '600',
                  textShadow: location.pathname === path 
                    ? '0 0 10px #ff0000, 1px 1px 2px #000000, -1px -1px 2px #000000, 1px -1px 2px #000000, -1px 1px 2px #000000' 
                    : '1px 1px 2px rgba(0,0,0,0.5)',
                  color: location.pathname === path ? '#ffffff' : '#ffffff'
                }}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* User Actions */}
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
