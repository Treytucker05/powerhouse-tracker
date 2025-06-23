import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import CardWrapper from "../components/dashboard/CardWrapper";
import MicrocycleCalendar from "../components/dashboard/MicrocycleCalendar";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Microcycle() {
  const trainingSplits = [
    { name: 'Upper/Lower', description: '4-day split alternating upper and lower body', sessions: 4 },
    { name: 'Push/Pull/Legs', description: '6-day split focusing on movement patterns', sessions: 6 },
    { name: 'Full Body', description: '3-day split training all muscle groups', sessions: 3 },
    { name: 'Body Part Split', description: '5-6 day split isolating muscle groups', sessions: 5 }
  ];

  const volumeDistribution = {
    'Chest': 18,
    'Back': 20,
    'Shoulders': 16,
    'Arms': 14,
    'Legs': 22,
    'Core': 12
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <NavBar />
          <main className="container py-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Microcycle Planning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Design your weekly training schedule and exercise distribution
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Training Calendar - Takes up 2 columns */}
              <CardWrapper className="lg:col-span-2">
                <MicrocycleCalendar />
              </CardWrapper>

              {/* Training Split Selector */}
              <CardWrapper>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Training Split
                </h3>
                
                <div className="space-y-3">
                  {trainingSplits.map((split, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {split.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {split.sessions} sessions/week
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {split.description}
                      </p>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Apply Split Template
                </button>
              </CardWrapper>

              {/* Volume Distribution */}
              <CardWrapper className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Weekly Volume Distribution
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(volumeDistribution).map(([muscle, sets]) => {
                    const maxSets = Math.max(...Object.values(volumeDistribution));
                    const percentage = (sets / maxSets) * 100;
                    
                    return (
                      <div key={muscle} className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {muscle}
                        </div>
                        <div className="relative h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2">
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-lg transition-all duration-300"
                            style={{ height: `${percentage}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                            {sets}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          sets/week
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total weekly sets: {Object.values(volumeDistribution).reduce((a, b) => a + b, 0)}
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Optimize Distribution
                  </button>
                </div>
              </CardWrapper>

              {/* Exercise Library */}
              <CardWrapper>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Exercise Assignment
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Muscle Group
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>Chest</option>
                      <option>Back</option>
                      <option>Shoulders</option>
                      <option>Arms</option>
                      <option>Legs</option>
                      <option>Core</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Exercise
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>Bench Press</option>
                      <option>Incline Dumbbell Press</option>
                      <option>Dips</option>
                      <option>Push-ups</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sets
                      </label>
                      <input
                        type="number"
                        defaultValue={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rep Range
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>6-8</option>
                        <option>8-10</option>
                        <option>10-12</option>
                        <option>12-15</option>
                      </select>
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Add to Schedule
                  </button>
                </div>

                {/* Quick Templates */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Quick Templates
                  </h4>
                  <div className="space-y-2">
                    {['Push Day', 'Pull Day', 'Leg Day', 'Upper Body', 'Full Body'].map(template => (
                      <button
                        key={template}
                        className="w-full text-left px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {template}
                      </button>
                    ))}
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
