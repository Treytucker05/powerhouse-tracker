import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TopNav = ({ user, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActiveRoute = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/assessment', label: 'Assessment' },
    { path: '/program', label: 'Program Design' },
    { path: '/tracking', label: 'Tracking' },
    { path: '/analytics', label: 'Analytics' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav style={{ 
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)',
      borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        
        {/* Logo Section - Fixed with SVG Dumbbell */}
        <button 
          onClick={() => handleNavClick('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            padding: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* Dumbbell SVG Icon */}
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9V15M18 9V15M10 12H14M3 12H6M18 12H21M6 7V17M18 7V17" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* PowerHouseATX Text with Different Colors */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '1.1',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              alignItems: 'baseline',
              gap: '1px'
            }}>
              <span style={{ color: '#EF4444' }}>Power</span>
              <span style={{ color: '#ffffff' }}>House</span>
              <span style={{ 
                color: '#000000',
                WebkitTextStroke: '1px #ffffff',
                textShadow: '0 0 3px rgba(255,255,255,0.5)',
                fontSize: '18px',
                fontWeight: '800'
              }}>ATX</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation - Fixed Layout */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
          justifyContent: 'center',
          maxWidth: '600px'
        }} 
        className="hidden md:flex">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                border: isActiveRoute(item.path) 
                  ? '1px solid rgba(239, 68, 68, 0.8)' 
                  : '1px solid transparent',
                background: isActiveRoute(item.path)
                  ? 'rgba(239, 68, 68, 0.25)'
                  : 'transparent',
                color: isActiveRoute(item.path)
                  ? '#EF4444'
                  : '#d1d5db',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActiveRoute(item.path)) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.color = '#ffffff';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActiveRoute(item.path)) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#d1d5db';
                  e.target.style.borderColor = 'transparent';
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* User Info */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                textAlign: 'right'
              }} className="hidden sm:flex">
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#ffffff',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                  {user.email || 'trey@powerhouse.com'}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#9ca3af'
                }}>
                  Premium Member
                </span>
              </div>
              
              {/* User Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
              }}>
                {(user.email?.[0] || 'T').toUpperCase()}
              </div>
              
              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                style={{
                  padding: '8px 12px',
                  fontSize: '13px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: '#d1d5db',
                  background: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ffffff';
                  e.target.style.background = 'rgba(220, 38, 38, 0.15)';
                  e.target.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#d1d5db';
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'transparent';
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/auth')}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                color: '#ffffff',
                fontWeight: '500',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              color: '#d1d5db',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            className="md:hidden"
            onMouseEnter={(e) => {
              e.target.style.color = '#ffffff';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#d1d5db';
              e.target.style.background = 'transparent';
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.98)'
        }} className="md:hidden">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  border: isActiveRoute(item.path) 
                    ? '1px solid rgba(220, 38, 38, 0.6)' 
                    : '1px solid transparent',
                  background: isActiveRoute(item.path)
                    ? 'rgba(220, 38, 38, 0.2)'
                    : 'transparent',
                  color: isActiveRoute(item.path)
                    ? '#DC2626'
                    : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Bottom Accent Line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.4), transparent)'
      }} />
    </nav>
  );
};

export default TopNav;
