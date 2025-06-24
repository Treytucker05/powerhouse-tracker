import React, { useState } from 'react';

const SimpleVolumeChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Legacy muscle order from PowerHouse Tracker
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
  const chartWidth = 800;
  const chartHeight = 400;
  const margin = { top: 20, right: 20, bottom: 80, left: 60 };
  const barWidth = (chartWidth - margin.left - margin.right) / chartData.length * 0.8;
  const barSpacing = (chartWidth - margin.left - margin.right) / chartData.length * 0.2;

  const getBarColor = (volume, mev, mrv) => {
    if (volume < mev) return '#dc2626'; // Red for under-recovery
    if (volume <= mrv) return '#16a34a'; // Green for optimal
    return '#dc2626'; // Red for over-recovery
  };

  return (
    <div className="bg-black p-4 rounded-lg border border-gray-700">
      <h3 className="text-white text-lg font-bold mb-4 text-center">Weekly Volume by Muscle Group</h3>
      <svg width={chartWidth} height={chartHeight} className="bg-black">
        {/* Grid lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = margin.top + (chartHeight - margin.top - margin.bottom) * i / 5;
          const value = maxValue - (maxValue * i / 5);
          return (
            <g key={i}>
              <line
                x1={margin.left}
                y1={y}
                x2={chartWidth - margin.right}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
              />
              <text
                x={margin.left - 10}
                y={y + 4}
                fill="white"
                fontSize="12"
                textAnchor="end"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line
          x1={margin.left}
          y1={chartHeight - margin.bottom}
          x2={chartWidth - margin.right}
          y2={chartHeight - margin.bottom}
          stroke="white"
          strokeWidth="2"
        />

        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={chartHeight - margin.bottom}
          stroke="white"
          strokeWidth="2"
        />

        {/* Bars and reference lines */}
        {chartData.map((d, i) => {
          const x = margin.left + i * (barWidth + barSpacing);
          const barHeight = (d.volume / maxValue) * (chartHeight - margin.top - margin.bottom);
          const y = chartHeight - margin.bottom - barHeight;
          
          const mevY = chartHeight - margin.bottom - (d.mev / maxValue) * (chartHeight - margin.top - margin.bottom);
          const mrvY = chartHeight - margin.bottom - (d.mrv / maxValue) * (chartHeight - margin.top - margin.bottom);
          
          return (
            <g key={d.name}>
              {/* MEV line (yellow dashed) */}
              <line
                x1={x}
                y1={mevY}
                x2={x + barWidth}
                y2={mevY}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* MRV line (red dashed) */}
              <line
                x1={x}
                y1={mrvY}
                x2={x + barWidth}
                y2={mrvY}
                stroke="#dc2626"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Volume bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getBarColor(d.volume, d.mev, d.mrv)}
                stroke="white"
                strokeWidth="1"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
              />
              
              {/* X-axis labels */}
              <text
                x={x + barWidth / 2}
                y={chartHeight - margin.bottom + 20}
                fill="white"
                fontSize="11"
                textAnchor="middle"
                transform={`rotate(-45, ${x + barWidth / 2}, ${chartHeight - margin.bottom + 20})`}
              >
                {d.name}
              </text>
              
              {/* Tooltip */}
              {hoveredBar === i && (
                <g>
                  <rect
                    x={x - 30}
                    y={y - 60}
                    width="120"
                    height="50"
                    fill="rgba(0,0,0,0.9)"
                    stroke="white"
                    strokeWidth="1"
                    rx="4"
                  />
                  <text x={x + 30} y={y - 40} fill="white" fontSize="12" textAnchor="middle">
                    {d.name}
                  </text>
                  <text x={x + 30} y={y - 25} fill="white" fontSize="11" textAnchor="middle">
                    Volume: {d.volume}
                  </text>
                  <text x={x + 30} y={y - 10} fill="#fbbf24" fontSize="10" textAnchor="middle">
                    MEV: {d.mev} | MRV: {d.mrv}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${chartWidth - 180}, ${margin.top})`}>
          <rect x="0" y="0" width="160" height="80" fill="rgba(0,0,0,0.8)" stroke="white" strokeWidth="1" rx="4" />
          
          <rect x="10" y="15" width="12" height="8" fill="#16a34a" />
          <text x="30" y="23" fill="white" fontSize="11">Optimal Volume</text>
          
          <rect x="10" y="30" width="12" height="8" fill="#dc2626" />
          <text x="30" y="38" fill="white" fontSize="11">Sub/Over Volume</text>
          
          <line x1="10" y1="50" x2="22" y2="50" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,3" />
          <text x="30" y="53" fill="white" fontSize="11">MEV</text>
          
          <line x1="10" y1="65" x2="22" y2="65" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
          <text x="30" y="68" fill="white" fontSize="11">MRV</text>
        </g>
      </svg>
    </div>
  );
};

export default SimpleVolumeChart;
