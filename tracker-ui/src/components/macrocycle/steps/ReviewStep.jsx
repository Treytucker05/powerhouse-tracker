import React from 'react';
import { useTrainingState } from "../../../lib/state/trainingState";

export default function ReviewStep() {
  const { userProfile, setProfile, nextStep, prevStep } = useTrainingState(state => state.macrocycle);

  const handleSavePlan = () => {
    // Mark as complete to trigger plan generation
    setProfile({ ...userProfile, isComplete: true });
    nextStep();
  };

  const formatVolumeLandmarks = (landmarks) => {
    if (!landmarks) return {};
    return Object.entries(landmarks).reduce((acc, [muscle, values]) => {
      acc[muscle] = `MV:${values.mv} MEV:${values.mev} MRV:${values.mrv}`;
      return acc;
    }, {});
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Review Your Plan</h2>
          <p className="text-gray-400">Confirm your settings before generating your macrocycle</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Training Profile */}
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">👤</span> Training Profile
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Experience:</span>
                <span className="text-white capitalize">{userProfile.trainingAge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Primary Goal:</span>
                <span className="text-white capitalize">{userProfile.primaryGoal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Training Days:</span>
                <span className="text-white">{userProfile.daysPerWeek}/week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Session Length:</span>
                <span className="text-white">{userProfile.sessionLength} min</span>
              </div>
            </div>
          </div>

          {/* Periodization */}
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">📅</span> Periodization
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Length:</span>
                <span className="text-white">{userProfile.totalWeeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Diet Phase:</span>
                <span className="text-white capitalize">{userProfile.dietPhase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume Tolerance:</span>
                <span className="text-white capitalize">{userProfile.volumeTolerance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recovery:</span>
                <span className="text-white">{userProfile.recoveryCapacity}/10</span>
              </div>
            </div>
          </div>

          {/* Priority Muscles */}
          <div className="bg-gray-700/30 rounded-xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">🎯</span> Priority Focus
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Priority Muscles:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userProfile.priorityMuscles?.map((muscle) => (
                    <span key={muscle} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs capitalize">
                      {muscle}
                    </span>
                  )) || <span className="text-gray-500 text-sm">None selected</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Specialization */}
          {userProfile.trainingAge === 'advanced' && (
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                <span className="mr-2">⭐</span> Specialization
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Enabled:</span>
                  <span className="text-white">
                    {userProfile.specialization?.enabled ? 'Yes' : 'No'}
                  </span>
                </div>
                {userProfile.specialization?.enabled && (
                  <>
                    <div>
                      <span className="text-gray-400">Focus Muscles:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userProfile.specialization.focusMuscles.map((muscle) => (
                          <span key={muscle} className="px-2 py-1 bg-orange-500/20 rounded text-orange-300 text-xs capitalize">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Intensity:</span>
                      <span className="text-white capitalize">
                        {userProfile.specialization.intensityLevel}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Volume Landmarks Summary */}
        {userProfile.volumeLandmarks && (
          <div className="bg-gray-700/30 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">📊</span> Volume Landmarks
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(formatVolumeLandmarks(userProfile.volumeLandmarks)).map(([muscle, volumes]) => (
                <div key={muscle} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-white font-medium capitalize mb-1">{muscle}</div>
                  <div className="text-gray-400 text-xs">{volumes}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Preview (for development) */}
        <details className="mb-8">
          <summary className="text-gray-400 cursor-pointer hover:text-white transition-colors">
            View Raw Configuration (Developer)
          </summary>
          <pre className="mt-4 bg-gray-900 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-64">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </details>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl 
              transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={handleSavePlan}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
              text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]
              shadow-lg shadow-green-500/25"
          >
            Generate Macrocycle Plan
          </button>
        </div>
      </div>
    </div>
  );
}
