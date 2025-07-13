import React, { useState } from 'react';
import { PlusIcon, PlayIcon, PencilIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const FloatingActionButton = ({ 
  actions = [], 
  position = 'bottom-right',
  size = 'lg',
  color = 'blue'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    'sm': 'w-12 h-12',
    'md': 'w-14 h-14', 
    'lg': 'w-16 h-16'
  };

  const colorClasses = {
    'blue': 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    'purple': 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    'green': 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  };

  if (actions.length === 0) return null;

  const mainAction = actions[0];
  const additionalActions = actions.slice(1);

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Additional action buttons */}
      {additionalActions.length > 0 && isOpen && (
        <div className="absolute bottom-full mb-4 space-y-3">
          {additionalActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 glass-morphism border border-gray-600/50 fab-secondary"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.3s ease-out forwards'
              }}
              title={action.label}
            >
              <action.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => {
          if (additionalActions.length > 0) {
            setIsOpen(!isOpen);
          } else {
            mainAction.onClick();
          }
        }}
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]}
          text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95
          glass-morphism border border-white/20 fab-main
          focus:outline-none focus:ring-4 focus:ring-blue-500/30
        `}
        style={{
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="relative flex items-center justify-center">
          {additionalActions.length > 0 ? (
            <PlusIcon 
              className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? 'rotate-45' : 'rotate-0'
              }`} 
            />
          ) : (
            <mainAction.icon className="w-6 h-6" />
          )}
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && additionalActions.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
