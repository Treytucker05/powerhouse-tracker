import { useQuickActions } from '../../hooks/useQuickActions'
import Skeleton from '../ui/Skeleton'

export default function QuickActions() {
  const { data: actions, isLoading, error } = useQuickActions()
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
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
      label: actions?.startTodayLabel || 'Start Today\'s Workout', 
      icon: '🏋️', 
      color: actions?.startTodayDisabled ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700',
      onClick: actions?.startToday,
      disabled: actions?.startTodayDisabled,
      primary: true
    },
    { 
      label: 'Open Logger', 
      icon: '📊', 
      color: actions?.openLoggerDisabled ? 'bg-gray-400' : 'bg-slate-600 hover:bg-slate-700',
      onClick: actions?.openLogger,
      disabled: actions?.openLoggerDisabled
    },
    { 
      label: 'View Program', 
      icon: '📈', 
      color: actions?.viewProgramDisabled ? 'bg-gray-400' : 'bg-slate-600 hover:bg-slate-700',
      onClick: actions?.viewProgram,
      disabled: actions?.viewProgramDisabled
    }
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      {actions?.hasPlannedSession && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-sm font-medium text-red-900 dark:text-red-100">
            Today's Session: {actions.todaySession?.name || 'Planned Workout'}
          </div>
          <div className="text-xs text-red-700 dark:text-red-300">
            {actions.sessionCompleted ? 'Completed ✓' : 'Ready to start'}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {actionButtons.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              ${action.color} text-white rounded-lg font-medium transition-all duration-200 
              flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed
              ${action.primary 
                ? 'px-4 py-3 text-base w-full hover:shadow-lg' 
                : 'px-3 py-2 text-sm w-full'
              }
            `}
          >
            <span>{action.icon}</span>
            <span className="whitespace-nowrap">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
