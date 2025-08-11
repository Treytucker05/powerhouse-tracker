import { useQuickActions } from '../../hooks/useQuickActions'
import Skeleton from '../ui/Skeleton'
import { useNavigate } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'

export default function QuickActions() {
  const { data: actions, isLoading, error } = useQuickActions()
  const navigate = useNavigate()
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
  } const actionButtons = [
    {
      label: actions?.startTodayLabel || 'Start Today\'s Workout',
      icon: '🏋️',
      color: actions?.startTodayDisabled
        ? 'bg-gray-400 dark:bg-gray-600'
        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl',
      onClick: actions?.startToday,
      disabled: actions?.startTodayDisabled,
      primary: true
    },
    {
      label: 'Open Logger',
      icon: '📊',
      color: actions?.openLoggerDisabled
        ? 'bg-gray-400 dark:bg-gray-600'
        : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg',
      onClick: actions?.openLogger,
      disabled: actions?.openLoggerDisabled
    },
    {
      label: 'View Program',
      icon: '📈',
      color: actions?.viewProgramDisabled
        ? 'bg-gray-400 dark:bg-gray-600'
        : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg',
      onClick: actions?.viewProgram,
      disabled: actions?.viewProgramDisabled
    },
    {
      label: 'History',
      icon: <HistoryIcon className="w-4 h-4" />,
      color: 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg',
      onClick: () => navigate('/history'),
      disabled: false
    }
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      {actions?.hasPlannedSession && (
        <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg border border-red-200 dark:border-red-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-red-900 dark:text-red-100">
                Today's Session: {actions.todaySession?.name || 'Planned Workout'}
              </div>
              <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                {actions.sessionCompleted ? 'Completed ✓' : 'Ready to start'}
              </div>
            </div>
            <div className="text-2xl">
              {actions.sessionCompleted ? '✅' : '⏰'}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {actionButtons.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled} className={`
              ${action.color} text-white rounded-lg font-medium transition-all duration-300 
              flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-105 active:scale-95
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
