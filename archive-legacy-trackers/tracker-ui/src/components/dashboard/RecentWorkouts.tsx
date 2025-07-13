import React from 'react';

// Extended interface for recent workout data
interface RecentWorkoutData {
  id: string;
  session_type: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  total_sets: number;
  total_tonnage: number;
  avg_rir?: number;
  fatigue_rating?: number;
  notes?: string;
}

// Props interface for the component
export interface RecentWorkoutsProps {
  data?: RecentWorkoutData[];
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ 
  data,
  isLoading = false,
  error = null,
  className = "" 
}) => {
  
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="animate-pulse h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="animate-pulse h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i: number) => (
            <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="h-3 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="text-right ml-4">
                  <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                  <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error.message || 'Failed to load recent workouts'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  // Sample data if none provided
  const sampleData: RecentWorkoutData[] = [
    {
      id: '1',
      session_type: 'Push',
      start_time: '2025-06-28T10:00:00Z',
      end_time: '2025-06-28T11:30:00Z',
      duration_minutes: 90,
      total_sets: 16,
      total_tonnage: 8420,
      avg_rir: 2.3,
      fatigue_rating: 7
    },
    {
      id: '2',
      session_type: 'Pull',
      start_time: '2025-06-26T14:00:00Z',
      end_time: '2025-06-26T15:15:00Z',
      duration_minutes: 75,
      total_sets: 14,
      total_tonnage: 7680,
      avg_rir: 2.1,
      fatigue_rating: 6
    }
  ];

  const displayData: RecentWorkoutData[] = data || sampleData;

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Workouts
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last {displayData.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {displayData.map((workout: RecentWorkoutData) => (
          <div 
            key={workout.id} 
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                    {workout.session_type}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(workout.start_time)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>{workout.total_sets} sets</span>
                  <span>{formatNumber(workout.total_tonnage)} lbs</span>
                  {workout.duration_minutes && (
                    <span>{workout.duration_minutes}min</span>
                  )}
                  {workout.avg_rir && (
                    <span>RIR {workout.avg_rir}</span>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                {workout.fatigue_rating && (
                  <>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {workout.fatigue_rating}/10
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      fatigue
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty state */}
        {displayData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No recent workouts found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Start logging workouts to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentWorkouts;
