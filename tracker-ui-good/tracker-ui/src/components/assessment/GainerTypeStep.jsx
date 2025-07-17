import React, { useState } from 'react';
import { TrendingUp, Zap, Target } from 'lucide-react';

const GainerTypeStep = ({ assessmentData, onInputChange }) => {
    const [testCompleted, setTestCompleted] = useState(false);

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

    const calculateGainerType = (reps) => {
        if (!reps) return null;

        if (reps <= 6) {
            return {
                classification: 'Power/Strength Gainer',
                fiberType: 'Fast-Twitch Dominant',
                recommendations: [
                    'Focus on heavy compound movements',
                    'Lower rep ranges (1-6 reps)',
                    'Longer rest periods (3-5 minutes)',
                    'Explosive/power training emphasis'
                ]
            };
        } else if (reps <= 12) {
            return {
                classification: 'Balanced Gainer',
                fiberType: 'Mixed Fiber Type',
                recommendations: [
                    'Periodize between strength and hypertrophy',
                    'Moderate rep ranges (6-12 reps)',
                    'Moderate rest periods (2-3 minutes)',
                    'Varied training stimuli'
                ]
            };
        } else {
            return {
                classification: 'Volume/Endurance Gainer',
                fiberType: 'Slow-Twitch Dominant',
                recommendations: [
                    'Higher volume training',
                    'Higher rep ranges (12+ reps)',
                    'Shorter rest periods (1-2 minutes)',
                    'Circuit and endurance training'
                ]
            };
        }
    };

    const handleRepsChange = (reps) => {
        const repsNum = parseInt(reps);
        const classification = calculateGainerType(repsNum);

        handleNestedChange('gainerType', 'reps', repsNum);

        if (classification) {
            handleNestedChange('gainerType', 'classification', classification.classification);
            const newData = {
                ...assessmentData,
                gainerType: {
                    ...assessmentData.gainerType,
                    reps: repsNum,
                    classification: classification.classification,
                    fiberType: classification.fiberType
                }
            };
            onInputChange(newData);
            setTestCompleted(true);
        }
    };

    const classification = calculateGainerType(assessmentData.gainerType.reps);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <div>
                    <h3 className="text-xl font-semibold text-white">Gainer Type Assessment</h3>
                    <p className="text-gray-400">Determine your muscle fiber dominance and optimal training approach</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Test Instructions */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-blue-400 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Rep Max Test Instructions
                    </h4>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Choose a weight that's approximately 80% of your 1RM for bench press</li>
                        <li>Perform as many reps as possible with perfect form</li>
                        <li>Rest 2-3 minutes if needed, then enter your max reps below</li>
                        <li>This will determine your fiber type dominance</li>
                    </ol>
                </div>

                {/* Rep Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Maximum Reps at 80% 1RM (Bench Press)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="25"
                        value={assessmentData.gainerType.reps || ''}
                        onChange={(e) => handleRepsChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter max reps (e.g., 8)"
                    />
                </div>

                {/* Results */}
                {testCompleted && classification && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            Your Gainer Type Results
                        </h4>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Classification:</span>
                                <span className="font-medium text-green-400">{classification.classification}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-300">Fiber Type:</span>
                                <span className="font-medium text-blue-400">{classification.fiberType}</span>
                            </div>

                            <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Training Recommendations:</h5>
                                <ul className="space-y-1 text-sm text-gray-400">
                                    {classification.recommendations.map((rec, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fiber Type Guide */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-white mb-3">Fiber Type Reference</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                            <div className="font-medium text-red-400 mb-1">Power (≤6 reps)</div>
                            <div className="text-gray-300">Fast-twitch dominant</div>
                        </div>
                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                            <div className="font-medium text-yellow-400 mb-1">Balanced (7-12 reps)</div>
                            <div className="text-gray-300">Mixed fiber type</div>
                        </div>
                        <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                            <div className="font-medium text-green-400 mb-1">Endurance (13+ reps)</div>
                            <div className="text-gray-300">Slow-twitch dominant</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GainerTypeStep;
