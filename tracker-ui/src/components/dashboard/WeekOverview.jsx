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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'planned': return 'bg-blue-500'
      case 'rest': return 'bg-gray-300 dark:bg-gray-600'
      default: return 'bg-red-400'
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
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${weekProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekStatus?.days?.map((day, index) => {
          const isToday = day.isToday
          const status = day.status
          
          return (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {day.label}
              </div>
              <div 
                className={`
                  day-block relative rounded-lg p-2 flex flex-col items-center
                  transition-all duration-200 hover:shadow-md w-8 h-8 mx-auto
                  ${status === "completed" && "bg-green-50 dark:bg-green-800/20"}
                  ${status === "planned" && "bg-blue-50 dark:bg-blue-800/20"}
                  ${status === "rest" && "bg-gray-50 dark:bg-gray-800/20"}
                  ${isToday && "ring-2 ring-red-500"}
                  ${getStatusColor(status)}
                `}
                title={day.focus}
              >
                <span className="text-white text-xs font-bold">
                  {getStatusIcon(status)}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {status !== 'rest' ? day.focus : ''}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="text-sm font-medium text-red-900 dark:text-red-100">
          Week Progress: {weekProgress}%
        </div>
        <div className="text-xs text-red-700 dark:text-red-300">
          {weekStatus?.completedCount > 0 
            ? `${weekStatus.completedCount} sessions completed this week`
            : 'Ready to start your training week'
          }
        </div>
      </div>
    </div>
  );
}
