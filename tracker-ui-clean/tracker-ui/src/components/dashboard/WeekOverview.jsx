import { useWeekStatus } from '../../hooks/useWeekStatus'
import Skeleton from '../ui/Skeleton'

export default function WeekOverview() {
  const { data: weekStatus, isLoading, error } = useWeekStatus()

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓'
      case 'planned': return '⏳'
      case 'rest': return '•'
      default: return '✖'
    }
  }
  const getStatusColor = (status, isToday = false) => {
    const baseClasses = 'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm border-2 transition-all duration-200 hover:scale-105 shadow-sm';
    
    switch (status) {
      case 'completed': 
        return `${baseClasses} bg-green-500 border-green-600 hover:bg-green-600 ${isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''}`;
      case 'planned': 
        return `${baseClasses} bg-blue-500 border-blue-600 hover:bg-blue-600 ${isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''}`;
      case 'rest': 
        return `${baseClasses} bg-gray-400 border-gray-500 hover:bg-gray-500 ${isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''}`;
      default: 
        return `${baseClasses} bg-red-400 border-red-500 hover:bg-red-500 ${isToday ? 'ring-2 ring-red-500 ring-offset-2' : ''}`;
    }
  }
  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-3 w-8 mx-auto mb-1" />
              <Skeleton className="h-8 w-8 rounded-full mx-auto" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400">Failed to load week data</p>
        </div>
      </div>
    )
  }
  const weekProgress = weekStatus?.totalPlanned > 0 
    ? Math.round((weekStatus.completedCount / weekStatus.totalPlanned) * 100)
    : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Week Overview
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Current Week
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {weekStatus?.completedCount || 0}/{weekStatus?.totalPlanned || 0} sessions
          </span>
        </div>        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${weekProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">        {weekStatus?.days?.map((day, index) => {
          const isToday = day.isToday
          const status = day.status
          
          return (
            <div key={index} className="text-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {day.label}
              </div>
              <div className={getStatusColor(status, isToday)}>
                <span className="text-white text-sm font-bold">
                  {getStatusIcon(status)}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate max-w-12">
                {status !== 'rest' ? (day.focus?.split(' ')[0] || '') : 'Rest'}
              </div>
            </div>
          )
        })}
      </div>      <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-red-900 dark:text-red-100">
              Week Progress: {weekProgress}%
            </div>
            <div className="text-xs text-red-700 dark:text-red-300 mt-1">
              {weekStatus?.completedCount > 0 
                ? `${weekStatus.completedCount} sessions completed this week`
                : 'Ready to start your training week'
              }
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {weekStatus?.completedCount || 0}/{weekStatus?.totalPlanned || 0}
            </div>
            <div className="text-xs text-red-500 dark:text-red-400">sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
