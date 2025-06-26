import React, { useState, useEffect } from 'react';

function SimpleVolumeChart({ data = {} }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setDimensions({ width: Math.min(screenWidth - 40, 400), height: 350 });
      } else if (screenWidth < 768) {
        setDimensions({ width: Math.min(screenWidth - 60, 600), height: 400 });
      } else if (screenWidth < 1024) {
        setDimensions({ width: Math.min(screenWidth - 80, 800), height: 450 });
      } else {
        setDimensions({ width: 900, height: 500 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Legacy PowerHouse muscle order - exact match to original trainingState.js
  const muscleOrder = [
    'Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 
    'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'
  ];
  
  // Filter data to only include muscles that exist in our data
  const muscles = muscleOrder.filter(muscle => Object.prototype.hasOwnProperty.call(data, muscle));
  
  if (muscles.length === 0) {
    return <div className="text-white">No data available</div>;
  }
  // Chart dimensions - now responsive
  const width = dimensions.width;
  const height = dimensions.height;
  const margin = { 
    top: Math.max(40, width * 0.067), 
    right: Math.max(50, width * 0.089), 
    bottom: Math.max(60, width * 0.089), 
    left: Math.max(40, width * 0.067) 
  };
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
    return '#44ff44'; // Green - optimal (between MEV and MRV)
  };

  // Generate Y-axis ticks (by 2's)
  const yTicks = [];
  for (let i = 0; i <= yMax; i += 2) {
    yTicks.push(i);
  }
  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0f0f0f 100%)',
      border: '2px solid #dc2626',
      borderRadius: '16px',
      padding: 'clamp(16px, 4vw, 32px)',
      boxShadow: '0 12px 40px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(0, 0, 0, 0.6)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0
    }}>
    
    {/* Optional container for additional width control */}
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {/* Subtle animated background glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <h3 style={{
        color: '#dc2626',
        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 'clamp(16px, 3vw, 24px)',
        textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(220, 38, 38, 0.3)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        position: 'relative',
        zIndex: 1
      }}>
        Weekly Volume by Muscle Group
      </h3>      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <svg 
          width={width} 
          height={height} 
          style={{ 
            background: 'linear-gradient(145deg, #000000 0%, #111111 50%, #000000 100%)',
            borderRadius: '12px',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(220, 38, 38, 0.2)',
            transition: 'all 0.3s ease',
            maxWidth: '100%',
            height: 'auto'
          }}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
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
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="#ffffff"
              strokeWidth="3"
            />
            
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="#ffffff"
              strokeWidth="3"
            />

            {/* Bars (drawn first, so lines appear on top) */}
            {muscles.map((muscle, index) => {
              const current = data[muscle] || 0;
              const barHeight = Math.max((current / yMax) * chartHeight, 2);
              const x = getXPosition(index);
              const y = getYPosition(current);
              const color = getBarColor(muscle);

              return (
                <g key={`bar-${muscle}`}>
                  <defs>
                    <linearGradient id={`barGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={color} stopOpacity="1"/>
                      <stop offset="100%" stopColor={color} stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={`url(#barGradient${index})`}
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'center bottom',
                      filter: hoveredBar === muscle 
                        ? 'brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.9)) drop-shadow(0 0 35px rgba(34,197,94,0.7)) drop-shadow(0 8px 25px rgba(0,0,0,0.4))' 
                        : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                    }}
                    onMouseEnter={() => setHoveredBar(muscle)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />
                    {/* Volume value on top of bar */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                      textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 4px rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      opacity: hoveredBar === muscle ? 1 : 0.9
                    }}
                  >
                    {current}
                  </text>
                </g>
              );
            })}            {/* MEV Line (Yellow - connected through data points only) */}
            <polyline
              points={muscles.map((muscle, index) => {
                const mev = data.mev?.[muscle] || 0;
                const x = index * barSpacing + barSpacing / 2;
                const y = getYPosition(mev);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeDasharray="8,4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))',
                transition: 'all 0.3s ease'
              }}
            />

            {/* MEV data point circles */}
            {muscles.map((muscle, index) => {
              const mev = data.mev?.[muscle] || 0;
              const x = index * barSpacing + barSpacing / 2;
              const y = getYPosition(mev);
              return (
                <circle
                  key={`mev-point-${muscle}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#fbbf24"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
                    transition: 'all 0.3s ease'
                  }}
                />
              );
            })}

            {/* MRV Line (Red - connected through data points only) */}
            <polyline
              points={muscles.map((muscle, index) => {
                const mrv = data.mrv?.[muscle] || 0;
                const x = index * barSpacing + barSpacing / 2;
                const y = getYPosition(mrv);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#ff4444"
              strokeWidth="4"
              strokeDasharray="8,4"
              strokeLinecap="round"
              strokeLinejoin="round"              style={{
                filter: 'drop-shadow(0 0 6px rgba(255, 68, 68, 0.6))',
                transition: 'all 0.3s ease'
              }}
            />

            {/* MRV data point circles */}
            {muscles.map((muscle, index) => {
              const mrv = data.mrv?.[muscle] || 0;
              const x = index * barSpacing + barSpacing / 2;
              const y = getYPosition(mrv);
              return (
                <circle
                  key={`mrv-point-${muscle}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#ff4444"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(255, 68, 68, 0.8))',
                    transition: 'all 0.3s ease'
                  }}
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
            ))}            {/* Hover tooltip */}
            {hoveredBar && (
              <g style={{ opacity: 0, animation: 'fadeIn 0.3s ease forwards' }}>
                <rect
                  x={muscles.indexOf(hoveredBar) * barSpacing + 10}
                  y={10}
                  width={200}
                  height={90}
                  fill="rgba(0,0,0,0.95)"
                  stroke="#dc2626"
                  strokeWidth="2"
                  rx="12"
                  style={{
                    filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.6))',
                  }}
                />
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={35} fill="#dc2626" fontSize="16" fontWeight="bold">
                  {hoveredBar}
                </text>
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={52} fill="#ffffff" fontSize="13">
                  Current: {data[hoveredBar]} sets
                </text>
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={68} fill="#fbbf24" fontSize="12">
                  MEV: {data.mev?.[hoveredBar] || 0} sets
                </text>
                <text x={muscles.indexOf(hoveredBar) * barSpacing + 20} y={84} fill="#ff4444" fontSize="12">
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
      </div>      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(15px, 4vw, 35px)',
        marginTop: 'clamp(16px, 3vw, 24px)',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1
      }}>
        {[
          { color: '#44ff44', label: 'Optimal Volume (MEV-MRV)', type: 'solid' },
          { color: '#ff4444', label: 'Sub/Over Volume', type: 'solid' },
          { color: '#fbbf24', label: 'MEV (Minimum Effective)', type: 'dashed' },
          { color: '#ff4444', label: 'MRV (Maximum Recoverable)', type: 'dashed' }
        ].map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              width: '24px',
              height: item.type === 'dashed' ? '4px' : '14px',
              background: item.color,
              border: item.type === 'solid' ? '1px solid #ffffff' : 'none',
              borderTop: item.type === 'dashed' ? `3px dashed ${item.color}` : 'none',
              borderRadius: item.type === 'solid' ? '2px' : '0',
              boxShadow: `0 0 8px ${item.color}40`
            }} />
            <span style={{ 
              color: '#ffffff', 
              fontSize: 'clamp(12px, 2.5vw, 14px)', 
              fontWeight: 'bold',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default SimpleVolumeChart;
