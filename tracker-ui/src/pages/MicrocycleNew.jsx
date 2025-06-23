import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import CardWrapper from "../components/ui/CardWrapper";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Microcycle() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentWeek = {
    'Monday': { muscle: 'Chest & Triceps', sets: 8, completed: true },
    'Tuesday': { muscle: 'Back & Biceps', sets: 10, completed: true },
    'Wednesday': { muscle: 'Rest Day', sets: 0, completed: true },
    'Thursday': { muscle: 'Shoulders', sets: 6, completed: false },
    'Friday': { muscle: 'Legs', sets: 12, completed: false },
    'Saturday': { muscle: 'Arms', sets: 8, completed: false },
    'Sunday': { muscle: 'Rest Day', sets: 0, completed: false }
  };

  const DayCard = ({ day, workout }) => (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
      workout.completed 
        ? 'bg-green-900/20 border-green-500 shadow-green-500/20' 
        : workout.muscle === 'Rest Day'
        ? 'bg-blue-900/20 border-blue-500 shadow-blue-500/20'
        : 'bg-gray-700 border-gray-600 hover:border-red-500'
    } shadow-lg`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white">{day}</h4>
        {workout.completed && (
          <span className="text-green-400 text-xl">✓</span>
        )}
      </div>
      <p className="text-gray-300 text-sm mb-1">{workout.muscle}</p>
      {workout.sets > 0 && (
        <p className="text-gray-400 text-xs">{workout.sets} sets planned</p>
      )}
      {!workout.completed && workout.muscle !== 'Rest Day' && (
        <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded transition-colors">
          Start Workout
        </button>
      )}
    </div>
  );

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-900">
          <Header />
          <NavBar />
          <main className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                📅 Microcycle Planning
              </h1>
              <p className="text-gray-400 text-lg">
                Weekly training schedule and workout organization
              </p>
            </div>

            {/* Current Week Calendar */}
            <CardWrapper title="Current Week" subtitle="Week 3 of Mesocycle 1">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                {days.map(day => (
                  <DayCard key={day} day={day} workout={currentWeek[day]} />
                ))}
              </div>
            </CardWrapper>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Weekly Summary */}
              <CardWrapper title="Weekly Summary" subtitle="Progress overview">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Total Volume</span>
                    <span className="text-white font-semibold">44 sets</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Workouts Completed</span>
                    <span className="text-green-400 font-semibold">3/5</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Rest Days</span>
                    <span className="text-blue-400 font-semibold">2</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Fatigue Level</span>
                    <span className="text-yellow-400 font-semibold">Moderate</span>
                  </div>
                </div>
              </CardWrapper>

              {/* Upcoming Workouts */}
              <CardWrapper title="Upcoming Workouts" subtitle="Next 3 sessions">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-700 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">Thursday - Shoulders</h4>
                        <p className="text-gray-400 text-sm">6 sets • 45 min</p>
                      </div>
                      <span className="text-red-400 text-sm">Today</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg border-l-4 border-orange-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">Friday - Legs</h4>
                        <p className="text-gray-400 text-sm">12 sets • 60 min</p>
                      </div>
                      <span className="text-orange-400 text-sm">Tomorrow</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">Saturday - Arms</h4>
                        <p className="text-gray-400 text-sm">8 sets • 40 min</p>
                      </div>
                      <span className="text-yellow-400 text-sm">Sat</span>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            </div>
          </main>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
