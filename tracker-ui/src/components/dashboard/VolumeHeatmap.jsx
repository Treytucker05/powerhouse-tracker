export default function VolumeHeatmap({ className = '' }) {
  // Placeholder data - will be replaced with real data from context
  const heatmapData = [
    { muscle: 'Chest', week1: 8, week2: 10, week3: 12, week4: 14 },
    { muscle: 'Back', week1: 12, week2: 14, week3: 16, week4: 18 },
    { muscle: 'Shoulders', week1: 6, week2: 8, week3: 10, week4: 12 },
    { muscle: 'Arms', week1: 8, week2: 10, week3: 12, week4: 14 },
    { muscle: 'Legs', week1: 16, week2: 18, week3: 20, week4: 22 },
    { muscle: 'Core', week1: 4, week2: 6, week3: 8, week4: 10 },
  ];

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  const getIntensityColor = (value, max = 25) => {
    const intensity = Math.min(value / max, 1);
    if (intensity <= 0.2) return 'bg-green-100 dark:bg-green-900';
    if (intensity <= 0.4) return 'bg-green-200 dark:bg-green-800';
    if (intensity <= 0.6) return 'bg-yellow-200 dark:bg-yellow-800';
    if (intensity <= 0.8) return 'bg-orange-300 dark:bg-orange-700';
    return 'bg-red-400 dark:bg-red-600';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Volume Heatmap
        </h3>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Low</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded"></div>
            <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
            <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 rounded"></div>
            <div className="w-3 h-3 bg-orange-300 dark:bg-orange-700 rounded"></div>
            <div className="w-3 h-3 bg-red-400 dark:bg-red-600 rounded"></div>
          </div>
          <span>High</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                Muscle Group
              </th>
              {weeks.map((week) => (
                <th key={week} className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 pb-3 px-2">
                  {week}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-2">
            {heatmapData.map((row) => (
              <tr key={row.muscle}>
                <td className="text-sm font-medium text-gray-900 dark:text-white py-2">
                  {row.muscle}
                </td>
                <td className="px-2 py-2">
                  <div className={`w-12 h-8 rounded ${getIntensityColor(row.week1)} flex items-center justify-center text-xs font-medium`}>
                    {row.week1}
                  </div>
                </td>
                <td className="px-2 py-2">
                  <div className={`w-12 h-8 rounded ${getIntensityColor(row.week2)} flex items-center justify-center text-xs font-medium`}>
                    {row.week2}
                  </div>
                </td>
                <td className="px-2 py-2">
                  <div className={`w-12 h-8 rounded ${getIntensityColor(row.week3)} flex items-center justify-center text-xs font-medium`}>
                    {row.week3}
                  </div>
                </td>
                <td className="px-2 py-2">
                  <div className={`w-12 h-8 rounded ${getIntensityColor(row.week4)} flex items-center justify-center text-xs font-medium`}>
                    {row.week4}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
