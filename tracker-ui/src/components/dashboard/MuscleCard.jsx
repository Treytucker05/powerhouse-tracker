import React from 'react';

const MuscleCard = ({ 
  muscle, 
  currentVolume = 0, 
  mev = 8, 
  mrv = 20, 
  weeklyChange = 0,
  lastWorkout = 'Never'
}) => {
  const getVolumeStatus = () => {
    if (currentVolume < mev) return { status: 'under', color: '#dc2626', text: 'Under-Recovery' };
    if (currentVolume <= mrv) return { status: 'optimal', color: '#16a34a', text: 'Optimal' };
    return { status: 'over', color: '#dc2626', text: 'Over-Recovery' };
  };

  const volumeStatus = getVolumeStatus();
  const progressPercentage = Math.min((currentVolume / mrv) * 100, 100);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      border: '1px solid #444',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.2)';
      e.currentTarget.style.borderColor = '#dc2626';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
      e.currentTarget.style.borderColor = '#444';
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{
          margin: 0,
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#dc2626'
        }}>
          {muscle}
        </h4>
        
        <div style={{
          background: volumeStatus.color,
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          {volumeStatus.text}
        </div>
      </div>

      {/* Volume Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '12px'
      }}>
        <div>
          <span style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: volumeStatus.color
          }}>
            {currentVolume}
          </span>
          <span style={{
            fontSize: '1rem',
            color: '#ccc',
            marginLeft: '4px'
          }}>
            sets
          </span>
        </div>
        
        {weeklyChange !== 0 && (
          <div style={{
            color: weeklyChange > 0 ? '#16a34a' : '#dc2626',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {weeklyChange > 0 ? '+' : ''}{weeklyChange}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#404040',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '12px'
      }}>
        <div style={{
          width: `${progressPercentage}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${volumeStatus.color}80, ${volumeStatus.color})`,
          borderRadius: '4px',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>

      {/* MEV/MRV Reference */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: '#aaa',
        marginBottom: '8px'
      }}>
        <span>MEV: <span style={{ color: '#fbbf24' }}>{mev}</span></span>
        <span>MRV: <span style={{ color: '#dc2626' }}>{mrv}</span></span>
      </div>

      {/* Last Workout */}
      <div style={{
        fontSize: '0.8rem',
        color: '#888',
        textAlign: 'center',
        paddingTop: '8px',
        borderTop: '1px solid #333'
      }}>
        Last trained: {lastWorkout}
      </div>

      {/* PowerHouse accent */}
      <div style={{
        position: 'absolute',
        bottom: '-10px',
        right: '-10px',
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, #dc2626, #ef4444)',
        borderRadius: '50%',
        opacity: '0.1'
      }} />
    </div>
  );
};

export default MuscleCard;
