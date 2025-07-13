import React from 'react';

const CardWrapper = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`transition-all duration-500 ease-out ${className}`}
         style={{
           background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.9) 50%, rgba(26, 26, 26, 0.95) 100%)',
           border: '1px solid rgba(220, 38, 38, 0.2)',
           borderRadius: '1rem',
           padding: '1.5rem',
           boxShadow: '0 10px 40px rgba(220, 38, 38, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)',
           backdropFilter: 'blur(20px) saturate(120%)',
           position: 'relative',
           overflow: 'hidden'
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'translateY(-2px)';
           e.currentTarget.style.boxShadow = '0 15px 50px rgba(220, 38, 38, 0.25), 0 8px 25px rgba(0, 0, 0, 0.5)';
           e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.4)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'translateY(0)';
           e.currentTarget.style.boxShadow = '0 10px 40px rgba(220, 38, 38, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)';
           e.currentTarget.style.border = '1px solid rgba(220, 38, 38, 0.2)';
         }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #dc2626 50%, transparent 100%)',
        opacity: 0.6
      }} />
      
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-xl font-bold text-white transition-all duration-300"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    letterSpacing: '0.3px',
                    marginBottom: subtitle ? '0.5rem' : '0'
                  }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-300 font-medium transition-all duration-300"
                 style={{
                   textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                   letterSpacing: '0.2px'
                 }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default CardWrapper;
