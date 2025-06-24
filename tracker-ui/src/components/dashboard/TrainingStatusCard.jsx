import React from 'react';

const TrainingStatusCard = ({ currentWeek = 1, totalWeeks = 6, fatigueLevel = 'moderate', deloadRecommended = false }) => {
  const progressPercentage = (currentWeek / totalWeeks) * 100;
  
  const getFatigueColor = (level) => {
    switch(level) {
      case 'low': return '#16a34a';
      case 'moderate': return '#fbbf24';
      case 'high': return '#ea580c';
      case 'extreme': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getFatigueText = (level) => {
    switch(level) {
      case 'low': return 'Fresh & Ready';
      case 'moderate': return 'Building Fatigue';
      case 'high': return 'High Fatigue';
      case 'extreme': return 'Extreme Fatigue';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      border: '2px solid #dc2626',
      borderRadius: '12px',
      padding: '24px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#dc2626',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Training Status
        </h3>
        
        {deloadRecommended && (
          <div style={{
            background: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)'
          }}>
            DELOAD RECOMMENDED
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            Mesocycle Progress
          </span>
          <span style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold',
            color: '#dc2626'
          }}>
            Week {currentWeek} of {totalWeeks}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#404040',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid #666'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)',
            borderRadius: '6px',
            transition: 'width 0.5s ease-in-out',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
          }} />
        </div>
        
        <div style={{
          fontSize: '0.9rem',
          color: '#ccc',
          marginTop: '4px',
          textAlign: 'center'
        }}>
          {Math.round(progressPercentage)}% Complete
        </div>
      </div>

      {/* Fatigue Level */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '8px',
        border: '1px solid #444'
      }}>
        <div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            marginBottom: '4px'
          }}>
            Fatigue Level
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: getFatigueColor(fatigueLevel),
            textShadow: `0 0 10px ${getFatigueColor(fatigueLevel)}40`
          }}>
            {getFatigueText(fatigueLevel)}
          </div>
        </div>
        
        {/* Fatigue Indicator */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${getFatigueColor(fatigueLevel)}40 0%, ${getFatigueColor(fatigueLevel)}20 70%, transparent 100%)`,
          border: `3px solid ${getFatigueColor(fatigueLevel)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: getFatigueColor(fatigueLevel),
          boxShadow: `0 0 20px ${getFatigueColor(fatigueLevel)}60`
        }}>
          {fatigueLevel === 'low' ? '💪' : 
           fatigueLevel === 'moderate' ? '⚡' :
           fatigueLevel === 'high' ? '🔥' : '⚠️'}
        </div>
      </div>

      {/* Decorative PowerHouse accent */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(45deg, #dc2626, #ef4444)',
        borderRadius: '50%',
        opacity: '0.1',
        zIndex: 0
      }} />
    </div>
  );
};

export default TrainingStatusCard;
