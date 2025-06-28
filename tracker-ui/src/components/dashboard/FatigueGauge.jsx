export default function FatigueGauge({ pct = 0 }) {
  const angle = Math.min(100, Math.max(0, pct)) * 1.8; // 0-180deg semi-circle
  
  // Premium color scheme based on fatigue level
  const getGaugeColor = (percentage) => {
    if (percentage > 85) return '#DC2626'; // primary-red for critical
    if (percentage > 70) return '#EF4444'; // accent-red for high
    if (percentage > 50) return '#F59E0B'; // amber for moderate
    return '#22C55E'; // green for good
  };
  
  const gaugeColor = getGaugeColor(pct);
  const isHigh = pct > 70;
  
  return (
    <div className={`relative w-20 h-10 mx-auto ${isHigh ? 'animate-pulse' : ''}`}>
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
        
        {/* Background arc - Premium dark */}
        <path
          d="M 15 35 A 25 25 0 0 1 85 35"
          stroke="rgba(28, 28, 28, 0.8)"
          strokeWidth="4"
          fill="none"
        />
        
        {/* Progress arc - Premium with glow */}
        <path
          d="M 15 35 A 25 25 0 0 1 85 35"
          stroke="url(#gaugeGradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${(angle / 180) * 110} 110`}
          strokeLinecap="round"
          filter={isHigh ? "url(#glow)" : "none"}
          className={isHigh ? 'animate-pulse' : ''}
        />
        
        {/* Accent dots for scale */}
        <circle cx="15" cy="35" r="1.5" fill="rgba(255, 255, 255, 0.3)" />
        <circle cx="50" cy="15" r="1.5" fill="rgba(255, 255, 255, 0.3)" />
        <circle cx="85" cy="35" r="1.5" fill="rgba(255, 255, 255, 0.3)" />
      </svg>
      
      {/* Percentage text with premium styling */}
      <div className="absolute inset-0 flex items-end justify-center pb-1">
        <span 
          className={`
            text-xs font-bold
            ${isHigh ? 'text-accent animate-pulse' : 'text-white'}
          `}
          style={{ 
            textShadow: isHigh ? `0 0 8px ${gaugeColor}` : 'none',
            background: isHigh ? '' : 'linear-gradient(135deg, #FFF 0%, #FAFAFA 100%)',
            WebkitBackgroundClip: isHigh ? 'initial' : 'text',
            WebkitTextFillColor: isHigh ? 'initial' : 'transparent',
            backgroundClip: isHigh ? 'initial' : 'text'
          }}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}
