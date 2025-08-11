import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Target, Info, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';

export default function Step12BoringButBig({ data, updateData }) {
    const [bbbConfig, setBbbConfig] = useState(data.bbbConfig || {});
    const [selectedPairings, setSelectedPairings] = useState(data.bbbPairings || {});
    const [intensityLevel, setIntensityLevel] = useState(data.bbbIntensity || 'beginner');
    const [additionalAssistance, setAdditionalAssistance] = useState(data.bbbAdditionalAssistance || []);

    // BBB percentage options based on experience level
    const intensityOptions = {
        beginner: { percentage: 50, label: 'Beginner (50% TM)', description: 'Start here - manageable volume' },
        intermediate: { percentage: 60, label: 'Intermediate (60% TM)', description: 'Moderate challenge' },
        advanced: { percentage: 70, label: 'Advanced (70% TM)', description: 'Very challenging - high volume' }
    };

    // Exercise pairing options are standard in BBB; selection handled via dropdowns and quick presets.

    // Standard BBB pairings
    const standardPairings = useMemo(() => ({
        same: {
            squat: 'squat',
            bench: 'bench',
            deadlift: 'deadlift',
            overhead_press: 'overhead_press'
        },
        opposite: {
            squat: 'deadlift',
            bench: 'overhead_press',
            deadlift: 'squat',
            overhead_press: 'bench'
        }
    }), []);

    // Additional assistance exercises for BBB
    const assistanceOptions = [
        { name: 'Abs/Core Work', sets: '2-3', reps: '25-50', category: 'core' },
        { name: 'Upper Back', sets: '2-3', reps: '25-50', category: 'upper_back', examples: 'Face pulls, band pull-aparts' },
        { name: 'Rear Delts', sets: '2-3', reps: '25-50', category: 'rear_delts', examples: 'Reverse flyes, face pulls' },
        { name: 'Tricep Work', sets: '2-3', reps: '25-50', category: 'triceps', examples: 'Pushdowns, overhead extensions' },
        { name: 'Bicep Work', sets: '2-3', reps: '25-50', category: 'biceps', examples: 'Curls, hammer curls' },
        { name: 'Calves', sets: '2-3', reps: '25-50', category: 'calves', examples: 'Calf raises' }
    ];

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    // Get training maxes from previous steps
    const trainingMaxes = data.trainingMaxes || {};

    const handlePairingChange = (mainLift, bbbLift) => {
        const newPairings = {
            ...selectedPairings,
            [mainLift]: bbbLift
        };
        setSelectedPairings(newPairings);
        updateStepData({ bbbPairings: newPairings });
    };

    const handleIntensityChange = (level) => {
        setIntensityLevel(level);
        updateStepData({ bbbIntensity: level });
    };

    const handleAssistanceToggle = (exercise) => {
        const isSelected = additionalAssistance.some(ex => ex.name === exercise.name);
        let newAssistance;

        if (isSelected) {
            newAssistance = additionalAssistance.filter(ex => ex.name !== exercise.name);
        } else {
            newAssistance = [...additionalAssistance, exercise];
        }

        setAdditionalAssistance(newAssistance);
        updateStepData({ bbbAdditionalAssistance: newAssistance });
    };

    const calculateBBBWeight = (lift) => {
        const tm = trainingMaxes[lift] || 0;
        const percentage = intensityOptions[intensityLevel].percentage;
        return Math.round((tm * percentage / 100) / 5) * 5;
    };

    const updateStepData = (updates) => {
        setBbbConfig({
            ...bbbConfig,
            ...updates
        });
        updateData({
            bbbConfig: {
                ...bbbConfig,
                ...updates
            },
            bbbPairings: selectedPairings,
            bbbIntensity: intensityLevel,
            bbbAdditionalAssistance: additionalAssistance,
            ...updates
        });
    };

    const isStepComplete = () => {
        return Object.keys(selectedPairings).length === 4 && intensityLevel;
    };

    const getVolumePrediction = () => {
        const percentage = intensityOptions[intensityLevel].percentage;
        if (percentage >= 70) return { level: 'Very High', color: 'text-red-400', warning: true };
        if (percentage >= 60) return { level: 'Moderate', color: 'text-yellow-400', warning: false };
        return { level: 'Manageable', color: 'text-green-400', warning: false };
    };

    // Initialize with standard pairings if none selected
    useEffect(() => {
        // Initialize default pairings only once when empty
        if (!selectedPairings || Object.keys(selectedPairings).length === 0) {
            setSelectedPairings(standardPairings.same);
        }
        // We intentionally avoid calling updateStepData here to prevent redundant writes on mount
    }, [selectedPairings, standardPairings]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 12: "Boring But Big" (BBB) Template
                </h3>
                <p className="text-gray-400">
                    High-volume assistance template featuring 5×10 sets to build muscle and work capacity.
                </p>
            </div>

            {/* BBB Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Boring But Big Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>High volume:</strong> 5 sets × 10 reps for significant muscle building</li>
                            <li>• <strong>Submaximal loads:</strong> 50-70% intensity allows volume completion</li>
                            <li>• <strong>Simple progression:</strong> Increase TM percentage over cycles</li>
                            <li>• <strong>Minimal extras:</strong> BBB volume replaces most assistance work</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Intensity Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-medium text-white">BBB Intensity Level</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {Object.entries(intensityOptions).map(([level, config]) => (
                        <div
                            key={level}
                            onClick={() => handleIntensityChange(level)}
                            className={`p-4 rounded border-2 cursor-pointer transition-colors ${intensityLevel === level
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="text-center">
                                <h5 className={`font-medium ${intensityLevel === level ? 'text-red-300' : 'text-white'}`}>
                                    {config.label}
                                </h5>
                                <p className="text-sm text-gray-400 mt-1">
                                    {config.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Volume Prediction */}
                <div className="bg-gray-800 p-3 rounded">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">Expected Volume Level:</span>
                        <span className={`font-medium ${getVolumePrediction().color}`}>
                            {getVolumePrediction().level}
                        </span>
                    </div>
                </div>
            </div>

            {/* Exercise Pairings */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                    <Target className="w-6 h-6 text-red-400" />
                    <h4 className="text-lg font-medium text-white">BBB Exercise Pairings</h4>
                </div>

                <div className="space-y-4">
                    {Object.entries(liftNames).map(([lift, name]) => (
                        <div key={lift} className="bg-gray-800 p-4 rounded">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white font-medium">{name} Main Work</span>
                                <span className="text-gray-400">5/3/1 Sets</span>
                            </div>

                            <div className="flex items-center space-x-4 mb-3">
                                <span className="text-gray-300">BBB Work:</span>
                                <select
                                    value={selectedPairings[lift] || lift}
                                    onChange={(e) => handlePairingChange(lift, e.target.value)}
                                    className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded focus:border-red-500 focus:outline-none"
                                >
                                    {Object.entries(liftNames).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Weight calculation */}
                            {trainingMaxes[selectedPairings[lift] || lift] && (
                                <div className="text-sm text-gray-400">
                                    BBB Weight: <span className="text-red-400 font-medium">
                                        {calculateBBBWeight(selectedPairings[lift] || lift)} lbs
                                    </span> (5 sets × 10 reps)
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Quick Pairing Presets */}
                <div className="mt-4 pt-4 border-t border-gray-600">
                    <span className="text-gray-300 text-sm mb-2 block">Quick Presets:</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setSelectedPairings(standardPairings.same);
                                updateStepData({ bbbPairings: standardPairings.same });
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            All Same Lifts
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPairings(standardPairings.opposite);
                                updateStepData({ bbbPairings: standardPairings.opposite });
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            All Opposite Lifts
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Assistance */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">
                    Additional Assistance (2-3 exercises max)
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                    BBB provides significant volume. Add only 25-50 total reps of these movements.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assistanceOptions.map((exercise) => {
                        const isSelected = additionalAssistance.some(ex => ex.name === exercise.name);
                        return (
                            <div
                                key={exercise.name}
                                onClick={() => handleAssistanceToggle(exercise)}
                                className={`p-3 rounded border cursor-pointer transition-colors ${isSelected
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h5 className={`font-medium text-sm ${isSelected ? 'text-red-300' : 'text-white'}`}>
                                            {exercise.name}
                                        </h5>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {exercise.sets} sets × {exercise.reps} reps
                                        </p>
                                        {exercise.examples && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {exercise.examples}
                                            </p>
                                        )}
                                    </div>
                                    <div className={`w-4 h-4 rounded border ${isSelected
                                        ? 'bg-red-500 border-red-500'
                                        : 'border-gray-400'
                                        }`}>
                                        {isSelected && (
                                            <CheckCircle className="w-full h-full text-white" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Warnings */}
            {getVolumePrediction().warning && (
                <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-200 text-sm">
                            <strong>High Volume Warning:</strong> 70% BBB is extremely challenging.
                            Ensure excellent recovery (sleep, nutrition) and consider starting with lower intensity.
                        </div>
                    </div>
                </div>
            )}

            {additionalAssistance.length > 3 && (
                <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-200 text-sm">
                            <strong>Volume Warning:</strong> You've selected {additionalAssistance.length} additional exercises.
                            BBB already provides high volume - consider limiting to 2-3 exercises maximum.
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 12 Complete! BBB template configured with {intensityOptions[intensityLevel].percentage}% intensity
                            and {additionalAssistance.length} additional exercises.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
