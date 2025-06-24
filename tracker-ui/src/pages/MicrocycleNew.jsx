import CardWrapper from "../components/ui/CardWrapper";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Microcycle() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentWeek = {
    'Monday': { 
      muscle: 'Chest & Triceps', 
      sets: 8, 
      completed: true, 
      duration: 45,
      exercises: ['Bench Press', 'Incline DB Press', 'Tricep Dips', 'Close-Grip Press'],
      workoutType: 'strength',
      muscleGroups: ['Chest', 'Triceps']
    },
    'Tuesday': { 
      muscle: 'Back & Biceps', 
      sets: 10, 
      completed: true, 
      duration: 50,
      exercises: ['Pull-ups', 'Rows', 'Lat Pulldown', 'Bicep Curls', 'Hammer Curls'],
      workoutType: 'strength',
      muscleGroups: ['Back', 'Biceps']
    },
    'Wednesday': { 
      muscle: 'Rest Day', 
      sets: 0, 
      completed: true, 
      duration: 0,
      exercises: [],
      workoutType: 'rest',
      muscleGroups: []
    },
    'Thursday': { 
      muscle: 'Shoulders', 
      sets: 6, 
      completed: false, 
      duration: 40,
      exercises: ['Overhead Press', 'Lateral Raises', 'Rear Delts', 'Shrugs'],
      workoutType: 'strength',
      muscleGroups: ['Shoulders']
    },
    'Friday': { 
      muscle: 'Legs', 
      sets: 12, 
      completed: false, 
      duration: 65,
      exercises: ['Squats', 'Romanian DL', 'Leg Press', 'Leg Curls', 'Calf Raises', 'Lunges'],
      workoutType: 'strength',
      muscleGroups: ['Quads', 'Hamstrings', 'Glutes', 'Calves']
    },
    'Saturday': { 
      muscle: 'Arms', 
      sets: 8, 
      completed: false, 
      duration: 45,
      exercises: ['Barbell Curls', 'Tricep Extensions', 'Hammer Curls', 'Dips'],
      workoutType: 'hypertrophy',
      muscleGroups: ['Biceps', 'Triceps']
    },
    'Sunday': { 
      muscle: 'Rest Day', 
      sets: 0, 
      completed: false, 
      duration: 0,
      exercises: [],
      workoutType: 'rest',
      muscleGroups: []
    }
  };

  const getWorkoutIcon = (workoutType, muscleGroup) => {
    if (workoutType === 'rest') return '😴';
    if (muscleGroup.includes('Chest')) return '💪';
    if (muscleGroup.includes('Back')) return '🏋️';
    if (muscleGroup.includes('Shoulders')) return '🔥';
    if (muscleGroup.includes('Legs') || muscleGroup.includes('Quads')) return '🦵';
    if (muscleGroup.includes('Arms') || muscleGroup.includes('Biceps')) return '💪';
    return '🏃';
  };

  const getWorkoutGradient = (workoutType, completed, isRestDay) => {
    if (isRestDay) {
      return completed 
        ? 'from-blue-600/30 to-indigo-700/20' 
        : 'from-blue-500/20 to-indigo-600/10';
    }
    if (completed) {
      return 'from-green-600/40 to-emerald-700/30';
    }
    if (workoutType === 'strength') {
      return 'from-red-500/30 to-orange-600/20';
    }
    if (workoutType === 'hypertrophy') {
      return 'from-purple-500/30 to-pink-600/20';
    }
    return 'from-gray-600/30 to-gray-700/20';
  };

  const getBorderColor = (workoutType, completed, isRestDay) => {
    if (isRestDay) {
      return completed ? 'border-blue-400/50' : 'border-blue-300/30';
    }
    if (completed) {
      return 'border-green-400/60';
    }
    if (workoutType === 'strength') {
      return 'border-red-400/50';
    }
    if (workoutType === 'hypertrophy') {
      return 'border-purple-400/50';
    }
    return 'border-gray-500/40';
  };

  const DayCard = ({ day, workout }) => {
    const isRestDay = workout.muscle === 'Rest Day';
    const gradient = getWorkoutGradient(workout.workoutType, workout.completed, isRestDay);
    const borderColor = getBorderColor(workout.workoutType, workout.completed, isRestDay);
    const workoutIcon = getWorkoutIcon(workout.workoutType, workout.muscle);

    return (
      <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-5 border ${borderColor} 
        backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl 
        ${workout.completed ? 'hover:shadow-green-500/20' : isRestDay ? 'hover:shadow-blue-500/20' : 'hover:shadow-red-500/20'}
        group cursor-pointer`}>
        
        {/* Completion Badge */}
        {workout.completed && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        )}
        
        {/* Day Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-white text-lg">{day}</h4>
            <div className="w-8 h-1 bg-gradient-to-r from-white/30 to-transparent rounded-full mt-1"></div>
          </div>
          <div className="text-3xl opacity-80">
            {workoutIcon}
          </div>
        </div>

        {/* Workout Content */}
        {isRestDay ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-blue-200 font-semibold">Recovery Day</h5>
              <div className="px-2 py-1 bg-blue-500/20 rounded-lg">
                <span className="text-blue-300 text-xs font-medium">REST</span>
              </div>
            </div>
            <p className="text-blue-100/80 text-sm">Focus on recovery and preparation</p>
            <div className="flex items-center space-x-2 text-blue-200/60 text-xs">
              <span>🧘‍♂️</span>
              <span>Stretch • Mobility • Sleep</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Workout Title */}
            <div className="flex items-center justify-between">
              <h5 className="text-white font-semibold text-base">{workout.muscle}</h5>
              <div className={`px-2 py-1 rounded-lg ${
                workout.workoutType === 'strength' ? 'bg-red-500/20' : 'bg-purple-500/20'
              }`}>
                <span className={`text-xs font-medium ${
                  workout.workoutType === 'strength' ? 'text-red-300' : 'text-purple-300'
                }`}>
                  {workout.workoutType.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Duration and Sets */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3 text-gray-200">
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{workout.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📊</span>
                  <span>{workout.sets} sets</span>
                </div>
              </div>
            </div>

            {/* Exercise Preview */}
            <div className="space-y-2">
              <p className="text-gray-300 text-xs font-medium">
                {workout.exercises.length} exercises
              </p>
              <div className="flex flex-wrap gap-1">
                {workout.muscleGroups.slice(0, 3).map((group, index) => (
                  <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-200">
                    {group}
                  </span>
                ))}
                {workout.muscleGroups.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-200">
                    +{workout.muscleGroups.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar for Completed Workouts */}
            {workout.completed && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-green-300 text-xs">Completed</span>
                  <span className="text-green-300 text-xs font-medium">100%</span>
                </div>
                <div className="w-full bg-green-900/40 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"></div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!workout.completed && (
              <button className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-200 
                ${workout.workoutType === 'strength' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                } transform hover:scale-105 shadow-lg`}>
                Start Workout
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              📅 Microcycle Planning
            </h1>
            <p className="text-gray-400 text-lg">
              Weekly training schedule and workout organization
            </p>
          </div>            {/* Current Week Calendar */}
            <CardWrapper title="Current Week" subtitle="Week 3 of Mesocycle 1">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
                {days.map(day => (
                  <DayCard key={day} day={day} workout={currentWeek[day]} />
                ))}
              </div>
            </CardWrapper>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">              {/* Weekly Summary */}
              <CardWrapper title="Weekly Summary" subtitle="Progress overview">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <span className="text-blue-400 text-lg">📊</span>
                        </div>
                        <div>
                          <span className="text-blue-200 font-medium">Total Volume</span>
                          <p className="text-blue-300/70 text-sm">Sets completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold text-xl">44</span>
                        <p className="text-blue-300 text-sm">sets</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all duration-200 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                          <span className="text-green-400 text-lg">✅</span>
                        </div>
                        <div>
                          <span className="text-green-200 font-medium">Workouts Completed</span>
                          <p className="text-green-300/70 text-sm">This week</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-bold text-xl">3/5</span>
                        <div className="w-16 bg-green-900/40 rounded-full h-2 mt-1">
                          <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300" style={{width: '60%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-xl p-4 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-200 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                          <span className="text-indigo-400 text-lg">😴</span>
                        </div>
                        <div>
                          <span className="text-indigo-200 font-medium">Rest Days</span>
                          <p className="text-indigo-300/70 text-sm">Recovery scheduled</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-indigo-400 font-bold text-xl">2</span>
                        <p className="text-indigo-300 text-sm">days</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/30 to-orange-800/20 rounded-xl p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-200 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                          <span className="text-yellow-400 text-lg">⚡</span>
                        </div>
                        <div>
                          <span className="text-yellow-200 font-medium">Fatigue Level</span>
                          <p className="text-yellow-300/70 text-sm">Current status</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-yellow-500/20 rounded-lg px-3 py-1 mb-1">
                          <span className="text-yellow-300 font-medium text-sm">MODERATE</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-yellow-400/40 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardWrapper>{/* Upcoming Workouts */}
              <CardWrapper title="Upcoming Workouts" subtitle="Next workout sessions">
                <div className="space-y-4">
                  {/* Next Workout - Featured */}
                  <div className="bg-gradient-to-br from-red-500/30 to-orange-600/20 rounded-2xl p-5 border border-red-400/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-red-400 text-2xl">🔥</span>
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">Thursday - Shoulders</h4>
                          <div className="flex items-center space-x-2 text-red-200/80 text-sm">
                            <span>⏱️ 40 min</span>
                            <span>•</span>
                            <span>📊 6 sets</span>
                            <span>•</span>
                            <span>🎯 4 exercises</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-red-500/20 rounded-lg px-3 py-1 mb-1">
                          <span className="text-red-300 text-xs font-bold">NEXT UP</span>
                        </div>
                        <span className="text-red-400 text-sm font-medium">Today</span>
                      </div>
                    </div>
                    
                    {/* Muscle Groups Preview */}
                    <div className="mb-4">
                      <p className="text-red-200/80 text-sm mb-2">Target Muscles:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-red-500/20 rounded-full text-red-200 text-sm">Shoulders</span>
                        <span className="px-3 py-1 bg-red-500/20 rounded-full text-red-200 text-sm">Delts</span>
                        <span className="px-3 py-1 bg-red-500/20 rounded-full text-red-200 text-sm">Traps</span>
                      </div>
                    </div>

                    {/* Exercise Preview */}
                    <div className="mb-4">
                      <p className="text-red-200/80 text-sm mb-2">Key Exercises:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span className="text-red-100 flex items-center"><span className="mr-1">▸</span>Overhead Press</span>
                        <span className="text-red-100 flex items-center"><span className="mr-1">▸</span>Lateral Raises</span>
                        <span className="text-red-100 flex items-center"><span className="mr-1">▸</span>Rear Delts</span>
                        <span className="text-red-100 flex items-center"><span className="mr-1">▸</span>Shrugs</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                      Start Shoulder Workout
                    </button>
                  </div>

                  {/* Other Upcoming Workouts */}
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-purple-400 text-lg">🦵</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Friday - Legs</h4>
                          <div className="flex items-center space-x-2 text-purple-200/60 text-sm">
                            <span>⏱️ 65 min</span>
                            <span>•</span>
                            <span>📊 12 sets</span>
                            <span>•</span>
                            <span>🎯 6 exercises</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs">Quads</span>
                            <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs">Hamstrings</span>
                            <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs">+2</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-purple-400 text-sm font-medium">Tomorrow</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-xl p-4 border border-pink-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-pink-400 text-lg">💪</span>
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Saturday - Arms</h4>
                          <div className="flex items-center space-x-2 text-pink-200/60 text-sm">
                            <span>⏱️ 45 min</span>
                            <span>•</span>
                            <span>📊 8 sets</span>
                            <span>•</span>
                            <span>🎯 4 exercises</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="px-2 py-1 bg-pink-500/20 rounded-full text-pink-200 text-xs">Biceps</span>
                            <span className="px-2 py-1 bg-pink-500/20 rounded-full text-pink-200 text-xs">Triceps</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-pink-400 text-sm font-medium">Sat</span>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            </div>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
