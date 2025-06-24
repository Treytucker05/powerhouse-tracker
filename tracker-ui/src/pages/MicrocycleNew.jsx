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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Enhanced Page Header */}
          <div className="relative bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-indigo-900/40 border-b border-gray-700/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
            <div className="relative px-8 py-12">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-blue-400/30">
                        <span className="text-4xl">📅</span>
                      </div>
                      <div>
                        <h1 className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                          Microcycle Planning
                        </h1>
                        <p className="text-gray-300 text-xl font-medium">
                          Weekly training schedule and workout organization
                        </p>
                      </div>
                    </div>
                    
                    {/* Week Progress Indicator */}
                    <div className="flex items-center space-x-6 mt-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-300 font-semibold">Week 3 Active</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-blue-300">Mesocycle 1</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-purple-300">Hypertrophy Phase</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="hidden lg:flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">3/5</div>
                      <div className="text-sm text-gray-400">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">44</div>
                      <div className="text-sm text-gray-400">Total Sets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">285</div>
                      <div className="text-sm text-gray-400">Minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
            {/* Current Week Calendar */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Weekly Schedule</h2>
                  <p className="text-gray-400">Your training plan for this week</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg px-4 py-2 border border-green-500/30">
                    <span className="text-green-300 text-sm font-medium">60% Complete</span>
                  </div>
                </div>
              </div>
              
              <CardWrapper title="Current Week" subtitle="Week 3 of Mesocycle 1" className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-600/50">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
                  {days.map(day => (
                    <DayCard key={day} day={day} workout={currentWeek[day]} />
                  ))}
                </div>
              </CardWrapper>
            </section>

            {/* Analytics and Insights Section */}
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h2>
                <p className="text-gray-400">Track your progress and plan ahead</p>
              </div>
              
              <div className="grid gap-8 grid-cols-1 xl:grid-cols-3">                {/* Weekly Summary - Enhanced Dashboard Cards */}
                <div className="xl:col-span-1">
                  <CardWrapper title="Weekly Dashboard" subtitle="Performance metrics" className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-600/50 h-full">
                    <div className="space-y-6">
                      {/* Total Volume Card with Circular Progress */}
                      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/40 rounded-2xl p-6 border border-blue-500/40 hover:border-blue-400/60 transition-all duration-300 group shadow-lg hover:shadow-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <span className="text-blue-400 text-2xl">📊</span>
                            </div>
                            <div>
                              <h3 className="text-blue-200 font-bold text-lg">Total Volume</h3>
                              <p className="text-blue-300/70 text-sm">Sets completed this week</p>
                            </div>
                          </div>
                          {/* Circular Progress Indicator */}
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-blue-900/40"/>
                              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-blue-400" strokeDasharray="175.92" strokeDashoffset="52.77" style={{transition: 'stroke-dashoffset 0.5s ease-in-out'}}/>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-blue-200 font-bold text-sm">70%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-white font-bold text-3xl">44</span>
                            <span className="text-blue-300 text-lg ml-1">/ 63 sets</span>
                          </div>
                          <div className="text-right">
                            <div className="bg-blue-500/20 rounded-lg px-3 py-1">
                              <span className="text-blue-300 text-xs font-medium">+12 from last week</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Completion Rate Card with Gauge */}
                      <div className="bg-gradient-to-br from-green-900/50 to-emerald-800/40 rounded-2xl p-6 border border-green-500/40 hover:border-green-400/60 transition-all duration-300 group shadow-lg hover:shadow-green-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <span className="text-green-400 text-2xl">✅</span>
                            </div>
                            <div>
                              <h3 className="text-green-200 font-bold text-lg">Completion Rate</h3>
                              <p className="text-green-300/70 text-sm">Workouts finished</p>
                            </div>
                          </div>
                          {/* Semi-circular Gauge */}
                          <div className="relative">
                            <svg width="64" height="32" viewBox="0 0 64 32" className="overflow-visible">
                              <path d="M 8 28 A 24 24 0 0 1 56 28" fill="none" stroke="currentColor" strokeWidth="4" className="text-green-900/40"/>
                              <path d="M 8 28 A 24 24 0 0 1 42.24 16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-green-400"/>
                            </svg>
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                              <span className="text-green-200 font-bold text-sm">60%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-white font-bold text-3xl">3</span>
                            <span className="text-green-300 text-lg ml-1">/ 5 workouts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-400/30 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-400/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Recovery Status Card */}
                      <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/40 rounded-2xl p-6 border border-indigo-500/40 hover:border-indigo-400/60 transition-all duration-300 group shadow-lg hover:shadow-indigo-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <span className="text-indigo-400 text-2xl">😴</span>
                            </div>
                            <div>
                              <h3 className="text-indigo-200 font-bold text-lg">Recovery</h3>
                              <p className="text-indigo-300/70 text-sm">Rest & restoration</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-indigo-500/20 rounded-xl px-4 py-2">
                              <span className="text-indigo-300 font-bold text-xl">2</span>
                              <p className="text-indigo-400 text-xs">rest days</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-indigo-800/30 rounded-lg p-3 text-center">
                            <div className="text-indigo-300 text-xs mb-1">Sleep Quality</div>
                            <div className="text-indigo-200 font-bold">8.2/10</div>
                          </div>
                          <div className="bg-indigo-800/30 rounded-lg p-3 text-center">
                            <div className="text-indigo-300 text-xs mb-1">HRV Score</div>
                            <div className="text-indigo-200 font-bold">Good</div>
                          </div>
                        </div>
                      </div>

                      {/* Fatigue Level Card with Visual Gauge */}
                      <div className="bg-gradient-to-br from-amber-900/50 to-orange-800/40 rounded-2xl p-6 border border-amber-500/40 hover:border-amber-400/60 transition-all duration-300 group shadow-lg hover:shadow-amber-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                              <span className="text-amber-400 text-2xl">⚡</span>
                            </div>
                            <div>
                              <h3 className="text-amber-200 font-bold text-lg">Energy Level</h3>
                              <p className="text-amber-300/70 text-sm">Current readiness</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-amber-500/20 rounded-xl px-4 py-2 mb-2">
                              <span className="text-amber-300 font-bold text-sm">MODERATE</span>
                            </div>
                          </div>
                        </div>
                        {/* Energy Level Bars */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-amber-300/70">
                            <span>Energy</span>
                            <span>6/10</span>
                          </div>
                          <div className="w-full bg-amber-900/40 rounded-full h-3">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-500" style={{width: '60%'}}></div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-amber-300/70">
                            <span>Ready for next workout</span>
                            <span className="text-amber-400 font-medium">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </div>

                {/* Upcoming Workouts - Enhanced */}
                <div className="xl:col-span-2">
                  <CardWrapper title="Upcoming Workouts" subtitle="Next workout sessions" className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30 h-full">
                    <div className="space-y-6">                      {/* Next Workout - Featured with Enhanced Dashboard Style */}
                      <div className="bg-gradient-to-br from-red-500/30 to-orange-600/20 rounded-2xl p-6 border border-red-400/50 backdrop-blur-sm shadow-2xl hover:shadow-red-500/20 transition-all duration-300 group relative overflow-hidden">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent"></div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-700"></div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span className="text-red-400 text-3xl animate-pulse">🔥</span>
                              </div>
                              <div>
                                <h4 className="text-white font-bold text-2xl mb-1 group-hover:text-red-100 transition-colors">Thursday - Shoulders</h4>
                                <div className="flex items-center space-x-4 text-red-200/80 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-red-400">⏱️</span>
                                    <span className="font-medium">40 min</span>
                                  </div>
                                  <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-red-400">📊</span>
                                    <span className="font-medium">6 sets</span>
                                  </div>
                                  <div className="w-1 h-1 bg-red-300 rounded-full"></div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-red-400">🎯</span>
                                    <span className="font-medium">4 exercises</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="bg-gradient-to-r from-red-500/30 to-red-400/20 rounded-xl px-4 py-2 mb-2 border border-red-400/30 backdrop-blur-sm">
                                <span className="text-red-200 text-sm font-bold">NEXT UP</span>
                              </div>
                              <div className="flex items-center justify-end space-x-2">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                <span className="text-red-300 text-sm font-medium">Today • 2:30 PM</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Muscle Groups Preview */}
                          <div className="mb-6">
                            <p className="text-red-200/80 text-sm mb-3 font-medium">Target Muscles:</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-4 py-2 bg-gradient-to-r from-red-500/30 to-red-400/20 rounded-full text-red-200 text-sm font-medium border border-red-400/30 hover:border-red-300/50 transition-all duration-200 hover:scale-105">
                                💪 Shoulders
                              </span>
                              <span className="px-4 py-2 bg-gradient-to-r from-red-500/30 to-red-400/20 rounded-full text-red-200 text-sm font-medium border border-red-400/30 hover:border-red-300/50 transition-all duration-200 hover:scale-105">
                                🎯 Delts
                              </span>
                              <span className="px-4 py-2 bg-gradient-to-r from-red-500/30 to-red-400/20 rounded-full text-red-200 text-sm font-medium border border-red-400/30 hover:border-red-300/50 transition-all duration-200 hover:scale-105">
                                ⚡ Traps
                              </span>
                            </div>
                          </div>

                          {/* Enhanced Exercise Preview with Progress Indicators */}
                          <div className="mb-6">
                            <p className="text-red-200/80 text-sm mb-3 font-medium">Key Exercises:</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-red-500/10 rounded-xl p-3 border border-red-400/20 hover:border-red-300/40 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-red-100 flex items-center font-medium">
                                    <span className="mr-2 text-red-400">▸</span>Overhead Press
                                  </span>
                                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                </div>
                                <div className="text-red-300/60 text-xs mt-1">3 sets • 8-10 reps</div>
                              </div>
                              <div className="bg-red-500/10 rounded-xl p-3 border border-red-400/20 hover:border-red-300/40 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-red-100 flex items-center font-medium">
                                    <span className="mr-2 text-red-400">▸</span>Lateral Raises
                                  </span>
                                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                </div>
                                <div className="text-red-300/60 text-xs mt-1">2 sets • 12-15 reps</div>
                              </div>
                              <div className="bg-red-500/10 rounded-xl p-3 border border-red-400/20 hover:border-red-300/40 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-red-100 flex items-center font-medium">
                                    <span className="mr-2 text-red-400">▸</span>Rear Delts
                                  </span>
                                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                </div>
                                <div className="text-red-300/60 text-xs mt-1">2 sets • 10-12 reps</div>
                              </div>
                              <div className="bg-red-500/10 rounded-xl p-3 border border-red-400/20 hover:border-red-300/40 transition-all duration-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-red-100 flex items-center font-medium">
                                    <span className="mr-2 text-red-400">▸</span>Shrugs
                                  </span>
                                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                </div>
                                <div className="text-red-300/60 text-xs mt-1">1 set • 15 reps</div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Call-to-Action */}
                          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-red-500/30 group-hover:shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                              <span className="text-lg">🚀</span>
                              <span>Start Shoulder Workout</span>
                              <span className="text-lg">💪</span>
                            </div>
                          </button>
                        </div>
                      </div>                      {/* Enhanced Upcoming Workout Cards */}
                      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                        {/* Friday - Legs Workout Card */}
                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-5 border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 group shadow-lg hover:shadow-purple-500/20 relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-300/20 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
                          </div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md">
                                  <span className="text-purple-400 text-2xl">🦵</span>
                                </div>
                                <div>
                                  <h4 className="text-white font-bold text-lg mb-1">Friday - Legs</h4>
                                  <div className="flex items-center space-x-3 text-purple-200/70 text-xs">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-purple-400">⏱️</span>
                                      <span className="font-medium">65 min</span>
                                    </div>
                                    <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-purple-400">📊</span>
                                      <span className="font-medium">12 sets</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="bg-purple-500/20 rounded-lg px-3 py-1 mb-1 border border-purple-400/20">
                                  <span className="text-purple-300 text-xs font-bold">HIGH INTENSITY</span>
                                </div>
                                <span className="text-purple-400 text-sm font-medium">Tomorrow</span>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-purple-300/70 mb-2">
                                <span>Preparation</span>
                                <span>Ready</span>
                              </div>
                              <div className="w-full bg-purple-900/40 rounded-full h-2">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs font-medium border border-purple-400/20">
                                🎯 Quads
                              </span>
                              <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs font-medium border border-purple-400/20">
                                💪 Hamstrings
                              </span>
                              <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-200 text-xs font-medium border border-purple-400/20">
                                ⚡ +2 more
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Saturday - Arms Workout Card */}
                        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-2xl p-5 border border-pink-400/30 hover:border-pink-300/50 transition-all duration-300 group shadow-lg hover:shadow-pink-500/20 relative overflow-hidden">
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-300/20 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
                          </div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-pink-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-md">
                                  <span className="text-pink-400 text-2xl">💪</span>
                                </div>
                                <div>
                                  <h4 className="text-white font-bold text-lg mb-1">Saturday - Arms</h4>
                                  <div className="flex items-center space-x-3 text-pink-200/70 text-xs">
                                    <div className="flex items-center space-x-1">
                                      <span className="text-pink-400">⏱️</span>
                                      <span className="font-medium">45 min</span>
                                    </div>
                                    <div className="w-1 h-1 bg-pink-300 rounded-full"></div>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-pink-400">📊</span>
                                      <span className="font-medium">8 sets</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="bg-pink-500/20 rounded-lg px-3 py-1 mb-1 border border-pink-400/20">
                                  <span className="text-pink-300 text-xs font-bold">MODERATE</span>
                                </div>
                                <span className="text-pink-400 text-sm font-medium">Saturday</span>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-pink-300/70 mb-2">
                                <span>Equipment Check</span>
                                <span>Scheduled</span>
                              </div>
                              <div className="w-full bg-pink-900/40 rounded-full h-2">
                                <div className="bg-gradient-to-r from-pink-500 to-pink-400 h-2 rounded-full transition-all duration-500" style={{width: '65%'}}></div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-200 text-xs font-medium border border-pink-400/20">
                                💪 Biceps
                              </span>
                              <span className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-200 text-xs font-medium border border-pink-400/20">
                                🎯 Triceps
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </div>
              </div>
            </section>
          </div>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
