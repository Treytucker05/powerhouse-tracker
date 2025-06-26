export default function FatigueGauge({ pct = 0 }) {
  const angle = Math.min(100, Math.max(0, pct)) * 1.8; // 0-180deg semi-circle
  
  return (
    <div className="relative w-16 h-8 mx-auto">
      {/* Background semi-circle */}
      <div className="absolute inset-0 bg-gray-700 rounded-t-full" />
      
      {/* Active arc - using SVG for better control */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
        {/* Background arc */}
        <path
          d="M 10 40 A 30 30 0 0 1 90 40"
          stroke="#374151"
          strokeWidth="6"
          fill="none"
        />
        {/* Progress arc */}
        <path
          d="M 10 40 A 30 30 0 0 1 90 40"
          stroke={pct > 75 ? '#ef4444' : pct > 50 ? '#eab308' : '#22c55e'}
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${(angle / 180) * 125} 125`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-end justify-center pb-1">
        <span className="text-xs font-bold text-white">{pct}%</span>
      </div>
    </div>
  );
}
