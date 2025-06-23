export default function ProgressMetrics() {
  // Placeholder data - will be replaced with real data from context
  const metrics = [
    {
      label: 'Total Volume',
      value: '1,247',
      unit: 'sets',
      change: '+12%',
      trend: 'up',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Average RIR',
      value: '2.3',
      unit: '',
      change: '-0.2',
      trend: 'down',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Tonnage',
      value: '24.8k',
      unit: 'lbs',
      change: '+8%',
      trend: 'up',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Sessions',
      value: '16',
      unit: 'completed',
      change: '+2',
      trend: 'up',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '↗️' : '↘️';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Progress Metrics
      </h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </div>
              <div className="flex items-baseline space-x-1">
                <span className={`text-xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.unit}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                {metric.change}
              </span>
              <span className="text-sm">
                {getTrendIcon(metric.trend)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
          💡 Performance Insight
        </div>
        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          Your volume is trending upward - maintain this pace for optimal growth
        </div>
      </div>
    </div>
  );
}
