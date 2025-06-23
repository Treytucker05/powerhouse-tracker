import React from 'react';

const MuscleCard = ({ 
  muscle,
  sets,
  MEV,
  MAV,
  MRV
}) => {
  // Determine status based on volume
  const getStatus = () => {
    if (sets < MEV) return 'low';
    if (sets <= MAV) return 'optimal';
    if (sets <= MRV) return 'high';
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

  const getBadgeColor = () => {
    switch (status) {
      case 'optimal': return { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' };
      case 'high': return { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#facc15' };
      case 'low':
      case 'maximum':
      default: return { backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#f87171' };
    }
  };

  // Calculate progress bar width (capped at 100%)
  const progressWidth = Math.min((sets / MRV) * 100, 100);
  
  // Calculate landmark positions as percentages
  const mevPosition = (MEV / MRV) * 100;
  const mavPosition = (MAV / MRV) * 100;  return (
    <div style={{
      backgroundColor: '#111827',
      borderRadius: '0.5rem',
      padding: '1rem',
      borderLeft: `4px solid ${getBorderColor()}`,
      border: '1px solid #1f2937'
    }}>
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">{muscle}</h3>
        <span style={{
          ...getBadgeColor(),
          padding: '0.125rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}>
          {sets} sets
        </span>
      </div>

      {/* Progress Bar Container */}
      <div style={{
        position: 'relative',
        backgroundColor: '#374151',
        height: '0.5rem',
        borderRadius: '0.375rem',
        overflow: 'hidden',
        marginTop: '0.5rem'
      }}>
        {/* Progress Fill */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            backgroundColor: '#dc2626',
            transition: 'all 0.3s ease-in-out',
            width: `${progressWidth}%`
          }}
        />
        
        {/* MEV Landmark Line */}
        <div 
          style={{
            position: 'absolute',
            width: '2px',
            height: '0.75rem',
            backgroundColor: '#facc15',
            top: '-2px',
            left: `${mevPosition}%`
          }}
        />
        
        {/* MAV Landmark Line */}
        <div 
          style={{
            position: 'absolute',
            width: '2px',
            height: '0.75rem',
            backgroundColor: '#4ade80',
            top: '-2px',
            left: `${mavPosition}%`
          }}
        />
      </div>

      {/* Footer Line */}
      <div style={{
        fontSize: '0.75rem',
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: '0.25rem'
      }}>
        MEV {MEV} | MAV {MAV} | MRV {MRV}
      </div>
    </div>
  );
};

export default MuscleCard;
