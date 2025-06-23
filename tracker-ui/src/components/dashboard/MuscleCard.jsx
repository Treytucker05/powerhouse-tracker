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
      case 'optimal': return 'border-green-500';
      case 'high': return 'border-yellow-500';
      case 'low':
      case 'maximum':
      default: return 'border-red-500';
    }
  };

  const getBadgeColor = () => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 text-green-400';
      case 'high': return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
      case 'maximum':
      default: return 'bg-red-500/20 text-red-400';
    }
  };

  // Calculate progress bar width (capped at 100%)
  const progressWidth = Math.min((sets / MRV) * 100, 100);
  
  // Calculate landmark positions as percentages
  const mevPosition = (MEV / MRV) * 100;
  const mavPosition = (MAV / MRV) * 100;
  return (
    <div className={`bg-gray-900 rounded-lg p-4 border-l-4 ${getBorderColor()} border border-gray-800`}>
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">{muscle}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getBadgeColor()}`}>
          {sets} sets
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative bg-gray-700 h-2 rounded overflow-hidden mt-2">
        {/* Progress Fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
        />
        
        {/* MEV Landmark Line */}
        <div 
          className="absolute w-[2px] h-3 bg-yellow-400 top-[-2px]"
          style={{ left: `${mevPosition}%` }}
        />
        
        {/* MAV Landmark Line */}
        <div 
          className="absolute w-[2px] h-3 bg-green-400 top-[-2px]"
          style={{ left: `${mavPosition}%` }}
        />
      </div>

      {/* Footer Line */}
      <div className="text-xs text-gray-400 text-center mt-1">
        MEV {MEV} | MAV {MAV} | MRV {MRV}
      </div>
    </div>
  );
};

export default MuscleCard;
