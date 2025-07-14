import React, { useState } from 'react';
import { useProgramContext } from '../../contexts/ProgramContext';
import { useBlockParameters } from '../../hooks/useProgramHooks';

const LoadingParameters = () => {
    const { state, actions } = useProgramContext();
    const { blockParameters, calculateLoadingResults } = useBlockParameters();
    const [activeTab, setActiveTab] = useState(state.blockSequence[0]?.id || '');

    const handleParameterChange = (blockId, parameter, value) => {
        actions.updateBlockParameter(blockId, { [parameter]: value });
    };

    const handleCalculateLoading = async (blockId) => {
        await calculateLoadingResults(blockId);
    };

    const getLoadingRecommendation = (phase, assessmentData) => {
        if (!assessmentData) return null;

        const baseRecommendations = {
            accumulation: { min: 55, max: 70, optimal: 62 },
            intensification: { min: 70, max: 85, optimal: 77 },
            realization: { min: 85, max: 95, optimal: 90 },
            deload: { min: 30, max: 50, optimal: 40 }
        };

        const base = baseRecommendations[phase];
        if (!base) return null;

        // Adjust based on assessment data
        const experienceMultiplier = {
            'Beginner': 0.9,
            'Intermediate': 1.0,
            'Advanced': 1.1
        };

        const multiplier = experienceMultiplier[assessmentData.experience_level] || 1.0;

        return {
            min: Math.round(base.min * multiplier),
            max: Math.round(base.max * multiplier),
            optimal: Math.round(base.optimal * multiplier)
        };
    };

    const BlockParameterForm = ({ block }) => {
        const params = blockParameters[block.id] || {};
        const recommendation = getLoadingRecommendation(block.phase, state.assessmentData);

        return (
            <div className="space-y-6">
                {/* Loading Percentage */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Loading Percentage (% of 1RM)
                        </label>
                        {recommendation && (
                            <span className="text-xs text-gray-500">
                                Recommended: {recommendation.optimal}% ({recommendation.min}-{recommendation.max}%)
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            min="30"
                            max="95"
                            step="5"
                            value={params.loading || 70}
                            onChange={(e) => handleParameterChange(block.id, 'loading', parseInt(e.target.value))}
                            className="flex-1"
                        />
                        <div className="w-16 text-center">
                            <input
                                type="number"
                                min="30"
                                max="95"
                                value={params.loading || 70}
                                onChange={(e) => handleParameterChange(block.id, 'loading', parseInt(e.target.value))}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                        <span className="text-sm text-gray-600">%</span>
                    </div>

                    {recommendation && (
                        <div className="mt-2 h-2 bg-gray-200 rounded-full relative">
                            <div
                                className="absolute h-full bg-green-300 rounded-full"
                                style={{
                                    left: `${((recommendation.min - 30) / 65) * 100}%`,
                                    width: `${((recommendation.max - recommendation.min) / 65) * 100}%`
                                }}
                            />
                            <div
                                className="absolute h-full w-1 bg-green-600 rounded-full"
                                style={{
                                    left: `${((recommendation.optimal - 30) / 65) * 100}%`
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Movement Pattern */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Movement Pattern
                    </label>
                    <select
                        value={params.movement || 'Bilateral'}
                        onChange={(e) => handleParameterChange(block.id, 'movement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Bilateral">Bilateral (Both sides)</option>
                        <option value="Unilateral">Unilateral (Single side)</option>
                        <option value="Mixed">Mixed Pattern</option>
                    </select>
                </div>

                {/* Volume Guidelines */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume Guidelines
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Sets per Exercise</label>
                            <select
                                value={params.setsPerExercise || getDefaultSets(block.phase)}
                                onChange={(e) => handleParameterChange(block.id, 'setsPerExercise', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                                <option value="2-3">2-3 sets</option>
                                <option value="3-4">3-4 sets</option>
                                <option value="4-5">4-5 sets</option>
                                <option value="5-6">5-6 sets</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Rep Range</label>
                            <select
                                value={params.repRange || getDefaultReps(block.phase)}
                                onChange={(e) => handleParameterChange(block.id, 'repRange', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                                <option value="1-3">1-3 reps (Max Strength)</option>
                                <option value="3-6">3-6 reps (Strength)</option>
                                <option value="6-10">6-10 reps (Strength-Hypertrophy)</option>
                                <option value="10-15">10-15 reps (Hypertrophy)</option>
                                <option value="15+">15+ reps (Endurance)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Exercise Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exercise Emphasis
                    </label>
                    <div className="space-y-2">
                        {['Squat Pattern', 'Hinge Pattern', 'Push Pattern', 'Pull Pattern', 'Single Leg', 'Core'].map((pattern) => (
                            <div key={pattern} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{pattern}</span>
                                <select
                                    value={params[`${pattern.toLowerCase().replace(' ', '_')}_emphasis`] || 'Moderate'}
                                    onChange={(e) => handleParameterChange(block.id, `${pattern.toLowerCase().replace(' ', '_')}_emphasis`, e.target.value)}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calculate Loading Results */}
                <div>
                    <button
                        onClick={() => handleCalculateLoading(block.id)}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Calculate Loading Results
                    </button>
                </div>

                {/* Loading Results Display */}
                {params.loadingResults && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-3">Loading Analysis</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Recommended Load</p>
                                <p className="font-medium">{params.loadingResults.recommended_load}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Volume Load</p>
                                <p className="font-medium">{params.loadingResults.volume_load}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Intensity Zone</p>
                                <p className="font-medium">{params.loadingResults.intensity_zone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Recovery Time</p>
                                <p className="font-medium">{params.loadingResults.recovery_time}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Parameters</h3>

                {/* Block Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {state.blockSequence.map((block) => (
                            <button
                                key={block.id}
                                onClick={() => setActiveTab(block.id)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === block.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: block.color }}
                                    />
                                    <span>{block.name}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Active Block Form */}
                {state.blockSequence.length > 0 && activeTab && (
                    <BlockParameterForm
                        block={state.blockSequence.find(b => b.id === activeTab)}
                    />
                )}

                {state.blockSequence.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No blocks configured. Please set up your block sequence first.</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    onClick={() => actions.setActiveTab('sequencing')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                    Back: Block Sequencing
                </button>

                <button
                    onClick={() => actions.setActiveTab('methods')}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Next: Training Methods
                </button>
            </div>
        </div>
    );
};

// Helper functions
const getDefaultSets = (phase) => {
    const defaults = {
        accumulation: '3-4',
        intensification: '3-4',
        realization: '2-3',
        deload: '2-3'
    };
    return defaults[phase] || '3-4';
};

const getDefaultReps = (phase) => {
    const defaults = {
        accumulation: '6-10',
        intensification: '3-6',
        realization: '1-3',
        deload: '10-15'
    };
    return defaults[phase] || '6-10';
};

export default LoadingParameters;
