import React, { useState } from 'react';
import { useProgramContext } from '../../../contexts/ProgramContext';

/**
 * Gainer Type Step Component
 * Step 6 of 12-step workflow - Bryant-specific fiber type assessment
 * Based on rep performance at 80% 1RM for muscle fiber classification
 */
const GainerTypeStep = ({ onNext, onPrevious, canGoNext, canGoPrevious }) => {
    const { state, actions } = useProgramContext();
    const [testResults, setTestResults] = useState({
        exerciseUsed: '',
        oneRepMax: '',
        repsAt80Percent: '',
        fatigueLevels: '',
        recoveryTime: ''
    });

    const [classification, setClassification] = useState(null);
    const [showInstructions, setShowInstructions] = useState(true);

    // Bryant-specific gainer type classification based on reps at 80% 1RM
    const classifyGainerType = (reps) => {
        if (!reps || reps < 1) return null;

        const repsNum = parseInt(reps);

        if (repsNum <= 3) {
            return {
                type: 'Very Fast Gainer',
                fiberDominance: 'Type IIx (Super Fast-Twitch)',
                characteristics: [
                    'Exceptional neural efficiency',
                    'Very low fatigue resistance',
                    'Responds to very low volume',
                    'Needs long recovery periods'
                ],
                bryantRecommendations: [
                    'Cluster sets with 15-20s intra-rest',
                    'Maximum 8-10 sets per week per muscle',
                    '85-95% 1RM intensity focus',
                    'Avoid PHA circuits (too fatiguing)',
                    'Strongman events: power-focused only',
                    'Extended rest between sessions (72+ hours)'
                ],
                volumeGuidelines: {
                    setsPerWeek: '6-10',
                    repsPerSet: '1-3',
                    intensity: '90-95%',
                    frequency: '2x per week max'
                },
                bryantCompatibility: 'Limited - requires significant modifications'
            };
        } else if (repsNum <= 8) {
            return {
                type: 'Fast Gainer',
                fiberDominance: 'Type IIa (Fast-Twitch)',
                characteristics: [
                    'High neural efficiency',
                    'Moderate fatigue resistance',
                    'Good power output',
                    'Moderate recovery needs'
                ],
                bryantRecommendations: [
                    'Cluster sets ideal for strength work',
                    '12-16 sets per week per muscle',
                    '80-90% 1RM primary zone',
                    'Limited PHA participation (1x per week)',
                    'Strongman events: power and strength focus',
                    'Moderate recovery (48-72 hours)'
                ],
                volumeGuidelines: {
                    setsPerWeek: '10-16',
                    repsPerSet: '3-6',
                    intensity: '80-90%',
                    frequency: '2-3x per week'
                },
                bryantCompatibility: 'Good - responds well to cluster methods'
            };
        } else if (repsNum <= 15) {
            return {
                type: 'Slow Gainer',
                fiberDominance: 'Type I/IIa Mix (Mixed Fiber)',
                characteristics: [
                    'Moderate neural efficiency',
                    'High fatigue resistance',
                    'Good work capacity',
                    'Fast recovery'
                ],
                bryantRecommendations: [
                    'Excellent for PHA circuits',
                    '16-24 sets per week per muscle',
                    '70-85% 1RM optimal zone',
                    'Can handle 2-3 PHA sessions per week',
                    'Strongman events: endurance and strength focus',
                    'Quick recovery (24-48 hours)'
                ],
                volumeGuidelines: {
                    setsPerWeek: '16-24',
                    repsPerSet: '6-12',
                    intensity: '70-85%',
                    frequency: '3-4x per week'
                },
                bryantCompatibility: 'Excellent - ideal for all Bryant methods'
            };
        } else {
            return {
                type: 'Very Slow Gainer',
                fiberDominance: 'Type I (Slow-Twitch)',
                characteristics: [
                    'Lower neural efficiency',
                    'Exceptional fatigue resistance',
                    'High work capacity',
                    'Very fast recovery'
                ],
                bryantRecommendations: [
                    'Perfect for extended PHA circuits',
                    '20-30+ sets per week per muscle',
                    '60-80% 1RM primary zone',
                    'Can handle daily PHA training',
                    'Strongman events: endurance and conditioning focus',
                    'Minimal recovery needed (24 hours)'
                ],
                volumeGuidelines: {
                    setsPerWeek: '20-30+',
                    repsPerSet: '12-20+',
                    intensity: '60-80%',
                    frequency: '4-6x per week'
                },
                bryantCompatibility: 'Excellent - thrives on high volume methods'
            };
        }
    };

    const handleTestComplete = () => {
        const reps = parseInt(testResults.repsAt80Percent);
        const result = classifyGainerType(reps);

        if (result) {
            setClassification(result);

            // Save to program context
            actions.setProgramData({
                gainerType: {
                    testResults,
                    classification: result,
                    completedAt: new Date().toISOString()
                }
            });
        }
    };

    const handleInputChange = (field, value) => {
        setTestResults(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const isTestComplete = testResults.exerciseUsed && testResults.oneRepMax && testResults.repsAt80Percent;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h2 className="text-xl font-bold text-purple-400 mb-2">
                    🧬 Gainer Type Assessment - Bryant Fiber Classification
                </h2>
                <p className="text-purple-300 text-sm">
                    Determine your muscle fiber dominance and volume tolerance for optimal Bryant protocol selection.
                    This assessment guides PHA circuit participation and cluster set programming.
                </p>
            </div>

            {/* Instructions */}
            {showInstructions && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-blue-400 font-semibold">Test Instructions</h3>
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="text-blue-300 hover:text-white text-sm"
                        >
                            Hide ✕
                        </button>
                    </div>

                    <div className="space-y-3 text-blue-300 text-sm">
                        <div>
                            <strong>Step 1:</strong> Choose a compound exercise you know your 1RM for (squat, bench, deadlift)
                        </div>
                        <div>
                            <strong>Step 2:</strong> Calculate 80% of your 1RM
                        </div>
                        <div>
                            <strong>Step 3:</strong> Perform as many reps as possible at 80% 1RM (to failure)
                        </div>
                        <div>
                            <strong>Step 4:</strong> Record the number of reps completed
                        </div>
                        <div className="bg-blue-800/30 p-3 rounded mt-3">
                            <strong>Important:</strong> This should be done fresh, not after other training.
                            Rest 3-5 minutes before the test set.
                        </div>
                    </div>
                </div>
            )}

            {/* Test Input Form */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                    80% 1RM Rep Test
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Exercise Used
                        </label>
                        <select
                            value={testResults.exerciseUsed}
                            onChange={(e) => handleInputChange('exerciseUsed', e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                        >
                            <option value="">Select exercise...</option>
                            <option value="squat">Back Squat</option>
                            <option value="bench">Bench Press</option>
                            <option value="deadlift">Deadlift</option>
                            <option value="overhead">Overhead Press</option>
                            <option value="front-squat">Front Squat</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-2">
                            Current 1RM (lbs)
                        </label>
                        <input
                            type="number"
                            value={testResults.oneRepMax}
                            onChange={(e) => handleInputChange('oneRepMax', e.target.value)}
                            placeholder="e.g., 225"
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-2">
                            Reps at 80% 1RM
                            {testResults.oneRepMax && (
                                <span className="text-gray-400 text-sm ml-2">
                                    (80% = {Math.round(testResults.oneRepMax * 0.8)} lbs)
                                </span>
                            )}
                        </label>
                        <input
                            type="number"
                            value={testResults.repsAt80Percent}
                            onChange={(e) => handleInputChange('repsAt80Percent', e.target.value)}
                            placeholder="Reps to failure"
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-medium mb-2">
                            Recovery Time Needed
                        </label>
                        <select
                            value={testResults.recoveryTime}
                            onChange={(e) => handleInputChange('recoveryTime', e.target.value)}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600"
                        >
                            <option value="">How long to feel recovered?</option>
                            <option value="same-day">Ready for more same day</option>
                            <option value="24-hours">Need 24 hours</option>
                            <option value="48-hours">Need 48 hours</option>
                            <option value="72-hours">Need 72+ hours</option>
                        </select>
                    </div>
                </div>

                {isTestComplete && !classification && (
                    <button
                        onClick={handleTestComplete}
                        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        Analyze Gainer Type
                    </button>
                )}
            </div>

            {/* Classification Results */}
            {classification && (
                <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">
                        Your Gainer Type: {classification.type}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Fiber Type Info */}
                        <div>
                            <h4 className="text-white font-semibold mb-3">Fiber Dominance</h4>
                            <div className="bg-gray-700 rounded p-4">
                                <div className="text-purple-300 font-medium mb-2">
                                    {classification.fiberDominance}
                                </div>
                                <ul className="space-y-1">
                                    {classification.characteristics.map((char, index) => (
                                        <li key={index} className="text-gray-300 text-sm">
                                            • {char}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Volume Guidelines */}
                        <div>
                            <h4 className="text-white font-semibold mb-3">Volume Guidelines</h4>
                            <div className="bg-gray-700 rounded p-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-400">Sets/Week:</span>
                                        <div className="text-green-400 font-medium">
                                            {classification.volumeGuidelines.setsPerWeek}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Reps/Set:</span>
                                        <div className="text-green-400 font-medium">
                                            {classification.volumeGuidelines.repsPerSet}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Intensity:</span>
                                        <div className="text-green-400 font-medium">
                                            {classification.volumeGuidelines.intensity}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Frequency:</span>
                                        <div className="text-green-400 font-medium">
                                            {classification.volumeGuidelines.frequency}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bryant Recommendations */}
                        <div className="lg:col-span-2">
                            <h4 className="text-white font-semibold mb-3">Bryant Protocol Recommendations</h4>
                            <div className="bg-gray-700 rounded p-4">
                                <div className="text-blue-400 font-medium mb-3">
                                    Bryant Compatibility: {classification.bryantCompatibility}
                                </div>
                                <ul className="space-y-2">
                                    {classification.bryantRecommendations.map((rec, index) => (
                                        <li key={index} className="text-gray-300 text-sm flex items-start">
                                            <span className="text-blue-400 mr-2">▶</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous: PHA Health Screen
                </button>

                <button
                    onClick={onNext}
                    disabled={!classification || !canGoNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next: SMART Goals
                </button>
            </div>
        </div>
    );
};

export default GainerTypeStep;
