import React, { useState } from 'react';

const SimpleVolumeChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Exact muscle order from legacy PowerHouse
  const muscles = ['Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'];
  
  // Current volume data (green if between MEV-MRV, red otherwise)
  const currentSets = [12, 16, 20, 14, 12, 10, 14, 10, 8, 6, 4, 3, 4];
  const mevValues = [8, 10, 10, 8, 8, 6, 6, 6, 6, 4, 4, 2, 4];
  const mrvValues = [22, 25, 25, 16, 20, 20, 16, 18, 16, 16, 12, 8, 12];

  const maxValue = 26; // Fixed max for consistent scaling  // Calculate proper dimensions and spacing for better bar fit
  const chartWidth = 1000;
  const chartHeight = 500;
  const chartLeftMargin = 120;
  const chartRightMargin = 50;
  const chartTopMargin = 70;
  const chartBottomMargin = 80;
  const chartAreaWidth = chartWidth - chartLeftMargin - chartRightMargin;
  const chartAreaHeight = 385;
  const barWidth = 50;
  const barSpacing = chartAreaWidth / muscles.length;

  const handleMouseMove = (event, index) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setHoveredBar(index);
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
  };

  return (    <div className="card-powerhouse" style={{ height: '650px' }}>
      <h3 className="text-xl font-bold text-white mb-4">Weekly Volume by Muscle Group</h3>
      <div className="relative" style={{ height: '580px', overflow: 'hidden' }}>        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth + 120} ${chartHeight + 150}`}
          style={{ backgroundColor: '#111827', border: '2px solid #374151', borderRadius: '8px' }}
        >          {/* Enhanced Background Grid Lines - Start at 0, intervals of 2 */}
          {[...Array(14)].map((_, i) => {
            const y = chartTopMargin + chartAreaHeight - (i * (chartAreaHeight / 13)); // 13 intervals from 0 to 26
            const value = i * 2; // Values: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26
            return (
              <g key={i}>
                <line
                  x1={chartLeftMargin}
                  y1={y}
                  x2={chartLeftMargin + chartAreaWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                />
                <text
                  x={chartLeftMargin - 15}
                  y={y + 5}
                  fill="#ffffff"
                  fontSize="14"
                  textAnchor="end"
                  fontFamily="Arial"
                  fontWeight="600"
                >
                  {value}
                </text>
              </g>
            );
          })}          {/* Enhanced Vertical Grid Lines for Maximum Readability */}
          {muscles.map((_, index) => {
            const x = chartLeftMargin + (index * barSpacing) + (barSpacing / 2);
            return (
              <line
                key={`vgrid-${index}`}
                x1={x}
                y1={chartTopMargin}
                x2={x}
                y2={chartTopMargin + chartAreaHeight}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
            );
          })}          {/* Y-axis label */}
          <text
            x="30"
            y={chartTopMargin + (chartAreaHeight / 2)}
            fill="#ffffff"
            fontSize="16"
            textAnchor="middle"
            fontFamily="Arial"
            fontWeight="700"
            transform={`rotate(-90, 30, ${chartTopMargin + (chartAreaHeight / 2)})`}
          >
            Sets
          </text>          {/* Chart Data with Interactive Bars */}
          {muscles.map((muscle, index) => {
            const x = chartLeftMargin + (index * barSpacing) + (barSpacing / 2);
            const currentSet = currentSets[index];
            const mev = mevValues[index];
            const mrv = mrvValues[index];
            
            const barHeight = (currentSet / 26) * chartAreaHeight; // Scale to 0-26 range
            const barBottom = chartTopMargin + chartAreaHeight;
            const isOptimal = currentSet >= mev && currentSet <= mrv;
            const isHovered = hoveredBar === index;
            
            return (
              <g key={muscle}>
                {/* Interactive Volume Bar */}
                <rect
                  x={x - barWidth/2}
                  y={barBottom - barHeight}
                  width={barWidth}
                  height={barHeight}
                  fill={isOptimal ? (isHovered ? '#16a34a' : '#22c55e') : (isHovered ? '#dc2626' : '#ef4444')}
                  stroke={isHovered ? '#ffffff' : '#000000'}
                  strokeWidth={isHovered ? '3' : '2'}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={handleMouseLeave}
                />
                
                {/* Muscle Label */}
                <text
                  x={x}
                  y={barBottom + 25}
                  fill="#ffffff"
                  fontSize="13"
                  textAnchor="middle"
                  fontFamily="Arial"
                  fontWeight="600"
                  transform={`rotate(-45, ${x}, ${barBottom + 25})`}
                >
                  {muscle}
                </text>
              </g>
            );
          })}          {/* MEV Line (continuous across chart) */}
          <g>
            {muscles.map((muscle, index) => {
              const x = chartLeftMargin + (index * barSpacing) + (barSpacing / 2);
              const mev = mevValues[index];
              const mevY = chartTopMargin + chartAreaHeight - (mev / 26) * chartAreaHeight; // Scale to 0-26 range
              const nextX = index < muscles.length - 1 ? chartLeftMargin + ((index + 1) * barSpacing) + (barSpacing / 2) : x + (barSpacing / 2);
              const nextMev = index < muscles.length - 1 ? mevValues[index + 1] : mev;
              const nextMevY = chartTopMargin + chartAreaHeight - (nextMev / 26) * chartAreaHeight;
              
              return (
                <line
                  key={`mev-${index}`}
                  x1={x}
                  y1={mevY}
                  x2={index < muscles.length - 1 ? nextX : x + (barSpacing / 2)}
                  y2={index < muscles.length - 1 ? nextMevY : mevY}
                  stroke="#eab308"
                  strokeWidth="4"
                  strokeDasharray="8,5"
                />
              );
            })}
          </g>

          {/* MRV Line (continuous across chart) */}
          <g>
            {muscles.map((muscle, index) => {
              const x = chartLeftMargin + (index * barSpacing) + (barSpacing / 2);
              const mrv = mrvValues[index];
              const mrvY = chartTopMargin + chartAreaHeight - (mrv / 26) * chartAreaHeight; // Scale to 0-26 range
              const nextX = index < muscles.length - 1 ? chartLeftMargin + ((index + 1) * barSpacing) + (barSpacing / 2) : x + (barSpacing / 2);
              const nextMrv = index < muscles.length - 1 ? mrvValues[index + 1] : mrv;
              const nextMrvY = chartTopMargin + chartAreaHeight - (nextMrv / 26) * chartAreaHeight;
              
              return (
                <line
                  key={`mrv-${index}`}
                  x1={x}
                  y1={mrvY}
                  x2={index < muscles.length - 1 ? nextX : x + (barSpacing / 2)}
                  y2={index < muscles.length - 1 ? nextMrvY : mrvY}
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="8,5"
                />
              );
            })}
          </g>
        </svg>

        {/* Interactive Tooltip */}
        {hoveredBar !== null && (
          <div
            style={{
              position: 'absolute',
              left: mousePosition.x + 10,
              top: mousePosition.y - 80,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #dc2626',
              fontSize: '14px',
              fontFamily: 'Arial',
              fontWeight: '500',
              pointerEvents: 'none',
              zIndex: 1000,
              minWidth: '150px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#dc2626' }}>
              {muscles[hoveredBar]}
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#22c55e' }}>Current:</span> {currentSets[hoveredBar]} sets
            </div>
            <div style={{ marginBottom: '4px' }}>
              <span style={{ color: '#eab308' }}>MEV:</span> {mevValues[hoveredBar]} sets
            </div>
            <div>
              <span style={{ color: '#ef4444' }}>MRV:</span> {mrvValues[hoveredBar]} sets
            </div>
          </div>
        )}
          {/* Professional Legend */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '25px',
          backgroundColor: 'rgba(0,0,0,0.95)',
          padding: '12px 22px',
          borderRadius: '10px',
          border: '2px solid #374151',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '14px', backgroundColor: '#22c55e', borderRadius: '3px' }}></div>
            <span style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Arial', fontWeight: '600' }}>Volume (Optimal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '18px', height: '14px', backgroundColor: '#ef4444', borderRadius: '3px' }}></div>
            <span style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Arial', fontWeight: '600' }}>Volume (Sub/Excessive)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '24px', 
              height: '4px', 
              backgroundColor: '#eab308',
              borderRadius: '2px'
            }}></div>
            <span style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Arial', fontWeight: '600' }}>MEV</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '24px', 
              height: '4px', 
              backgroundColor: '#ef4444',
              borderRadius: '2px'
            }}></div>
            <span style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Arial', fontWeight: '600' }}>MRV</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVolumeChart;
