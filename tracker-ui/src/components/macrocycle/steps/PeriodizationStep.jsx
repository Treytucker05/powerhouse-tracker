import React, { useState } from 'react';
import { useTrainingState } from "../../../lib/state/trainingState";

export default function PeriodizationStep() {
  const { userProfile, setProfile, nextStep, prevStep } = useTrainingState(state => state.macrocycle);
  
  const [formData, setFormData] = useState({
    totalWeeks: userProfile.totalWeeks || 16,
    dietPhase: userProfile.dietPhase || 'maintain',
    priorityMuscles: userProfile.priorityMuscles || [],
    volumeTolerance: userProfile.volumeTolerance || 'moderate',
    recoveryCapacity: userProfile.recoveryCapacity || 7,
    ...userProfile
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    nextStep();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePriorityMuscle = (muscle) => {
    setFormData(prev => ({
      ...prev,
      priorityMuscles: prev.priorityMuscles.includes(muscle)
        ? prev.priorityMuscles.filter(m => m !== muscle)
        : [...prev.priorityMuscles, muscle]
    }));
  };

  const muscleOptions = [
    { value: 'chest', label: 'Chest', icon: '💪' },
    { value: 'back', label: 'Back', icon: '🏋️' },
    { value: 'shoulders', label: 'Shoulders', icon: '🔥' },
    { value: 'arms', label: 'Arms', icon: '💪' },
    { value: 'legs', label: 'Legs', icon: '🦵' },
    { value: 'abs', label: 'Abs', icon: '⚡' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Periodization Setup</h2>
          <p className="text-gray-400">Configure your training cycle parameters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Total Weeks */}
          <div>
            <label className="block text-white font-medium mb-3">
              Total Macrocycle Length: {formData.totalWeeks} weeks
            </label>
            <input
              type="range"
              min="8"
              max="32"
              step="2"
              value={formData.totalWeeks}
              onChange={(e) => handleChange('totalWeeks', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>8 weeks</span>
              <span>32 weeks</span>
            </div>
          </div>

          {/* Diet Phase */}
          <div>
            <label className="block text-white font-medium mb-3">Current Diet Phase</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'cut', label: 'Cutting', desc: 'Fat loss phase', color: 'red' },
                { value: 'bulk', label: 'Bulking', desc: 'Muscle gain phase', color: 'green' },
                { value: 'maintain', label: 'Maintenance', desc: 'Body recomp', color: 'blue' }
              ].map((phase) => (
                <button
                  key={phase.value}
                  type="button"
                  onClick={() => handleChange('dietPhase', phase.value)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    formData.dietPhase === phase.value
                      ? `bg-${phase.color}-500 text-white border-2 border-${phase.color}-400`
                      : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">{phase.label}</div>
                  <div className="text-xs mt-1 opacity-80">{phase.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority Muscles */}
          <div>
            <label className="block text-white font-medium mb-3">
              Priority Muscle Groups (select 1-3)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {muscleOptions.map((muscle) => (
                <button
                  key={muscle.value}
                  type="button"
                  onClick={() => togglePriorityMuscle(muscle.value)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    formData.priorityMuscles.includes(muscle.value)
                      ? 'bg-purple-500 text-white border-2 border-purple-400'
                      : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{muscle.icon}</div>
                  <div className="font-semibold text-sm">{muscle.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.priorityMuscles.length}/3
            </p>
          </div>

          {/* Volume Tolerance */}
          <div>
            <label className="block text-white font-medium mb-3">Volume Tolerance</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'low', label: 'Conservative', desc: 'Lower volume approach' },
                { value: 'moderate', label: 'Moderate', desc: 'Balanced approach' },
                { value: 'high', label: 'High', desc: 'Higher volume tolerance' }
              ].map((tolerance) => (
                <button
                  key={tolerance.value}
                  type="button"
                  onClick={() => handleChange('volumeTolerance', tolerance.value)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    formData.volumeTolerance === tolerance.value
                      ? 'bg-orange-500 text-white border-2 border-orange-400'
                      : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">{tolerance.label}</div>
                  <div className="text-xs mt-1 opacity-80">{tolerance.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recovery Capacity */}
          <div>
            <label className="block text-white font-medium mb-3">
              Recovery Capacity: {formData.recoveryCapacity}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.recoveryCapacity}
              onChange={(e) => handleChange('recoveryCapacity', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Poor (1)</span>
              <span>Excellent (10)</span>
            </div>
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
              {formData.trainingAge === 'advanced' ? 'Continue to Specialization' : 'Review Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
