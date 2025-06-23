import { useQuickActions } from '../../hooks/useQuickActions'
import Skeleton from '../ui/Skeleton'

export default function QuickActions() {
  const { data: actions, isLoading, error } = useQuickActions()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 text-sm">Failed to load actions</p>
        </div>
      </div>
    )
  }

  const actionButtons = [
    { 
      label: actions?.startTodayLabel || 'Start Workout', 
      icon: '▶️', 
      color: actions?.startTodayDisabled ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600',
      onClick: actions?.startToday,
      disabled: actions?.startTodayDisabled
    },
    { 
      label: 'Open Logger', 
      icon: '📊', 
      color: actions?.openLoggerDisabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600',
      onClick: actions?.openLogger,
      disabled: actions?.openLoggerDisabled
    },
    { 
      label: 'View Program', 
      icon: '📈', 
      color: actions?.viewProgramDisabled ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600',
      onClick: actions?.viewProgram,
      disabled: actions?.viewProgramDisabled
    },
    { 
      label: 'Export Data', 
      icon: '💾', 
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => console.log('Export data clicked'),
      disabled: false
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      {actions?.hasPlannedSession && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-sm font-medium text-green-900 dark:text-green-100">
            Today's Session: {actions.todaySession?.name || 'Planned Workout'}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">
            {actions.sessionCompleted ? 'Completed ✓' : 'Ready to start'}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {actionButtons.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`${action.color} text-white rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
