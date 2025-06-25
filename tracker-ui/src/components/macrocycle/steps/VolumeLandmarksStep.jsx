import React, { useState } from 'react';
import { useTrainingState } from "../../../lib/state/trainingState";

const muscleGroups = [
  { name: 'chest', label: 'Chest', icon: '💪' },
  { name: 'back', label: 'Back', icon: '🏋️' },
  { name: 'shoulders', label: 'Shoulders', icon: '🔥' },
  { name: 'arms', label: 'Arms', icon: '💪' },
  { name: 'legs', label: 'Legs', icon: '🦵' },
  { name: 'abs', label: 'Abs', icon: '⚡' }
];

export default function VolumeLandmarksStep() {
  const { userProfile, setProfile, nextStep, prevStep } = useTrainingState(state => state.macrocycle);
  
  const [volumeLandmarks, setVolumeLandmarks] = useState(
    userProfile.volumeLandmarks || muscleGroups.reduce((acc, muscle) => {
      acc[muscle.name] = { mv: 6, mev: 10, mrv: 20 };
      return acc;
    }, {})
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile({ volumeLandmarks });
    nextStep();
  };

  const handleVolumeChange = (muscle, type, value) => {
    setVolumeLandmarks(prev => ({
      ...prev,
      [muscle]: {
        ...prev[muscle],
        [type]: parseInt(value)
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Volume Landmarks</h2>
          <p className="text-gray-400">Set your training volume thresholds per muscle group</p>
          <div className="mt-4 text-sm text-gray-500">
            <span className="font-medium">MV:</span> Maintenance Volume • 
            <span className="font-medium ml-2">MEV:</span> Max Effective Volume • 
            <span className="font-medium ml-2">MRV:</span> Max Recoverable Volume
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {muscleGroups.map((muscle) => (
              <div key={muscle.name} className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{muscle.icon}</span>
                  <h3 className="text-white font-semibold text-lg">{muscle.label}</h3>
                </div>
                
                <div className="space-y-4">
                  {/* MV - Maintenance Volume */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      MV: {volumeLandmarks[muscle.name]?.mv || 6} sets/week
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="15"
                      value={volumeLandmarks[muscle.name]?.mv || 6}
                      onChange={(e) => handleVolumeChange(muscle.name, 'mv', e.target.value)}
                      className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* MEV - Max Effective Volume */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      MEV: {volumeLandmarks[muscle.name]?.mev || 10} sets/week
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="25"
                      value={volumeLandmarks[muscle.name]?.mev || 10}
                      onChange={(e) => handleVolumeChange(muscle.name, 'mev', e.target.value)}
                      className="w-full h-2 bg-green-900/50 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* MRV - Max Recoverable Volume */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      MRV: {volumeLandmarks[muscle.name]?.mrv || 20} sets/week
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="35"
                      value={volumeLandmarks[muscle.name]?.mrv || 20}
                      onChange={(e) => handleVolumeChange(muscle.name, 'mrv', e.target.value)}
                      className="w-full h-2 bg-red-900/50 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Volume visualization */}
                <div className="mt-4 flex items-center space-x-2 text-xs">
                  <div className="flex-1 bg-gray-800 rounded-full h-2 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-blue-500" 
                      style={{ width: `${(volumeLandmarks[muscle.name]?.mv / 35) * 100}%` }}
                    />
                    <div 
                      className="absolute left-0 top-0 h-full bg-green-500/60" 
                      style={{ width: `${(volumeLandmarks[muscle.name]?.mev / 35) * 100}%` }}
                    />
                    <div 
                      className="absolute left-0 top-0 h-full bg-red-500/40" 
                      style={{ width: `${(volumeLandmarks[muscle.name]?.mrv / 35) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Continue to Periodization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
