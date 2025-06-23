export default function WeekOverview() {
  // Placeholder data - will be replaced with real data from context
  const weekData = {
    currentWeek: 'Week 3/6',
    phase: 'Accumulation',
    completedSessions: 4,
    plannedSessions: 5,
    weekProgress: 80,
  };

  const dailyStatus = [
    { day: 'Mon', status: 'completed', sets: 12 },
    { day: 'Tue', status: 'completed', sets: 8 },
    { day: 'Wed', status: 'rest', sets: 0 },
    { day: 'Thu', status: 'completed', sets: 15 },
    { day: 'Fri', status: 'completed', sets: 10 },
    { day: 'Sat', status: 'planned', sets: 12 },
    { day: 'Sun', status: 'rest', sets: 0 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'planned': return 'bg-blue-500';
      case 'rest': return 'bg-gray-300 dark:bg-gray-600';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Week Overview
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {weekData.currentWeek}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {weekData.completedSessions}/{weekData.plannedSessions} sessions
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${weekData.weekProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dailyStatus.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {day.day}
            </div>
            <div className={`w-8 h-8 rounded-full ${getStatusColor(day.status)} mx-auto flex items-center justify-center`}>
              {day.status === 'completed' && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
              {day.status === 'planned' && (
                <span className="text-white text-xs font-bold">•</span>
              )}
            </div>
            {day.sets > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {day.sets} sets
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Phase: {weekData.phase}
        </div>
        <div className="text-xs text-blue-700 dark:text-blue-300">
          Focus on volume progression this week
        </div>
      </div>
    </div>
  );
}
