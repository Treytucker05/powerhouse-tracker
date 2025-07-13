import React from 'react';

const TrainingExperienceStep = ({ assessmentData, onInputChange }) => {
    return (
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Step 2: Training Experience</h3>
            <p className="text-gray-400 mb-6">How long have you been training consistently?</p>

            <div className="space-y-3">
                {[
                    'Beginner <1 year',
                    'Intermediate 1-3 years',
                    'Advanced 3-5 years',
                    'Elite 5+ years'
                ].map((experience) => (
                    <label key={experience} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="trainingExperience"
                            value={experience}
                            checked={assessmentData.trainingExperience === experience}
                            onChange={(e) => onInputChange('trainingExperience', e.target.value)}
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white">{experience}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default TrainingExperienceStep;
