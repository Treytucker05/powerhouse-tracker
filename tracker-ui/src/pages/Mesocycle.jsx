import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import CardWrapper from "../components/dashboard/CardWrapper";
import MesocycleBuilder from "../components/dashboard/MesocycleBuilder";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Mesocycle() {
  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  
  const volumeLandmarks = {
    'Chest': { mev: 8, mav: 18, mrv: 22 },
    'Back': { mev: 10, mav: 20, mrv: 25 },
    'Shoulders': { mev: 8, mav: 16, mrv: 20 },
    'Arms': { mev: 6, mav: 14, mrv: 18 },
    'Legs': { mev: 12, mav: 22, mrv: 28 },
    'Core': { mev: 0, mav: 12, mrv: 16 }
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
                Mesocycle Planning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Plan and configure your training blocks (3-6 weeks)
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Mesocycle Builder */}
              <CardWrapper>
                <MesocycleBuilder />
              </CardWrapper>

              {/* Volume Landmarks Editor */}
              <CardWrapper>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Volume Landmarks
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Configure your Minimum Effective Volume (MEV), Maximum Adaptive Volume (MAV), and Maximum Recoverable Volume (MRV) for each muscle group.
                </p>
                
                <div className="space-y-4">
                  {muscleGroups.map(muscle => (
                    <div key={muscle} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">{muscle}</h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400">sets/week</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">MEV</label>
                          <input
                            type="number"
                            defaultValue={volumeLandmarks[muscle].mev}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">MAV</label>
                          <input
                            type="number"
                            defaultValue={volumeLandmarks[muscle].mav}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">MRV</label>
                          <input
                            type="number"
                            defaultValue={volumeLandmarks[muscle].mrv}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Save Volume Landmarks
                </button>
              </CardWrapper>

              {/* Weekly Progression Planner */}
              <CardWrapper className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Weekly Volume Progression
                </h3>
                
                <div className="grid grid-cols-6 gap-4">
                  {Array.from({ length: 6 }, (_, weekIndex) => (
                    <div key={weekIndex} className="text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Week {weekIndex + 1}
                      </div>
                      <div className="space-y-2">
                        {muscleGroups.slice(0, 3).map(muscle => {
                          const baseVolume = volumeLandmarks[muscle].mev;
                          const weekVolume = Math.round(baseVolume + (weekIndex * 2));
                          return (
                            <div key={muscle} className="text-xs">
                              <div className="text-gray-600 dark:text-gray-400">{muscle}</div>
                              <div className="font-medium text-gray-900 dark:text-white">{weekVolume} sets</div>
                            </div>
                          );
                        })}
                      </div>
                      {weekIndex === 5 && (
                        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Deload
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardWrapper>

              {/* Deload Scheduler */}
              <CardWrapper>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Deload Planning
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deload Strategy
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option value="volume">Volume Reduction (50% sets)</option>
                      <option value="intensity">Intensity Reduction (80% load)</option>
                      <option value="complete">Complete Rest</option>
                      <option value="mixed">Mixed Approach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Deload Frequency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Every 3 weeks', 'Every 4 weeks', 'Every 5 weeks'].map(freq => (
                        <button
                          key={freq}
                          className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Next Deload: Week 6
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">
                      Based on current fatigue accumulation patterns
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
