import React from 'react';

const SimpleVolumeChart = () => {
  // Exact muscle order from legacy
  const muscles = ['Chest', 'Back', 'Quads', 'Glutes', 'Hamstrings', 'Shoulders', 'Biceps', 'Triceps', 'Calves', 'Abs', 'Forearms', 'Neck', 'Traps'];
  
  // Current volume data (green if between MEV-MRV, red otherwise)
  const currentSets = [12, 16, 20, 14, 12, 10, 14, 10, 8, 6, 4, 3, 4];
  const mevValues = [8, 10, 10, 8, 8, 6, 6, 6, 6, 4, 4, 2, 4];
  const mrvValues = [22, 25, 25, 16, 20, 20, 16, 18, 16, 16, 12, 8, 12];

  const maxValue = Math.max(...mrvValues) + 2;

  return (
    <div className="card-powerhouse" style={{ height: '500px' }}>
      <h3 className="text-xl font-bold text-white mb-4">Weekly Volume by Muscle Group</h3>
      <div className="relative h-full">
        <svg width="100%" height="400" className="bg-gray-900 rounded">
          {/* Background Grid */}
          {[...Array(6)].map((_, i) => (
            <g key={i}>
              <line
                x1="60"
                y1={50 + (i * 50)}
                x2="95%"
                y2={50 + (i * 50)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text
                x="50"
                y={55 + (i * 50)}
                fill="#ffffff"
                fontSize="12"
                textAnchor="end"
              >
                {maxValue - (i * 5)}
              </text>
            </g>
          ))}
          
          {/* Muscle Labels and Bars */}
          {muscles.map((muscle, index) => {
            const x = 70 + (index * 60);
            const currentSet = currentSets[index];
            const mev = mevValues[index];
            const mrv = mrvValues[index];
            
            const barHeight = (currentSet / maxValue) * 300;
            const mevY = 350 - (mev / maxValue) * 300;
            const mrvY = 350 - (mrv / maxValue) * 300;
            
            const isOptimal = currentSet >= mev && currentSet <= mrv;
            
            return (
              <g key={muscle}>
                {/* MEV Line */}
                <line
                  x1={x - 15}
                  y1={mevY}
                  x2={x + 15}
                  y2={mevY}
                  stroke="#ffff00"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* MRV Line */}
                <line
                  x1={x - 15}
                  y1={mrvY}
                  x2={x + 15}
                  y2={mrvY}
                  stroke="#ff0000"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* Volume Bar */}
                <rect
                  x={x - 12}
                  y={350 - barHeight}
                  width="24"
                  height={barHeight}
                  fill={isOptimal ? '#00ff00' : '#ff0000'}
                  stroke="#000000"
                  strokeWidth="1"
                />
                
                {/* Muscle Label */}
                <text
                  x={x}
                  y="375"
                  fill="#ffffff"
                  fontSize="10"
                  textAnchor="middle"
                  transform={`rotate(-45, ${x}, 375)`}
                >
                  {muscle}
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span className="text-white text-sm">Volume (Optimal)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span className="text-white text-sm">Volume (Sub/Excessive)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-yellow-500 border-dashed border"></div>
            <span className="text-white text-sm">MEV</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-red-500 border-dashed border"></div>
            <span className="text-white text-sm">MRV</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVolumeChart;
