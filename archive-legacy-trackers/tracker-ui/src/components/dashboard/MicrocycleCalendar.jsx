import { useState } from 'react';

export default function MicrocycleCalendar() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const workoutTemplates = [
    { name: 'Upper Body', exercises: ['Bench Press', 'Rows', 'Overhead Press', 'Pull-ups'], color: 'bg-blue-500' },
    { name: 'Lower Body', exercises: ['Squats', 'Deadlifts', 'Lunges', 'Calf Raises'], color: 'bg-green-500' },
    { name: 'Push', exercises: ['Bench Press', 'Overhead Press', 'Dips', 'Triceps'], color: 'bg-purple-500' },
    { name: 'Pull', exercises: ['Rows', 'Pull-ups', 'Lat Pulldowns', 'Biceps'], color: 'bg-orange-500' },
    { name: 'Legs', exercises: ['Squats', 'Leg Press', 'Hamstring Curls', 'Calves'], color: 'bg-red-500' },
    { name: 'Rest', exercises: [], color: 'bg-gray-400' }
  ];

  const [weekSchedule, setWeekSchedule] = useState({
    Monday: workoutTemplates[0],
    Tuesday: workoutTemplates[1],
    Wednesday: workoutTemplates[5], // Rest
    Thursday: workoutTemplates[0],
    Friday: workoutTemplates[1],
    Saturday: workoutTemplates[5], // Rest
    Sunday: workoutTemplates[5] // Rest
  });

  const handleDayClick = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  const handleWorkoutAssignment = (day, workout) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: workout
    }));
    setSelectedDay(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Week {currentWeek}
          </span>
          <button
            onClick={() => setCurrentWeek(Math.min(6, currentWeek + 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {daysOfWeek.map(day => {
          const workout = weekSchedule[day];
          const isSelected = selectedDay === day;
          
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-red-500 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                bg-white dark:bg-gray-800
              `}
            >
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                {day.slice(0, 3)}
              </div>
              
              <div className={`w-full h-16 rounded ${workout.color} flex items-center justify-center mb-2`}>
                <span className="text-white text-xs font-medium text-center">
                  {workout.name}
                </span>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {workout.exercises.length > 0 ? `${workout.exercises.length} exercises` : 'Rest day'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workout Assignment Panel */}
      {selectedDay && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Assign workout for {selectedDay}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {workoutTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleWorkoutAssignment(selectedDay, template)}
                className={`p-3 rounded-lg border-2 text-left transition-colors
                  ${weekSchedule[selectedDay]?.name === template.name
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
              >
                <div className={`w-full h-6 rounded ${template.color} mb-2`}></div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {template.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {template.exercises.length > 0 ? `${template.exercises.length} exercises` : 'Recovery'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Volume Summary */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Weekly Training Summary
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Training Days:</span>
            <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
              {Object.values(weekSchedule).filter(w => w.exercises.length > 0).length}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Rest Days:</span>
            <span className="ml-2 font-medium text-blue-900 dark:text-blue-100">
              {Object.values(weekSchedule).filter(w => w.exercises.length === 0).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
