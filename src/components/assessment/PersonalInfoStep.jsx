import React from 'react';

const PersonalInfoStep = ({ assessmentData, onInputChange }) => {
    return (
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Step 1: Primary Goal</h3>
            <p className="text-gray-400 mb-6">What is your main training objective?</p>

            <div className="space-y-3">
                {[
                    'Powerlifting Competition',
                    'Bodybuilding/Physique',
                    'Athletic Performance',
                    'General Fitness',
                    'Hybrid/Multiple'
                ].map((goal) => (
                    <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="primaryGoal"
                            value={goal}
                            checked={assessmentData.primaryGoal === goal}
                            onChange={(e) => onInputChange('primaryGoal', e.target.value)}
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white">{goal}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PersonalInfoStep;
