import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function NavBar({ user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for dynamic styling
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);const navItems = [
    { path: '/', label: 'Dashboard', icon: 'HOME' },
    { path: '/tracking', label: 'Progress', icon: 'TRACK' },
    { path: '/mesocycle', label: 'Planning', icon: 'MESO' },
    { path: '/microcycle', label: 'Planning', icon: 'MICRO' },
    { path: '/macrocycle', label: 'Planning', icon: 'MACRO' },
  ];  return (
    <nav 
      className="fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out"      style={{
        top: scrolled ? '72px' : '80px', // Position directly below header
        height: scrolled ? '56px' : '64px',
        backgroundColor: scrolled ? 'rgba(17, 24, 39, 0.95)' : '#111827',
        borderBottom: scrolled ? '2px solid #dc2626' : '3px solid #dc2626',
        boxShadow: scrolled 
          ? '0 6px 25px rgba(220, 38, 38, 0.4), 0 0 50px rgba(220, 38, 38, 0.15)' 
          : '0 4px 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.1)',
        background: scrolled 
          ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.90) 50%, rgba(17, 24, 39, 0.95) 100%)'
          : 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none'
      }}
    >      <div className="container mx-auto px-6 h-full max-w-7xl">
        <div className="flex justify-between items-center h-full">
          {/* Left spacer */}
          <div className="flex-1"></div>
            {/* Navigation Links - Centered */}
          <div className="flex items-center justify-center space-x-4 flex-2">{navItems.map(({ path, label, icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  display: 'flex',
                  flexDirection: scrolled ? 'row' : 'column',
                  alignItems: 'center',
                  justifyContent: 'center',                  padding: scrolled ? '0.625rem 1.25rem' : '0.875rem 1.5rem',
                  borderRadius: '0.75rem',                  minWidth: scrolled ? '90px' : '110px',
                  height: scrolled ? '40px' : '52px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: location.pathname === path ? '2px solid #ff0000' : '2px solid transparent',
                  backgroundColor: location.pathname === path 
                    ? '#dc2626' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  fontWeight: location.pathname === path ? 'bold' : '600',
                  boxShadow: location.pathname === path 
                    ? '0 8px 25px rgba(255, 0, 0, 0.4), 0 0 20px rgba(220, 38, 38, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  transform: location.pathname === path ? 'translateY(-2px)' : 'translateY(0)',
                  backdropFilter: 'blur(8px)',
                  gap: scrolled ? '0.5rem' : '0.25rem'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== path) {
                    e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.8)';
                    e.target.style.transform = 'translateY(-1px) scale(1.02)';
                    e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
                    e.target.style.border = '2px solid #dc2626';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== path) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                    e.target.style.border = '2px solid transparent';
                  }
                }}              >                <span style={{
                  fontSize: scrolled ? '0.75rem' : '0.875rem',
                  fontWeight: 'bold',
                  marginBottom: scrolled ? '0' : '0.125rem',
                  letterSpacing: '0.05em',
                  textShadow: location.pathname === path 
                    ? '0 0 8px #ff0000, 1px 1px 2px #000000' 
                    : '1px 1px 2px rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  opacity: location.pathname === path ? 1 : 0.9
                }}>
                  {icon}
                </span>
                <span style={{
                  fontSize: scrolled ? '0.75rem' : '0.875rem',
                  fontWeight: location.pathname === path ? 'bold' : '600',
                  textShadow: location.pathname === path 
                    ? '0 0 8px #ff0000, 1px 1px 2px #000000' 
                    : '1px 1px 2px rgba(0,0,0,0.5)',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                  opacity: location.pathname === path ? 1 : 0.9
                }}>
                  {label}
                </span>
              </button>
            ))}          </div>

          {/* User Actions - Right side */}
          <div 
            className={`flex items-center justify-end flex-1 transition-all duration-500 ease-in-out ${
              scrolled ? 'space-x-2' : 'space-x-4'
            }`}
          >
            {user ? (
              <>                <span 
                  className={`text-gray-300 hidden md:inline font-medium transition-all duration-300 ease-in-out ${
                    scrolled ? 'text-xs opacity-70' : 'text-xs opacity-90'
                  }`}
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    marginRight: '0.5rem'
                  }}
                >
                  {user.email}
                </span>
                <button 
                  onClick={onSignOut}
                  className={`btn-powerhouse transition-all duration-300 ease-in-out ${
                    scrolled ? 'text-xs px-2.5 py-1' : 'text-xs px-3 py-1.5'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)',
                    border: '2px solid #dc2626',
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(239, 68, 68, 0.7) 100%)',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: scrolled ? '36px' : '40px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                    e.target.style.transform = 'translateY(-1px) scale(1.02)';
                    e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className={`btn-powerhouse transition-all duration-300 ease-in-out ${
                  scrolled ? 'text-xs px-4 py-1' : 'text-sm px-6 py-2'
                }`}
                style={{
                  backdropFilter: 'blur(8px)',
                  border: '2px solid #dc2626',
                  background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                  e.target.style.transform = 'translateY(-1px) scale(1.02)';
                  e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(239, 68, 68, 0.6) 100%)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
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
