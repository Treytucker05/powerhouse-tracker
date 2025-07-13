import React from 'react';

// Interface for action button data
interface ActionButton {
  label: string;
  icon: string;
  color: string;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
}

// Interface for quick actions data
interface QuickActionsData {
  startTodayLabel?: string;
  startTodayDisabled?: boolean;
  startToday?: () => void;
  openLoggerDisabled?: boolean;
  openLogger?: () => void;
  viewProgressDisabled?: boolean;
  viewProgress?: () => void;
}

// Props interface for the component
export interface QuickActionsProps {
  data?: QuickActionsData;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  data,
  isLoading = false,
  error = null,
  className = ""
}) => {
  
  if (isLoading) {
    return (
      <div className={className}>
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 3 }, (_, i: number) => (
              <div key={i} className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 text-sm">Failed to load actions</p>
        </div>
      </div>
    );
  }

  // Generate action buttons with proper typing
  const actionButtons: ActionButton[] = [
    { 
      label: data?.startTodayLabel || 'Start Today\'s Workout', 
      icon: '🏋️', 
      color: data?.startTodayDisabled 
        ? 'bg-gray-400 dark:bg-gray-600' 
        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl',
      onClick: data?.startToday,
      disabled: data?.startTodayDisabled,
      primary: true
    },
    { 
      label: 'Open Logger', 
      icon: '📊', 
      color: data?.openLoggerDisabled 
        ? 'bg-gray-400 dark:bg-gray-600' 
        : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-md hover:shadow-lg',
      onClick: data?.openLogger,
      disabled: data?.openLoggerDisabled
    },
    { 
      label: 'View Progress', 
      icon: '📈', 
      color: data?.viewProgressDisabled 
        ? 'bg-gray-400 dark:bg-gray-600' 
        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg',
      onClick: data?.viewProgress,
      disabled: data?.viewProgressDisabled
    }
  ];

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {actionButtons.map((action: ActionButton, index: number) => (
          <button
            key={`${action.label}-${index}`}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              ${action.color}
              ${action.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              ${action.primary ? 'ring-2 ring-red-500/20' : ''}
              flex items-center justify-center space-x-3 px-4 py-3 rounded-lg
              text-white font-medium text-sm transition-all duration-200
              transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/20
            `}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
