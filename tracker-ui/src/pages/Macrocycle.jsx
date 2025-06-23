import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import CardWrapper from "../components/dashboard/CardWrapper";
import MacrocycleTimeline from "../components/dashboard/MacrocycleTimeline";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Macrocycle() {
  const trainingGoals = [
    { name: 'Strength', icon: '💪', description: 'Maximize 1RM and neural adaptations' },
    { name: 'Hypertrophy', icon: '🏗️', description: 'Build muscle mass and size' },
    { name: 'Power', icon: '⚡', description: 'Develop explosive strength and speed' },
    { name: 'Endurance', icon: '🏃', description: 'Improve muscular endurance and work capacity' },
    { name: 'General Fitness', icon: '🏃‍♂️', description: 'Overall health and conditioning' }
  ];

  const progressMilestones = [
    { week: 4, milestone: 'Base fitness established', status: 'completed' },
    { week: 8, milestone: 'Strength foundation built', status: 'completed' },
    { week: 12, milestone: 'Peak strength achieved', status: 'current' },
    { week: 16, milestone: 'Competition ready', status: 'upcoming' },
    { week: 20, milestone: 'Annual goals met', status: 'planned' }
  ];

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
                Macrocycle Planning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Plan your annual training progression and long-term goals
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Timeline - Takes up 2 columns */}
              <CardWrapper className="lg:col-span-2">
                <MacrocycleTimeline />
              </CardWrapper>

              {/* Goal Setting */}
              <CardWrapper>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Training Goals
                </h3>
                
                <div className="space-y-3 mb-6">
                  {trainingGoals.map((goal, index) => (
                    <label key={index} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="primaryGoal"
                        className="mt-1 text-red-600"
                        defaultChecked={goal.name === 'Hypertrophy'}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span>{goal.icon}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {goal.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {goal.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Competition/Test Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Training Experience
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      <option>Beginner (0-1 years)</option>
                      <option>Novice (1-2 years)</option>
                      <option>Intermediate (2-5 years)</option>
                      <option>Advanced (5+ years)</option>
                    </select>
                  </div>

                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Generate Macrocycle
                  </button>
                </div>
              </CardWrapper>

              {/* Phase Breakdown */}
              <CardWrapper className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Training Phase Overview
                </h3>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-full h-20 bg-blue-500 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-white font-medium">Accumulation</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">8-12 weeks</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Volume focus</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-full h-20 bg-orange-500 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-white font-medium">Intensification</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">4-6 weeks</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Intensity focus</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-full h-20 bg-green-500 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-white font-medium">Realization</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">1-2 weeks</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Peak/Test</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-full h-20 bg-gray-500 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-white font-medium">Transition</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">1-2 weeks</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Recovery</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Periodization Principles
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <li>• Progressive overload through systematic volume and intensity manipulation</li>
                    <li>• Planned fatigue management with strategic deload periods</li>
                    <li>• Peak performance timed for competition or testing periods</li>
                    <li>• Recovery phases to prevent overtraining and maintain motivation</li>
                  </ul>
                </div>
              </CardWrapper>

              {/* Progress Milestones */}
              <CardWrapper>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Progress Milestones
                </h3>
                
                <div className="space-y-3">
                  {progressMilestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        milestone.status === 'completed' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : milestone.status === 'current'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Week {milestone.week}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {milestone.milestone}
                          </div>
                        </div>
                        <div className={`
                          w-3 h-3 rounded-full
                          ${milestone.status === 'completed' && 'bg-green-500'}
                          ${milestone.status === 'current' && 'bg-blue-500'}
                          ${milestone.status === 'upcoming' && 'bg-yellow-500'}
                          ${milestone.status === 'planned' && 'bg-gray-300 dark:bg-gray-600'}
                        `}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Next Milestone: Week 16
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Competition ready - 4 weeks remaining
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
