import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useWeeklyVolume } from '../../hooks/useWeeklyVolume';
import Skeleton from '../ui/Skeleton';

export default function VolumeTrackingChart({ className = '' }) {
  const { data: weeklyVolumeData, isLoading, error } = useWeeklyVolume();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} sets
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-2">📊</div>
          <p className="text-red-600 dark:text-red-400 font-medium">Failed to load volume data</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  if (!weeklyVolumeData || weeklyVolumeData.length === 0) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Volume Tracking
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last 8 weeks
          </span>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📈</div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No volume data available</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Start tracking your workouts to see your progress
          </p>
        </div>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = weeklyVolumeData.map((week, index) => ({
    week: `Week ${index + 1}`,
    ...Object.entries(week.volumes || {}).reduce((acc, [muscle, data]) => {
      acc[muscle] = data.sets || 0;
      return acc;
    }, {}),
    total: Object.values(week.volumes || {}).reduce((sum, data) => sum + (data.sets || 0), 0)
  }));

  // Get muscle groups for the legend
  const muscleGroups = weeklyVolumeData[0]?.volumes ? Object.keys(weeklyVolumeData[0].volumes) : [];
  
  // Colors for different muscle groups (using PowerHouse red theme)
  const muscleColors = {
    'Chest': '#ef4444',     // red-500
    'Back': '#f97316',      // orange-500
    'Shoulders': '#eab308', // yellow-500
    'Arms': '#22c55e',      // green-500
    'Legs': '#3b82f6',      // blue-500
    'Core': '#a855f7',      // purple-500
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          📈 Volume Tracking
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last {chartData.length} weeks
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Total Volume</span>
          </div>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              className="dark:stroke-slate-700" 
            />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
              className="dark:stroke-slate-400"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
              className="dark:stroke-slate-400"
              label={{ value: 'Sets', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Total volume line */}
            <Line
              type="monotone"
              dataKey="total"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
              name="Total Volume"
            />
            
            {/* Individual muscle group lines */}
            {muscleGroups.map((muscle) => (
              <Line
                key={muscle}
                type="monotone"
                dataKey={muscle}
                stroke={muscleColors[muscle] || '#64748b'}
                strokeWidth={2}
                dot={{ fill: muscleColors[muscle] || '#64748b', strokeWidth: 1, r: 3 }}
                name={muscle}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly comparison bar chart */}
      <div className="h-48">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Week vs Average
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={muscleGroups.map(muscle => {
              const currentWeek = chartData[chartData.length - 1]?.[muscle] || 0;
              const average = chartData.reduce((sum, week) => sum + (week[muscle] || 0), 0) / chartData.length;
              return {
                muscle,
                current: currentWeek,
                average: Math.round(average * 10) / 10,
              };
            })}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="muscle" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
              className="dark:stroke-slate-400"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
              className="dark:stroke-slate-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="average" fill="#94a3b8" name="8-Week Average" radius={[2, 2, 0, 0]} />
            <Bar dataKey="current" fill="#ef4444" name="Current Week" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
