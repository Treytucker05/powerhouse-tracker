import React from 'react';
import { AlertTriangle, Heart, Activity } from 'lucide-react';

const InjuryScreeningStep = ({ assessmentData, onInputChange }) => {
    const handleNestedChange = (section, field, value) => {
        const newData = {
            ...assessmentData,
            [section]: {
                ...assessmentData[section],
                [field]: value
            }
        };
        onInputChange(newData);
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                    <h3 className="text-xl font-semibold text-white">Injury History & Screening</h3>
                    <p className="text-gray-400">Help us understand your physical limitations and health status</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Current Limitations */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Physical Limitations
                    </label>
                    <textarea
                        value={assessmentData.injuryHistory.currentLimitations}
                        onChange={(e) => handleNestedChange('injuryHistory', 'currentLimitations', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        placeholder="Describe any current physical limitations, injuries, or restrictions..."
                        rows={3}
                    />
                </div>

                {/* Pain Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Pain Level (0-10)
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={assessmentData.injuryHistory.painLevel}
                        onChange={(e) => handleNestedChange('injuryHistory', 'painLevel', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>No Pain</span>
                        <span className="font-medium text-white">{assessmentData.injuryHistory.painLevel}</span>
                        <span>Severe Pain</span>
                    </div>
                </div>

                {/* Previous Surgeries */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Previous Surgeries
                    </label>
                    <textarea
                        value={assessmentData.injuryHistory.previousSurgeries}
                        onChange={(e) => handleNestedChange('injuryHistory', 'previousSurgeries', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        placeholder="List any previous surgeries or medical procedures..."
                        rows={2}
                    />
                </div>

                {/* Physical Therapy */}
                <div>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={assessmentData.injuryHistory.physicalTherapy}
                            onChange={(e) => handleNestedChange('injuryHistory', 'physicalTherapy', e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-300">
                            Currently receiving or recently completed physical therapy
                        </span>
                    </label>
                </div>

                {/* Health Status Indicators */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Health Indicators
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Ready for training:</span>
                            <span className={`font-medium ${assessmentData.injuryHistory.painLevel <= 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {assessmentData.injuryHistory.painLevel <= 3 ? 'Yes' : 'Caution'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Modification needed:</span>
                            <span className={`font-medium ${assessmentData.injuryHistory.currentLimitations ? 'text-yellow-400' : 'text-green-400'}`}>
                                {assessmentData.injuryHistory.currentLimitations ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InjuryScreeningStep;
