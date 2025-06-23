export default function DeloadIndicator() {
  // Placeholder data - will be replaced with real data from context
  const deloadData = {
    status: 'monitoring', // 'safe', 'warning', 'critical'
    musclesAtRisk: ['Chest', 'Shoulders'],
    daysUntilDeload: 5,
    confidence: 78,
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'safe':
        return {
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: '✅',
          title: 'Recovery On Track'
        };
      case 'warning':
        return {
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: '⚠️',
          title: 'Monitor Closely'
        };
      case 'critical':
        return {
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: '🚨',
          title: 'Deload Recommended'
        };
      default:
        return {
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: '👁️',
          title: 'Monitoring'
        };
    }
  };

  const statusConfig = getStatusConfig(deloadData.status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Deload Indicator
      </h3>

      <div className={`p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{statusConfig.icon}</span>
            <span className={`font-medium ${statusConfig.color}`}>
              {statusConfig.title}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {deloadData.confidence}% confidence
          </span>
        </div>

        {deloadData.status !== 'safe' && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">At-risk muscles: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {deloadData.musclesAtRisk.join(', ')}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated deload in: </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {deloadData.daysUntilDeload} days
              </span>
            </div>
          </div>
        )}

        {deloadData.status === 'safe' && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            All muscle groups showing good recovery patterns. Continue current training load.
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          Fatigue Indicators
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-medium text-gray-900 dark:text-white">RIR Trend</div>
            <div className="text-yellow-600 dark:text-yellow-400">Declining</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-medium text-gray-900 dark:text-white">Volume</div>
            <div className="text-green-600 dark:text-green-400">Optimal</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <div className="font-medium text-gray-900 dark:text-white">Sleep</div>
            <div className="text-blue-600 dark:text-blue-400">Good</div>
          </div>
        </div>
      </div>
    </div>
  );
}
