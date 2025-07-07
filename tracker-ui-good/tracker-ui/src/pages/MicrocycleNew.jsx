import CardWrapper from "../components/ui/CardWrapper";
import { TrainingStateProvider } from "../context/TrainingStateContext.jsx";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumb from "../components/navigation/Breadcrumb";
import SectionDivider from "../components/ui/SectionDivider";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { PlanningActions } from "../components/ui/fabHelpers";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import { useState, useEffect, memo, useCallback } from "react";
import { CalendarIcon, ClockIcon, FireIcon, PlayIcon } from '@heroicons/react/24/outline';

export default function Microcycle() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
  const getWorkoutIcon = useCallback((workoutType, muscleGroup) => {
    if (workoutType === 'rest') return '😴';
    if (muscleGroup.includes('Chest')) return '💪';
    if (muscleGroup.includes('Back')) return '🏋️';
    if (muscleGroup.includes('Shoulders')) return '🔥';
    if (muscleGroup.includes('Legs') || muscleGroup.includes('Quads')) return '🦵';
    if (muscleGroup.includes('Arms') || muscleGroup.includes('Biceps')) return '💪';
    return '🏃';
  }, []);

  const getWorkoutGradient = useCallback((workoutType, completed, isRestDay) => {
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
  }, []);

  const getBorderColor = useCallback((workoutType, completed, isRestDay) => {
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
  }, []); const DayCard = memo(({ day, workout }) => {
    const isRestDay = workout.muscle === 'Rest Day';
    const gradient = getWorkoutGradient(workout.workoutType, workout.completed, isRestDay);
    const borderColor = getBorderColor(workout.workoutType, workout.completed, isRestDay);
    const workoutIcon = getWorkoutIcon(workout.workoutType, workout.muscle);

    return (
      <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-5 border ${borderColor} 
        backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-xl will-change-transform
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
              <div className={`px-2 py-1 rounded-lg ${workout.workoutType === 'strength' ? 'bg-red-500/20' : 'bg-purple-500/20'
                }`}>
                <span className={`text-xs font-medium ${workout.workoutType === 'strength' ? 'text-red-300' : 'text-purple-300'
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
            )}            {/* Action Button */}
            {!workout.completed && (
              <button className={`mt-4 w-full py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-150 will-change-transform
                ${workout.workoutType === 'strength'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                } transform hover:scale-[1.02] shadow-lg`}>
                Start Workout
              </button>
            )}
          </div>)}
      </div>
    );
  });

  DayCard.displayName = 'DayCard';
  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Enhanced Navigation */}
          <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <Breadcrumb />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">            {isLoading ? (
            <div className="space-y-8">
              <LoadingSkeleton type="card" className="h-32" />
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 min-h-[200px]">
                <LoadingSkeleton type="workout-card" count={7} />
              </div>
              <div className="grid gap-6 md:grid-cols-2 min-h-[300px]">
                <LoadingSkeleton type="card" className="h-64" />
                <LoadingSkeleton type="card" className="h-64" />
              </div>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <div className="text-center space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-blue-400/30 glass-morphism">
                    <span className="text-4xl">📅</span>
                  </div>
                  <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Microcycle Planning
                    </h1>
                    <p className="text-gray-300 text-xl">
                      Weekly training schedule and workout organization
                    </p>
                  </div>
                </div>

                {/* Week Progress Indicator */}
                <div className="flex items-center justify-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-green-400 font-medium text-sm">Week 2 of 4</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-blue-400 font-medium text-sm">Hypertrophy Phase</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span className="text-yellow-400 font-medium text-sm">2/7 Completed</span>
                  </div>
                </div>
              </div>

              <SectionDivider
                title="Weekly Schedule"
                icon={CalendarIcon}
                gradient={true}
              />

              {/* Weekly Schedule Grid */}
              <div className="space-y-8">
                <CardWrapper
                  title="This Week's Training Plan"
                  className="glass-morphism premium-card animate-slide-in-up"                  >                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                    {days.map((day) => (
                      <DayCard key={day} day={day} workout={currentWeek[day]} />
                    ))}
                  </div>
                </CardWrapper>
              </div>

              <SectionDivider
                title="Weekly Analytics"
                icon={FireIcon}
                gradient={true}
              />

              {/* Weekly Summary and Upcoming */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* Weekly Summary */}
                <CardWrapper
                  title="Weekly Summary"
                  className="glass-morphism premium-card animate-slide-in-left"
                >
                  <div className="space-y-6">
                    {/* Progress Ring */}
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="transform -rotate-90 w-32 h-32">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-700"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - 2 / 7)}`}
                            className="text-blue-500 progress-ring"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">29%</div>
                            <div className="text-xs text-gray-400">Complete</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-4 rounded-xl text-center glass-morphism-subtle">
                        <div className="text-2xl font-bold text-green-400">2</div>
                        <div className="text-xs text-gray-400">Completed</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-4 rounded-xl text-center glass-morphism-subtle">
                        <div className="text-2xl font-bold text-blue-400">95</div>
                        <div className="text-xs text-gray-400">Total Minutes</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-4 rounded-xl text-center glass-morphism-subtle">
                        <div className="text-2xl font-bold text-purple-400">18</div>
                        <div className="text-xs text-gray-400">Sets Done</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-4 rounded-xl text-center glass-morphism-subtle">
                        <div className="text-2xl font-bold text-orange-400">5</div>
                        <div className="text-xs text-gray-400">Remaining</div>
                      </div>
                    </div>

                    {/* Muscle Groups Trained */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Muscle Groups Trained</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Chest', 'Triceps', 'Back', 'Biceps'].map((muscle) => (
                          <span key={muscle} className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 glass-morphism-subtle">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardWrapper>

                {/* Upcoming Workouts */}
                <CardWrapper
                  title="Upcoming Workouts"
                  className="glass-morphism premium-card animate-slide-in-right"
                >
                  <div className="space-y-4">
                    {/* Next Workout */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 p-6 rounded-xl border border-blue-500/30 glass-morphism-subtle">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 text-xl">💪</span>
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">Thursday - Shoulders</h4>
                            <p className="text-gray-400 text-sm">Next workout</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-400 font-bold">6 sets</div>
                          <div className="text-gray-400 text-xs">~40 min</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Overhead Press', 'Lateral Raises', 'Rear Delts'].map((exercise) => (
                          <span key={exercise} className="px-2 py-1 bg-blue-900/30 rounded text-xs text-blue-300">
                            {exercise}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Remaining Workouts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg glass-morphism-subtle">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">🦵</span>
                          <div>
                            <span className="text-white font-medium">Friday - Legs</span>
                            <div className="text-gray-400 text-xs">12 sets • ~65 min</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-orange-400 text-sm font-medium">High</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg glass-morphism-subtle">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">💪</span>
                          <div>
                            <span className="text-white font-medium">Saturday - Arms</span>
                            <div className="text-gray-400 text-xs">8 sets • ~45 min</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-green-400 text-sm font-medium">Moderate</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg glass-morphism-subtle">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">😴</span>
                          <div>
                            <span className="text-white font-medium">Sunday - Rest</span>
                            <div className="text-gray-400 text-xs">Recovery day</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 text-sm font-medium">Rest</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardWrapper>
              </div>
            </>
          )}
          </div>

          {/* Floating Action Button */}
          <FloatingActionButton
            actions={PlanningActions.microcycle}
            position="bottom-right"
            color="green"
          />        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
