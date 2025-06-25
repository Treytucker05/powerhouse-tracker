import React, { useState } from 'react';
import { useTrainingState } from "../../../lib/state/trainingState";

export default function ProfileStep() {
  const { userProfile, setProfile, nextStep } = useTrainingState(state => state.macrocycle);
  
  const [formData, setFormData] = useState({
    trainingAge: userProfile.trainingAge || '',
    primaryGoal: userProfile.primaryGoal || '',
    daysPerWeek: userProfile.daysPerWeek || 4,
    sessionLength: userProfile.sessionLength || 60,
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Training Profile</h2>
          <p className="text-gray-400">Tell us about your training background and goals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Training Age */}
          <div>
            <label className="block text-white font-medium mb-3">Training Experience</label>
            <div className="grid grid-cols-3 gap-3">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('trainingAge', level)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    formData.trainingAge === level
                      ? 'bg-blue-500 text-white border-2 border-blue-400'
                      : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold capitalize">{level}</div>
                  <div className="text-xs mt-1 opacity-80">
                    {level === 'beginner' && '< 1 year'}
                    {level === 'intermediate' && '1-3 years'}
                    {level === 'advanced' && '3+ years'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="block text-white font-medium mb-3">Primary Training Goal</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'strength', label: 'Strength', desc: 'Max strength & power' },
                { value: 'hypertrophy', label: 'Hypertrophy', desc: 'Muscle size & mass' },
                { value: 'powerlifting', label: 'Powerlifting', desc: 'Competition focus' },
                { value: 'general', label: 'General Fitness', desc: 'Overall health' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => handleChange('primaryGoal', goal.value)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 ${
                    formData.primaryGoal === goal.value
                      ? 'bg-blue-500 text-white border-2 border-blue-400'
                      : 'bg-gray-700/50 text-gray-300 border-2 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">{goal.label}</div>
                  <div className="text-xs mt-1 opacity-80">{goal.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Training Frequency */}
          <div>
            <label className="block text-white font-medium mb-3">
              Training Days Per Week: {formData.daysPerWeek}
            </label>
            <input
              type="range"
              min="3"
              max="7"
              value={formData.daysPerWeek}
              onChange={(e) => handleChange('daysPerWeek', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3 days</span>
              <span>7 days</span>
            </div>
          </div>

          {/* Session Length */}
          <div>
            <label className="block text-white font-medium mb-3">
              Session Length: {formData.sessionLength} minutes
            </label>
            <input
              type="range"
              min="30"
              max="120"
              step="15"
              value={formData.sessionLength}
              onChange={(e) => handleChange('sessionLength', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.trainingAge || !formData.primaryGoal}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
              text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Continue to Volume Landmarks
          </button>
        </form>
      </div>
    </div>
  );
}
