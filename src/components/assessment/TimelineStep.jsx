import React from 'react';

const TimelineStep = ({ onNext, onPrevious, data, updateData }) => {
    return (
        <div className="timeline-step">
            <h3 className="text-xl font-semibold mb-4">Timeline & Scheduling</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Training Schedule Preference
                    </label>
                    <select
                        className="w-full p-2 border rounded-md bg-gray-800 border-gray-600 text-white"
                        value={data?.schedule || ''}
                        onChange={(e) => updateData({ schedule: e.target.value })}
                    >
                        <option value="">Select schedule...</option>
                        <option value="3-days">3 days per week</option>
                        <option value="4-days">4 days per week</option>
                        <option value="5-days">5 days per week</option>
                        <option value="6-days">6 days per week</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Session Duration Preference
                    </label>
                    <select
                        className="w-full p-2 border rounded-md bg-gray-800 border-gray-600 text-white"
                        value={data?.duration || ''}
                        onChange={(e) => updateData({ duration: e.target.value })}
                    >
                        <option value="">Select duration...</option>
                        <option value="30-45">30-45 minutes</option>
                        <option value="45-60">45-60 minutes</option>
                        <option value="60-90">60-90 minutes</option>
                        <option value="90+">90+ minutes</option>
                    </select>
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimelineStep;
