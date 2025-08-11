import React from 'react';

const TimelineStep = ({ assessmentData, onInputChange }) => {
    return (
        <div className="flex flex-col bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Step 3: Timeline</h3>
            <p className="text-gray-400 mb-6">How long do you want this program to run?</p>

            <div className="space-y-3">
                {[
                    '8-12 weeks',
                    '12-16 weeks',
                    '16-20 weeks',
                    '20+ weeks'
                ].map((timeline) => (
                    <label key={timeline} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="timeline"
                            value={timeline}
                            checked={assessmentData.timeline === timeline}
                            onChange={(e) => onInputChange('timeline', e.target.value)}
                            className="text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-white">{timeline}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default TimelineStep;
