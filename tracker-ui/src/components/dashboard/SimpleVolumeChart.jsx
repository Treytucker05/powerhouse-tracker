import React, { useState } from 'react';

const SimpleVolumeChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Legacy PowerHouse muscle order - exact match to original
  const muscleOrder = [
    'Chest', 'Shoulders', 'Biceps', 'Triceps', 'Lats', 'Mid-Traps', 
    'Rear Delts', 'Abs', 'Glutes', 'Quads', 'Hamstrings', 'Calves', 'Forearms'
  ];

  const chartData = muscleOrder.map(muscle => ({
    name: muscle,
    volume: data?.[muscle] || 0,
    mev: data?.mev?.[muscle] || 8,
    mrv: data?.mrv?.[muscle] || 20
  }));

  const maxValue = Math.max(...chartData.map(d => Math.max(d.volume, d.mrv))) * 1.1;
  const chartWidth = 900;
  const chartHeight = 500;
  const margin = { top: 40, right: 40, bottom: 100, left: 80 };
  const barWidth = (chartWidth - margin.left - margin.right) / chartData.length * 0.7;
  const barSpacing = (chartWidth - margin.left - margin.right) / chartData.length * 0.3;

  const getBarColor = (volume, mev, mrv) => {
    if (volume < mev) return '#dc2626'; // Red for under-recovery
    if (volume >= mev && volume <= mrv) return '#16a34a'; // Green for optimal
    return '#dc2626'; // Red for over-recovery
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      border: '2px solid #dc2626',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)'
    }}>
      <h3 style={{
        color: '#dc2626',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        Weekly Volume by Muscle Group
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={chartWidth} height={chartHeight} style={{ background: '#000000', borderRadius: '8px' }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#333333" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>

          {/* Horizontal grid lines with labels */}
          {Array.from({ length: 6 }, (_, i) => {
            const y = margin.top + (chartHeight - margin.top - margin.bottom) * i / 5;
            const value = Math.round(maxValue - (maxValue * i / 5));
            return (
              <g key={i}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={chartWidth - margin.right}
                  y2={y}
                  stroke="#555555"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  fill="#ffffff"
                  fontSize="14"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Main axes */}
          <line
            x1={margin.left}
            y1={chartHeight - margin.bottom}
            x2={chartWidth - margin.right}
            y2={chartHeight - margin.bottom}
            stroke="#ffffff"
            strokeWidth="3"
          />
          
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={chartHeight - margin.bottom}
            stroke="#ffffff"
            strokeWidth="3"
          />

          {/* Bars and reference lines */}
          {chartData.map((d, i) => {
            const x = margin.left + i * (barWidth + barSpacing) + barSpacing / 2;
            const barHeight = Math.max((d.volume / maxValue) * (chartHeight - margin.top - margin.bottom), 2);
            const y = chartHeight - margin.bottom - barHeight;
            
            const mevY = chartHeight - margin.bottom - (d.mev / maxValue) * (chartHeight - margin.top - margin.bottom);
            const mrvY = chartHeight - margin.bottom - (d.mrv / maxValue) * (chartHeight - margin.top - margin.bottom);
            
            return (
              <g key={d.name}>
                {/* MEV line (yellow dashed) */}
                <line
                  x1={x - 5}
                  y1={mevY}
                  x2={x + barWidth + 5}
                  y2={mevY}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
                
                {/* MRV line (red dashed) */}
                <line
                  x1={x - 5}
                  y1={mrvY}
                  x2={x + barWidth + 5}
                  y2={mrvY}
                  stroke="#dc2626"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
                
                {/* Volume bar with gradient */}
                <defs>
                  <linearGradient id={`barGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={getBarColor(d.volume, d.mev, d.mrv)} stopOpacity="1"/>
                    <stop offset="100%" stopColor={getBarColor(d.volume, d.mev, d.mrv)} stopOpacity="0.8"/>
                  </linearGradient>
                </defs>
                
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#barGradient${i})`}
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', filter: hoveredBar === i ? 'brightness(1.2)' : 'none' }}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                
                {/* Volume value on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {d.volume}
                </text>
                
                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - margin.bottom + 25}
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight - margin.bottom + 25})`}
                >
                  {d.name}
                </text>
                
                {/* Hover tooltip */}
                {hoveredBar === i && (
                  <g>
                    <rect
                      x={x - 40}
                      y={y - 80}
                      width="140"
                      height="65"
                      fill="rgba(0,0,0,0.95)"
                      stroke="#dc2626"
                      strokeWidth="2"
                      rx="8"
                    />
                    <text x={x + barWidth/2} y={y - 55} fill="#dc2626" fontSize="14" fontWeight="bold" textAnchor="middle">
                      {d.name}
                    </text>
                    <text x={x + barWidth/2} y={y - 38} fill="#ffffff" fontSize="12" textAnchor="middle">
                      Current: {d.volume} sets
                    </text>
                    <text x={x + barWidth/2} y={y - 23} fill="#fbbf24" fontSize="11" textAnchor="middle">
                      MEV: {d.mev} sets
                    </text>
                    <text x={x + barWidth/2} y={y - 8} fill="#dc2626" fontSize="11" textAnchor="middle">
                      MRV: {d.mrv} sets
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Y-axis label */}
          <text
            x={25}
            y={chartHeight / 2}
            fill="#ffffff"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(-90, 25, ${chartHeight / 2})`}
          >
            Weekly Sets
          </text>
          
          {/* X-axis label */}
          <text
            x={chartWidth / 2}
            y={chartHeight - 10}
            fill="#ffffff"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
          >
            Muscle Groups
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '12px',
            background: '#16a34a',
            border: '1px solid #ffffff'
          }} />
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
            Optimal Volume (MEV-MRV)
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '12px',
            background: '#dc2626',
            border: '1px solid #ffffff'
          }} />
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
            Sub/Over Volume
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '3px',
            background: '#fbbf24',
            borderTop: '3px dashed #fbbf24'
          }} />
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
            MEV (Minimum Effective)
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '3px',
            background: '#dc2626',
            borderTop: '3px dashed #dc2626'
          }} />
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
            MRV (Maximum Recoverable)
          </span>        </div>
      </div>
    </div>
  );
};

export default SimpleVolumeChart;
