export default function RecentWorkouts({ className = "" }) {
  // Placeholder data for recent workouts
  const recentWorkouts = [
    {
      id: 1,
      date: "2025-06-20",
      name: "Push Day A",
      duration: "68 mins",
      exercises: 6,
      sets: 18,
      volume: 8250,
      completed: true
    },
    {
      id: 2,
      date: "2025-06-18",
      name: "Pull Day A",
      duration: "72 mins",
      exercises: 5,
      sets: 16,
      volume: 7890,
      completed: true
    },
    {
      id: 3,
      date: "2025-06-16",
      name: "Legs & Core",
      duration: "81 mins",
      exercises: 7,
      sets: 20,
      volume: 12300,
      completed: true
    },
    {
      id: 4,
      date: "2025-06-14",
      name: "Push Day B",
      duration: "65 mins",
      exercises: 6,
      sets: 17,
      volume: 7950,
      completed: false
    }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Workouts
        </h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentWorkouts.map((workout) => (
          <div 
            key={workout.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {workout.name}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  workout.completed 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {workout.completed ? 'Completed' : 'Incomplete'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{workout.date}</span>
                <span>•</span>
                <span>{workout.duration}</span>
                <span>•</span>
                <span>{workout.exercises} exercises</span>
                <span>•</span>
                <span>{workout.sets} sets</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {workout.volume.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                lbs volume
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Total this week
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            36,390 lbs
          </span>
        </div>
      </div>
    </div>
  );
}
