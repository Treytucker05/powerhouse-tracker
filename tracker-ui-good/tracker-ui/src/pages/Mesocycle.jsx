import CardWrapper from "../components/ui/CardWrapper";
import MesocycleBuilder from "../components/dashboard/MesocycleBuilder";
import { TrainingStateProvider } from "../context/TrainingStateContext.jsx";
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
  const VolumeSlider = ({ muscle, landmarks }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{muscle}</span>
        <span className="text-gray-400 text-sm">Current: {landmarks.mav} sets</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={landmarks.mev}
          max={landmarks.mrv}
          defaultValue={landmarks.mav}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>MEV: {landmarks.mev}</span>
          <span>MAV: {landmarks.mav}</span>
          <span>MRV: {landmarks.mrv}</span>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="space-y-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🗓️ Mesocycle Planning
            </h1>
            <p className="text-gray-400 text-lg">
              Plan and configure your training blocks (3-6 weeks) with volume progression
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Volume Landmarks Configuration */}
              <CardWrapper
                title="Volume Landmarks"
                subtitle="Configure MEV, MAV, and MRV for each muscle group"
                className="lg:col-span-2"
              >
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {muscleGroups.map(muscle => (
                    <VolumeSlider
                      key={muscle}
                      muscle={muscle}
                      landmarks={volumeLandmarks[muscle]}
                    />
                  ))}
                </div>
              </CardWrapper>

              {/* Mesocycle Builder */}
              <CardWrapper title="Mesocycle Builder" subtitle="Create and manage training blocks">
                <MesocycleBuilder />
              </CardWrapper>

              {/* Phase Overview */}
              <CardWrapper title="Training Phases" subtitle="Current mesocycle structure">
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-500">
                    <h4 className="text-white font-medium">Accumulation Phase</h4>
                    <p className="text-gray-400 text-sm">Weeks 1-3: Volume progression</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="text-white font-medium">Intensification Phase</h4>
                    <p className="text-gray-400 text-sm">Week 4: High intensity, reduced volume</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                    <h4 className="text-white font-medium">Deload Phase</h4>
                    <p className="text-gray-400 text-sm">Week 5: Recovery and adaptation</p>
                  </div>
                </div>
              </CardWrapper>
            </div>

            {/* Volume Landmarks Section */}
            <div className="lg:col-span-2">
              <CardWrapper title="Volume Landmarks" subtitle="Set MEV, MAV, and MRV for each muscle group">
                <div className="space-y-4">
                  {Object.keys(volumeLandmarks).map((muscle) => (
                    <div key={muscle} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">{muscle}</h4>
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
          </div>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
