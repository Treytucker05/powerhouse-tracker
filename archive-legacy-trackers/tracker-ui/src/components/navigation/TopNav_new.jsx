import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TopNav({ user, onSignOut }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActiveRoute = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/assessment', label: 'Assessment', icon: '📋' },
    { path: '/program', label: 'Program Design', icon: '🎯' },
    { path: '/tracking', label: 'Tracking', icon: '📈' },
    { path: '/analytics', label: 'Analytics', icon: '📊' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-red-600/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-lg shadow-lg group-hover:shadow-red-600/50 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-500 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PowerHouse
              </span>
              <span className="text-xs text-red-600 font-semibold tracking-wider uppercase">
                ATX
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group
                  ${isActiveRoute(item.path)
                    ? 'bg-red-600/20 text-red-600 border border-red-600/30 shadow-lg shadow-red-600/20'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                  }
                `}
              >
                <span className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                
                {/* Active indicator */}
                {isActiveRoute(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-lg -z-10" />
                )}
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-white">
                    {user.email || 'trey@powerhouse.com'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Premium Member
                  </span>
                </div>
                
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {(user.email?.[0] || 'T').toUpperCase()}
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-red-600 to-red-500 rounded-full opacity-20 blur-sm" />
                </div>
                
                {/* Sign Out Button */}
                <button
                  onClick={onSignOut}
                  className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-red-600/20 border border-transparent hover:border-red-600/30 rounded-lg transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('/auth')}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-red-600/30 transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                    ${isActiveRoute(item.path)
                      ? 'bg-red-600/20 text-red-600 border border-red-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
    </nav>
  );
}
