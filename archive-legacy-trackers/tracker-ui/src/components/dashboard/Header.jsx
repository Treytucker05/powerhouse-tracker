import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ user, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'HOME' },
    { path: '/tracking', label: 'Progress', icon: 'TRACK' },
    { path: '/mesocycle', label: 'Planning', icon: 'MESO' },
    { path: '/microcycle', label: 'Planning', icon: 'MICRO' },
    { path: '/macrocycle', label: 'Planning', icon: 'MACRO' },
  ];  return (    <header 
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        height: '80px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        borderBottom: '3px solid #dc2626',
        boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4), 0 4px 16px rgba(0, 0, 0, 0.6)',
        width: '100vw',
        backdropFilter: 'blur(20px) saturate(120%)'
      }}
    ><div className="h-full px-8 w-full" style={{ minWidth: '100vw' }}>
        <div className="flex justify-between items-center h-full w-full">          {/* Left Section - Logo */}
          <div className="flex flex-col justify-center min-w-0" style={{ marginLeft: '96px' }}><h1 
              className="font-black leading-none"
              style={{
                fontSize: '1.75rem',
                fontWeight: '900',
                textShadow: '0 0 30px rgba(220, 38, 38, 0.9), 3px 3px 6px rgba(0,0,0,0.8)',
                filter: 'drop-shadow(0 0 15px rgba(220, 38, 38, 0.6))',
                whiteSpace: 'nowrap',
                letterSpacing: '0.5px'
              }}
            >
              <span className="text-red-600">POWERHOUSE</span>
              <span className="text-white">ATX</span>
            </h1>            <p 
              className="text-gray-300 font-semibold leading-tight"
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                marginTop: '3px',
                whiteSpace: 'nowrap',
                letterSpacing: '0.3px'
              }}
            >
              Evidence-Based Muscle Building
            </p>
          </div>          {/* Center Section - Navigation */}
          <div className="flex items-center justify-center space-x-3">
            {navItems.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`nav-button ${isActive ? 'nav-button-active' : ''}`}
                >
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    textShadow: isActive 
                      ? '0 0 8px #ff0000, 1px 1px 2px #000000' 
                      : '1px 1px 2px rgba(0,0,0,0.6)',
                    display: 'block',
                    textAlign: 'center',
                    lineHeight: '1',
                    whiteSpace: 'nowrap'
                  }}>
                    {icon}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 'bold' : '600',
                    textShadow: isActive 
                      ? '0 0 8px #ff0000, 1px 1px 2px #000000' 
                      : '1px 1px 2px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.3px'
                  }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Section - Calculator Title & Sign Out */}
          <div className="flex items-center space-x-8 min-w-0" style={{ marginRight: '96px' }}>
            <div className="text-right flex flex-col justify-center"><div 
                className="text-white font-bold leading-tight"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '800',
                  textShadow: '0 0 20px rgba(255,255,255,0.4), 2px 2px 4px rgba(0,0,0,0.9)',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.5px'
                }}
              >
                WORKOUT CALCULATOR
              </div>
              <div 
                className="text-gray-400 leading-tight"
                style={{
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                  marginTop: '3px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.2px'
                }}
              >
                Advanced Training Analytics
              </div>
            </div>
              {user && (
              <button 
                onClick={onSignOut}
                className="sign-out-button"
              >
                SIGN OUT
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
