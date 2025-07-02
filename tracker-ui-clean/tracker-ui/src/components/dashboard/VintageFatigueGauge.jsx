import React, { useEffect, useRef } from 'react';

const VintageFatigueGauge = ({ value = 0, label = "Fatigue Level" }) => {
  const needleRef = useRef(null);
  const valueRef = useRef(null);

  // Function to set fatigue level
  const setFatigueLevel = (fatigueValue) => {
    const angle = -90 + (fatigueValue * 1.8);
    const needle = needleRef.current;
    const valueDisplay = valueRef.current;
    
    if (needle) needle.style.transform = `rotate(${angle}deg)`;
    if (valueDisplay) valueDisplay.textContent = `${fatigueValue}%`;
  };

  useEffect(() => {
    // Animate to the current value
    const timer = setTimeout(() => {
      setFatigueLevel(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      width: '100%',
      maxWidth: '300px',
      aspectRatio: '2 / 1.2',
      margin: '0 auto'
    }}>
      <div style={{
        position: 'relative',
        width: '300px',
        height: '180px',
        marginBottom: '15px'
      }}>
        {/* Gauge Bezel */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 30%, #CD7F32 70%, #A0522D 100%)',
          borderRadius: '150px 150px 0 0',
          boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.4)',
          border: '2px solid #8B4513',
          zIndex: 1
        }} />
        
        {/* Inner Bezel */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          right: '6px',
          height: 'calc(100% - 6px)',
          background: 'linear-gradient(135deg, #A0522D 0%, #CD7F32 50%, #8B4513 100%)',
          borderRadius: '144px 144px 0 0',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
          zIndex: 2
        }} />
        
        {/* Gauge Face */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          height: 'calc(100% - 12px)',
          background: 'linear-gradient(135deg, #F5F5DC 0%, #FFFACD 50%, #F0E68C 100%)',
          borderRadius: '138px 138px 0 0',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
          zIndex: 3
        }} />
        
        <svg style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '276px',
          height: '156px',
          zIndex: 5
        }} viewBox="0 0 268 148">
          <path 
            d="M 20 128 A 114 114 0 0 1 74.4 41.6" 
            fill="none" 
            stroke="rgba(34, 197, 94, 0.6)" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          <path 
            d="M 74.4 41.6 A 114 114 0 0 1 193.6 41.6" 
            fill="none" 
            stroke="rgba(245, 158, 11, 0.6)" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          <path 
            d="M 193.6 41.6 A 114 114 0 0 1 248 128" 
            fill="none" 
            stroke="rgba(239, 68, 68, 0.6)" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          
          <g>
            <line x1="30" y1="128" x2="40" y2="128" stroke="#8B4513" strokeWidth="1.5" />
            <text x="15" y="135" fontFamily="serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#8B4513">0</text>
            <line x1="53.7" y1="76.8" x2="61.4" y2="82.4" stroke="#8B4513" strokeWidth="1.5" />
            <text x="42" y="68" fontFamily="serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#8B4513">25</text>
            <line x1="134" y1="34" x2="134" y2="44" stroke="#8B4513" strokeWidth="1.5" />
            <text x="134" y="25" fontFamily="serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#8B4513">50</text>
            <line x1="214.3" y1="76.8" x2="206.6" y2="82.4" stroke="#8B4513" strokeWidth="1.5" />
            <text x="226" y="68" fontFamily="serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#8B4513">75</text>
            <line x1="238" y1="128" x2="228" y2="128" stroke="#8B4513" strokeWidth="1.5" />
            <text x="253" y="135" fontFamily="serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#8B4513">100</text>
          </g>
          
          <g>
            <line x1="40.2" y1="106.8" x2="46.2" y2="111.2" stroke="#8B4513" strokeWidth="1" />
            <line x1="66.8" y1="60.4" x2="73.8" y2="66.4" stroke="#8B4513" strokeWidth="1" />
            <line x1="194.2" y1="60.4" x2="187.2" y2="66.4" stroke="#8B4513" strokeWidth="1" />
            <line x1="220.8" y1="106.8" x2="214.8" y2="111.2" stroke="#8B4513" strokeWidth="1" />
          </g>
          
          <polygon 
            ref={needleRef}
            points="134,134 137,131 134,44 131,131" 
            fill="#8B0000" 
            stroke="#654321" 
            strokeWidth="0.5"
            style={{
              transformOrigin: '134px 134px',
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <circle cx="134" cy="134" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1" />
          <circle cx="134" cy="134" r="4" fill="#CD7F32" />
        </svg>
        
        {/* Glass Effect */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          height: 'calc(100% - 12px)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)',
          borderRadius: '138px 138px 0 0',
          pointerEvents: 'none',
          zIndex: 10
        }} />
      </div>
      
      <div style={{
        color: '#8B4513',
        fontSize: '14px',
        marginBottom: '5px',
        fontFamily: 'serif',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
      }}>
        {label}
      </div>
      <div 
        ref={valueRef}
        style={{
          color: '#DC2626',
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'serif',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
        }}
      >
        {Math.round(value)}%
      </div>
    </div>
  );
};

export default VintageFatigueGauge;