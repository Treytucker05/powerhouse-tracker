import React from 'react';
import { getVolumeStatus } from '@/components/charts/helpers/volumeStatus';
import { buildChartData } from '@/components/charts/helpers/buildChartData';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

const PowerHouseVolumeChart = ({ className = '' }) => {  // Sample data - replace with real data from context/props
  const baseData = [
    { muscle: 'Chest', volume: 12, mev: 8, mrv: 22 },
    { muscle: 'Back', volume: 16, mev: 10, mrv: 25 },
    { muscle: 'Shoulders', volume: 10, mev: 6, mrv: 20 },
    { muscle: 'Biceps', volume: 14, mev: 6, mrv: 16 },
    { muscle: 'Triceps', volume: 10, mev: 6, mrv: 18 },
    { muscle: 'Quads', volume: 20, mev: 10, mrv: 25 },
    { muscle: 'Hamstrings', volume: 12, mev: 8, mrv: 20 },
    { muscle: 'Glutes', volume: 14, mev: 8, mrv: 16 },
  ];
  // Build enriched chart data via helper (pure & unit-tested)
  const chartData = buildChartData(baseData);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const volume = data.volume;
      const mev = data.mev;
      const mrv = data.mrv;

      const { status } = getVolumeStatus({ volume, mev, mrv });
      const labelMap = { below_mev: 'Below MEV', above_mrv: 'Above MRV', within: 'Optimal', unknown: 'Unknown' };
      const pretty = labelMap[status] || 'Unknown';
      return (
        <div className="bg-gray-950 border border-accent p-3 rounded-lg shadow-lg">
          <p className="text-offwhite font-medium">{label}</p>
          <p className="text-green-400">Volume: {volume} sets</p>
          <p className="text-yellow-400">MEV: {mev} sets</p>
          <p className="text-primary">MRV: {mrv} sets</p>
          <p className={`font-bold ${status === 'within' ? 'text-green-400' : 'text-accent'}`}>
            Status: {pretty}
          </p>
        </div>
      );
    }
    return null;
  };
  // Create bars with dynamic colors (not currently used but kept for future enhancement)
  // const CustomizedBar = (props) => {
  //   const { fill, payload, ...rest } = props;
  //   const color = getBarColor(payload.volume, payload.mev, payload.mrv);
  //   return <Bar {...rest} fill={color} stroke={color} strokeWidth={2} />;
  // };
  return (
    <div className={`bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-offwhite">📊 Weekly Volume by Muscle Group</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-gray-300">Sub-optimal</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-yellow-500"></div>
            <span className="text-gray-300">MEV</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-primary"></div>
            <span className="text-gray-300">MRV</span>
          </div>
        </div>
      </div><ResponsiveContainer width="100%" height={500}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />          <XAxis
            dataKey="muscle"
            stroke="#f2f2f2"
            tick={{ fill: '#f2f2f2', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#f2f2f2"
            tick={{ fill: '#f2f2f2', fontSize: 12 }}
            label={{ value: 'Sets', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#f2f2f2' } }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Volume bars */}
          <Bar dataKey="volume" strokeWidth={2}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.__color} stroke={entry.__color} />
            ))}
          </Bar>
          {/* Reference lines */}
          <ReferenceLine y={8} stroke="#eab308" strokeDasharray="5 5" strokeWidth={2} label={{ value: "MEV", position: "insideTopLeft" }} />
          <ReferenceLine y={22} stroke="#ff1a1a" strokeDasharray="10 5" strokeWidth={2} label={{ value: "MRV", position: "insideTopLeft" }} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 text-sm text-gray-400 space-y-1">
        <p>• <span className="text-green-400">Green bars</span>: Optimal training volume (between MEV and MRV)</p>
        <p>• <span className="text-accent">Red bars</span>: Sub-optimal volume (below MEV or above MRV)</p>
        <p>• <span className="text-yellow-400">Yellow lines</span>: Minimum Effective Volume (MEV)</p>
        <p>• <span className="text-primary">Red lines</span>: Maximum Recoverable Volume (MRV)</p>
      </div>
    </div>
  );
};

export default PowerHouseVolumeChart;
