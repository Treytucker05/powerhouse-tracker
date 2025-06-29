import React from 'react';

// Interface for individual metric data
interface MetricData {
  label: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

// Props interface for the component
export interface ProgressMetricsProps {
  metrics?: MetricData[];
  className?: string;
}

const ProgressMetrics: React.FC<ProgressMetricsProps> = ({ 
  metrics,
  className = "" 
}) => {
  // Default metrics if none provided
  const defaultMetrics: MetricData[] = [
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
      unit: 'total',
      change: '+4',
      trend: 'up',
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  const displayMetrics: MetricData[] = metrics || defaultMetrics;

  // Helper function to get trend icon
  const getTrendIcon = (trend: MetricData['trend']): string => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  // Helper function to get trend color
  const getTrendColor = (trend: MetricData['trend']): string => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      case 'stable': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Progress Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {displayMetrics.map((metric: MetricData, index: number) => (
          <div 
            key={`${metric.label}-${index}`} 
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {metric.label}
              </h4>
              <div className={`text-sm font-medium ${getTrendColor(metric.trend)} flex items-center space-x-1`}>
                <span>{getTrendIcon(metric.trend)}</span>
                <span>{metric.change}</span>
              </div>
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressMetrics;
