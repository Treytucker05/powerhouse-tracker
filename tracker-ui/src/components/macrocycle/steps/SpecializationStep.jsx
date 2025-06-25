import React, { useState } from 'react';
import { useTrainingState } from "../../../lib/state/trainingState";

export default function SpecializationStep() {
  const { userProfile, setProfile, nextStep, prevStep } = useTrainingState(state => state.macrocycle);
  
  const [formData, setFormData] = useState({
    specialization: userProfile.specialization || {
      enabled: false,
      focusMuscles: [],
      intensityLevel: 'moderate'
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile({ specialization: formData.specialization });
    nextStep();
  };

  const handleSpecializationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specialization: {
        ...prev.specialization,
        [field]: value
      }
    }));
  };

  const toggleFocusMuscle = (muscle) => {
    const currentFocus = formData.specialization.focusMuscles;
    const newFocus = currentFocus.includes(muscle)
      ? currentFocus.filter(m => m !== muscle)
      : [...currentFocus, muscle];
    
    handleSpecializationChange('focusMuscles', newFocus);
  };

  const muscleOptions = [
    { value: 'chest', label: 'Chest', icon: '💪' },
    { value: 'back', label: 'Back', icon: '🏋️' },
    { value: 'shoulders', label: 'Shoulders', icon: '🔥' },
    { value: 'arms', label: 'Arms', icon: '💪' },
    { value: 'legs', label: 'Legs', icon: '🦵' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Specialization Phase</h2>
          <p className="text-gray-400">Advanced option: Focus on specific muscle groups</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enable Specialization */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="checkbox"
                id="enableSpecialization"
                checked={formData.specialization.enabled}
                onChange={(e) => handleSpecializationChange('enabled', e.target.checked)}
                className="w-5 h-5 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="enableSpecialization" className="text-white font-semibold text-lg">
                Enable Specialization Training
              </label>
            </div>
            <p className="text-gray-300 text-sm">
              Specialization phases focus extra volume and attention on 1-2 muscle groups while 
              maintaining others. This is recommended for advanced trainees who want to bring up 
              lagging body parts.
            </p>
          </div>

          {formData.specialization.enabled && (
            <>
              {/* Focus Muscles */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Specialization Focus (select 1-2 muscle groups)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {muscleOptions.map((muscle) => (
                    <button
                      key={muscle.value}
                      type="button"
                      onClick={() => toggleFocusMuscle(muscle.value)}
                      disabled={
                        !formData.specialization.focusMuscles.includes(muscle.value) && 
                        formData.specialization.focusMuscles.length >= 2
                      }
                      className={`p-4 rounded-xl text-center transition-all duration-200 ${
                        formData.specialization.focusMuscles.includes(muscle.value)
                          ? 'bg-purple-500 text-white border-2 border-purple-400'
                          : formData.specialization.focusMuscles.length >= 2
                          ? 'bg-gray-800/50 text-gray-500 border-2 border-gray-700 cursor-not-allowed'
                          : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{muscle.icon}</div>
                      <div className="font-semibold text-sm">{muscle.label}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {formData.specialization.focusMuscles.length}/2
                </p>
              </div>

              {/* Specialization Intensity */}
              <div>
                <label className="block text-white font-medium mb-3">Specialization Intensity</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { 
                      value: 'moderate', 
                      label: 'Moderate Focus', 
                      desc: '+50% volume on focus muscles' 
                    },
                    { 
                      value: 'high', 
                      label: 'High Focus', 
                      desc: '+100% volume on focus muscles' 
                    }
                  ].map((intensity) => (
                    <button
                      key={intensity.value}
                      type="button"
                      onClick={() => handleSpecializationChange('intensityLevel', intensity.value)}
                      className={`p-4 rounded-xl text-center transition-all duration-200 ${
                        formData.specialization.intensityLevel === intensity.value
                          ? 'bg-orange-500 text-white border-2 border-orange-400'
                          : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold">{intensity.label}</div>
                      <div className="text-xs mt-1 opacity-80">{intensity.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialization Warning */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 text-xl">⚠️</span>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-1">Important Notes</h4>
                    <ul className="text-yellow-200/80 text-sm space-y-1">
                      <li>• Specialization phases are typically 6-12 weeks long</li>
                      <li>• Other muscle groups will be maintained at lower volume</li>
                      <li>• Recovery and nutrition become even more critical</li>
                      <li>• Consider deload weeks more frequently</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

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
              Review Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
