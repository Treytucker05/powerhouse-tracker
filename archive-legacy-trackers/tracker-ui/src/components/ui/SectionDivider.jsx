import React from 'react';

const SectionDivider = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  className = '', 
  gradient = false,
  children 
}) => {
  return (
    <div className={`section-divider ${className}`}>
      {/* Gradient line */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full h-px ${
            gradient 
              ? 'bg-gradient-to-r from-transparent via-blue-500/50 to-transparent' 
              : 'bg-gray-700'
          }`} />
        </div>
        
        {/* Center content */}
        {(title || Icon) && (
          <div className="relative flex justify-center">
            <div className="bg-gray-900 px-6 py-2 rounded-full glass-morphism border border-gray-700/50">
              <div className="flex items-center space-x-2">
                {Icon && (
                  <Icon className="w-5 h-5 text-blue-400" />
                )}
                {title && (
                  <span className="text-sm font-medium text-gray-300">
                    {title}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Additional content */}
      {subtitle && (
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default SectionDivider;
