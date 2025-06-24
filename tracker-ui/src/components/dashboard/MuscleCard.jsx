import React, { useState } from 'react';

const MuscleCard = ({ 
  muscle,
  sets,
  MEV,
  MAV,
  MRV
}) => {
  const [currentValue, setCurrentValue] = useState(sets);

  // Determine status based on volume
  const getStatus = () => {
    if (currentValue < MEV) return 'low';
    if (currentValue <= MAV) return 'optimal';
    if (currentValue <= MRV) return 'high';
    return 'maximum';
  };

  const status = getStatus();
  
  // Get border and badge colors based on status
  const getBorderColor = () => {
    switch (status) {
      case 'optimal': return '#22c55e';
      case 'high': return '#eab308';
      case 'low':
      case 'maximum':
      default: return '#dc2626';
    }
  };

  const getSliderColor = (value) => {
    if (value < MEV) return '#dc2626'; // Red - below MEV
    if (value > MRV) return '#dc2626'; // Red - above MRV
    return '#22c55e'; // Green - optimal range
  };

  const getSliderBackground = () => {
    // Create gradient that spans the full range (0 to max)
    const maxRange = Math.max(MRV * 1.5, 30); // Allow 50% beyond MRV
    const mevPercent = (MEV / maxRange) * 100;
    const mavPercent = (MAV / maxRange) * 100;
    const mrvPercent = (MRV / maxRange) * 100;
    
    return `linear-gradient(to right, 
      #dc2626 0%, 
      #dc2626 ${mevPercent}%, 
      #eab308 ${mevPercent}%, 
      #22c55e ${mavPercent}%, 
      #eab308 ${mrvPercent}%, 
      #dc2626 ${mrvPercent}%, 
      #dc2626 100%)`;
  };

  const maxRange = Math.max(MRV * 1.5, 30);
  const sliderColor = getSliderColor(currentValue);  return (
    <div style={{
      backgroundColor: '#1f2937',
      border: `2px solid ${sliderColor}`,
      borderRadius: '0.75rem',
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      boxShadow: `0 4px 12px rgba(${sliderColor === '#22c55e' ? '34, 197, 94' : '220, 38, 38'}, 0.3)`
    }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <span style={{
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.125rem',
          textTransform: 'uppercase'
        }}>{muscle}</span>
        <span style={{
          color: sliderColor,
          fontSize: '1rem',
          fontWeight: 'bold',
          textShadow: `0 0 8px ${sliderColor}`
        }}>Current: {currentValue} sets</span>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative' }}>
        <input 
          type="range" 
          min={0} 
          max={maxRange} 
          value={currentValue}
          style={{
            width: '100%',
            height: '12px',
            background: getSliderBackground(),
            borderRadius: '6px',
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none'
          }}
          onChange={(e) => {
            setCurrentValue(parseInt(e.target.value));
          }}
        />
        
        {/* Landmark Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          marginTop: '0.75rem',
          fontWeight: '600'
        }}>
          <span style={{ 
            color: '#eab308', 
            fontWeight: 'bold',
            textShadow: '0 0 4px #eab308'
          }}>MEV: {MEV}</span>
          <span style={{ 
            color: currentValue >= MEV && currentValue <= MRV ? '#22c55e' : '#dc2626', 
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textShadow: `0 0 4px ${currentValue >= MEV && currentValue <= MRV ? '#22c55e' : '#dc2626'}`
          }}>
            {currentValue >= MEV && currentValue <= MRV ? 'OPTIMAL RANGE' : 'OUT OF RANGE'}
          </span>
          <span style={{ 
            color: '#dc2626', 
            fontWeight: 'bold',
            textShadow: '0 0 4px #dc2626'
          }}>MRV: {MRV}</span>
        </div>
      </div>
    </div>
  );
};

export default MuscleCard;
