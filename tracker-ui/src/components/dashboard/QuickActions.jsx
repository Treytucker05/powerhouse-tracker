export default function QuickActions() {
  const actions = [
    { label: 'Start Workout', icon: '▶️', color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Log Sets', icon: '📊', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Analyze Week', icon: '📈', color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Export Data', icon: '💾', color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white rounded-lg p-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2`}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
