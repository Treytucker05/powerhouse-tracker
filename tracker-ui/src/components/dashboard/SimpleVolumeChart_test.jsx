import React, { useState } from 'react';

function SimpleVolumeChart({ data = {} }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  // Legacy PowerHouse muscle order
  const muscleOrder = [
    'Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 
    'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'
  ];
  
  // Filter data to only include muscles that exist in our data
  const muscles = muscleOrder.filter(muscle => data.hasOwnProperty(muscle));
  
  if (muscles.length === 0) {
    return <div style={{ color: 'white' }}>No data available</div>;
  }

  // Chart dimensions
  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 80, bottom: 80, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const maxValue = Math.max(
    ...muscles.map(muscle => Math.max(
      data[muscle] || 0,
      data.mev?.[muscle] || 0,
      data.mrv?.[muscle] || 0
    ))
  );
  
  // Round up to nearest 2 and add some padding
  const yMax = Math.ceil((maxValue + 2) / 2) * 2;
  const barWidth = chartWidth / muscles.length * 0.7;
  const barSpacing = chartWidth / muscles.length;

  // Helper functions
  const getYPosition = (value) => chartHeight - (value / yMax) * chartHeight;
  const getXPosition = (index) => index * barSpacing + (barSpacing - barWidth) / 2;

  // Color function based on legacy logic
  const getBarColor = (muscle) => {
    const current = data[muscle] || 0;
    const mev = data.mev?.[muscle] || 0;
    const mrv = data.mrv?.[muscle] || 0;
    
    if (current < mev) return '#ff4444'; // Red - under MEV
    if (current > mrv) return '#ff4444'; // Red - over MRV
    return '#44ff44'; // Green - optimal
  };

  // Generate Y-axis ticks (by 2's)
  const yTicks = [];
  for (let i = 0; i <= yMax; i += 2) {
    yTicks.push(i);
  }

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
        <svg width={width} height={height} style={{ background: '#000000', borderRadius: '8px' }}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            
            {/* Horizontal grid lines (white dashed) */}
            {yTicks.map(tick => (
              <line
                key={`hgrid-${tick}`}
                x1={0}
                y1={getYPosition(tick)}
                x2={chartWidth}
                y2={getYPosition(tick)}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {/* Vertical grid lines (white dashed) */}
            {muscles.map((muscle, index) => (
              <line
                key={`vgrid-${muscle}`}
                x1={index * barSpacing + barSpacing / 2}
                y1={0}
                x2={index * barSpacing + barSpacing / 2}
                y2={chartHeight}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {/* Main axes */}
            <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#ffffff" strokeWidth="3" />
            <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#ffffff" strokeWidth="3" />

            {/* Bars (drawn first, so lines appear on top) */}
            {muscles.map((muscle, index) => {
              const current = data[muscle] || 0;
              const barHeight = Math.max((current / yMax) * chartHeight, 2);
              const x = getXPosition(index);
              const y = getYPosition(current);
              const color = getBarColor(muscle);

              return (
                <g key={`bar-${muscle}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ 
                      cursor: 'pointer', 
                      filter: hoveredBar === muscle ? 'brightness(1.2)' : 'none',
                      opacity: 0.9
                    }}
                    onMouseEnter={() => setHoveredBar(muscle)}
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
                    {current}
                  </text>
                </g>
              );
            })}

            {/* MEV Line (Yellow - drawn on top of bars for visibility) */}
            {muscles.map((muscle, index) => {
              const mev = data.mev?.[muscle] || 0;
              const x1 = index * barSpacing;
              const x2 = (index + 1) * barSpacing;
              const y = getYPosition(mev);
              
              return (
                <line
                  key={`mev-${muscle}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeDasharray="8,4"
                />
              );
            })}

            {/* MRV Line (Red - drawn on top of bars for visibility) */}
            {muscles.map((muscle, index) => {
              const mrv = data.mrv?.[muscle] || 0;
              const x1 = index * barSpacing;
              const x2 = (index + 1) * barSpacing;
              const y = getYPosition(mrv);
              
              return (
                <line
                  key={`mrv-${muscle}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#ff4444"
                  strokeWidth="4"
                  strokeDasharray="8,4"
                />
              );
            })}

            {/* X-axis labels */}
            {muscles.map((muscle, index) => (
              <text
                key={`xlabel-${muscle}`}
                x={index * barSpacing + barSpacing / 2}
                y={chartHeight + 25}
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(-45, ${index * barSpacing + barSpacing / 2}, ${chartHeight + 25})`}
              >
                {muscle}
              </text>
            ))}

            {/* Y-axis labels (by 2's) */}
            {yTicks.map(tick => (
              <text
                key={`ylabel-${tick}`}
                x={-15}
                y={getYPosition(tick) + 5}
                textAnchor="end"
                fill="#ffffff"
                fontSize="14"
                fontWeight="bold"
              >
                {tick}
              </text>
            ))}

            {/* Hover tooltip */}
            {hoveredBar && (
              <g>
                <rect
                  x={muscles.indexOf(hoveredBar) * barSpacing + 10}
                  y={10}
                  width={200}
                  height={80}
                  fill="rgba(0,0,0,0.95)"
                  stroke="#dc2626"
                  strokeWidth="2"
                  rx="8"
                />
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={30} fill="#dc2626" fontSize="14" fontWeight="bold">
                  {hoveredBar}
                </text>
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={45} fill="#ffffff" fontSize="12">
                  Current: {data[hoveredBar]} sets
                </text>
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={60} fill="#fbbf24" fontSize="11">
                  MEV: {data.mev?.[hoveredBar] || 0} sets
                </text>
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={75} fill="#ff4444" fontSize="11">
                  MRV: {data.mrv?.[hoveredBar] || 0} sets
                </text>
              </g>
            )}

            {/* Y-axis label */}
            <text
              x={-35}
              y={chartHeight / 2}
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(-90, -35, ${chartHeight / 2})`}
            >
              Weekly Sets
            </text>
            
            {/* X-axis label */}
            <text
              x={chartWidth / 2}
              y={chartHeight + 65}
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              Muscle Groups
            </text>
          </g>
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
            background: '#44ff44',
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
            background: '#ff4444',
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
            background: '#ff4444',
            borderTop: '3px dashed #ff4444'
          }} />
          <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
            MRV (Maximum Recoverable)
          </span>
        </div>
      </div>
    </div>
  );
}

export default SimpleVolumeChart;
