import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

const PowerHouseVolumeChart = ({ className = '' }) => {
  // Sample data - replace with real data from context/props
  const data = [
    { muscle: 'Chest', volume: 12, mev: 8, mrv: 22 },
    { muscle: 'Back', volume: 16, mev: 10, mrv: 25 },
    { muscle: 'Shoulders', volume: 10, mev: 6, mrv: 20 },
    { muscle: 'Biceps', volume: 8, mev: 6, mrv: 16 },
    { muscle: 'Triceps', volume: 10, mev: 6, mrv: 18 },
    { muscle: 'Quads', volume: 20, mev: 10, mrv: 25 },
    { muscle: 'Hamstrings', volume: 12, mev: 8, mrv: 20 },
    { muscle: 'Glutes', volume: 14, mev: 8, mrv: 16 },
  ];

  const getBarColor = (volume, mev, mrv) => {
    if (volume < mev || volume > mrv) return '#ef4444'; // red
    return '#22c55e'; // green
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const volume = data.volume;
      const mev = data.mev;
      const mrv = data.mrv;
      
      let status = 'Optimal';
      if (volume < mev) status = 'Below MEV';
      else if (volume > mrv) status = 'Above MRV';

      return (
        <div className="bg-gray-800 p-3 border border-gray-600 rounded-lg shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-green-400">Volume: {volume} sets</p>
          <p className="text-yellow-400">MEV: {mev} sets</p>
          <p className="text-red-400">MRV: {mrv} sets</p>
          <p className={`font-bold ${status === 'Optimal' ? 'text-green-400' : 'text-red-400'}`}>
            Status: {status}
          </p>
        </div>
      );
    }
    return null;
  };

  // Create bars with dynamic colors
  const CustomizedBar = (props) => {
    const { fill, payload, ...rest } = props;
    const color = getBarColor(payload.volume, payload.mev, payload.mrv);
    return <Bar {...rest} fill={color} stroke={color} strokeWidth={2} />;
  };

  return (
    <div className={`bg-gray-900 p-6 rounded-lg border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">📊 Weekly Volume by Muscle Group</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Sub-optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-yellow-500"></div>
            <span className="text-gray-300">MEV</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span className="text-gray-300">MRV</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="muscle" 
            stroke="#fff" 
            tick={{ fill: '#fff', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#fff" 
            tick={{ fill: '#fff', fontSize: 12 }}
            label={{ value: 'Sets', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#fff' } }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Render individual bars with dynamic colors */}
          <Bar dataKey="volume" shape={<CustomizedBar />} />
          
          {/* MEV reference lines - one per muscle group */}
          {data.map((entry, index) => (
            <ReferenceLine 
              key={`mev-${index}`} 
              x={entry.muscle}
              y={entry.mev} 
              stroke="#eab308" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          ))}
          
          {/* MRV reference lines - one per muscle group */}
          {data.map((entry, index) => (
            <ReferenceLine 
              key={`mrv-${index}`} 
              x={entry.muscle}
              y={entry.mrv} 
              stroke="#ef4444" 
              strokeDasharray="10 5"
              strokeWidth={2}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-400">
        <p>• <span className="text-green-400">Green bars</span>: Optimal training volume (between MEV and MRV)</p>
        <p>• <span className="text-red-400">Red bars</span>: Sub-optimal volume (below MEV or above MRV)</p>
        <p>• <span className="text-yellow-400">Yellow lines</span>: Minimum Effective Volume (MEV)</p>
        <p>• <span className="text-red-400">Red lines</span>: Maximum Recoverable Volume (MRV)</p>
      </div>
    </div>
  );
};

export default PowerHouseVolumeChart;
