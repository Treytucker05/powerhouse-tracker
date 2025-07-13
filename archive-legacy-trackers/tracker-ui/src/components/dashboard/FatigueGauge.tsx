import React from 'react';

// Props interface for the component
export interface FatigueGaugeProps {
  pct?: number;
  className?: string;
}

const FatigueGauge: React.FC<FatigueGaugeProps> = ({ pct = 0, className = "" }) => {
  const angle: number = Math.min(100, Math.max(0, pct)) * 1.8; // 0-180deg semi-circle
  
  // Premium color scheme based on fatigue level
  const getGaugeColor = (percentage: number): string => {
    if (percentage > 85) return '#DC2626'; // primary-red for critical
    if (percentage > 70) return '#EF4444'; // accent-red for high
    if (percentage > 50) return '#F59E0B'; // amber for moderate
    return '#22C55E'; // green for good
  };
  
  const gaugeColor: string = getGaugeColor(pct);
  const isHigh: boolean = pct > 70;
  
  return (
    <div className={`relative w-20 h-10 mx-auto ${isHigh ? 'animate-pulse' : ''} ${className}`}>
      {/* Premium SVG Gauge */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gaugeColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={gaugeColor} stopOpacity="1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background arc */}
        <path 
          d="M 10 45 A 35 35 0 0 1 90 45" 
          fill="none" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Active gauge arc */}
        <path 
          d="M 10 45 A 35 35 0 0 1 90 45" 
          fill="none" 
          stroke="url(#gaugeGradient)" 
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="126" // circumference of semi-circle
          strokeDashoffset={126 - (angle / 180) * 126}
          filter="url(#glow)"
          className="transition-all duration-700 ease-out"
        />
        
        {/* Needle */}
        <g transform={`rotate(${angle - 90} 50 45)`}>
          <line 
            x1="50" y1="45" x2="50" y2="15" 
            stroke={gaugeColor} 
            strokeWidth="2" 
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-700 ease-out"
          />
          <circle 
            cx="50" cy="45" r="3" 
            fill={gaugeColor}
            filter="url(#glow)"
          />
        </g>
      </svg>
      
      {/* Digital readout */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
        <span 
          className="text-xs font-bold tabular-nums"
          style={{ color: gaugeColor }}
        >
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
};

export default FatigueGauge;
