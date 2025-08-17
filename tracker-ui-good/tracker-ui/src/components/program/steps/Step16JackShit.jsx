import React, { useState, useEffect } from 'react';
import { Clock, Zap, AlertTriangle, CheckCircle, Info, Timer, Activity, Target } from 'lucide-react';

export default function Step16JackShit({ data, updateData }) {
    const [jackShitConfig, setJackShitConfig] = useState(data.jackShitConfig || {
        sessionDuration: '20-30', // 20-30, 15-20, 30-40 minutes
        conditioningReplacement: false,
        conditioningType: 'low_impact', // low_impact, high_impact, none
        conditioningDuration: 15, // minutes
        focusAreas: [], // time_constraints, recovery_issues, simplicity, experiment
        additionalNotes: ''
    });

    const sessionDurations = {
        '15-20': {
            name: '15-20 Minutes',
            description: 'Ultra-quick sessions',
            suitableFor: 'Extreme time constraints'
        },
        '20-30': {
            name: '20-30 Minutes',
            description: 'Standard Jack Shit duration',
            suitableFor: 'Most lifters with time constraints'
        },
        '30-40': {
            name: '30-40 Minutes',
            description: 'Extended sessions with conditioning',
            suitableFor: 'When including conditioning work'
        }
    };

    const conditioningOptions = {
        low_impact: {
            name: 'Low Impact Conditioning',
            exercises: ['Walking', 'Light cycling', 'Swimming', 'Rowing (easy pace)'],
            intensity: 'Easy conversational pace',
            duration: '20-40 minutes'
        },
        high_impact: {
            name: 'High Impact Conditioning',
            exercises: ['Hill sprints', 'Prowler pushes', 'Kettlebell swings', 'Bike intervals'],
            intensity: 'High intensity intervals',
            duration: '15-20 minutes'
        },
        none: {
            name: 'No Conditioning',
            exercises: ['Pure 5/3/1 main work only'],
            intensity: 'Focus solely on strength',
            duration: '15-25 minutes'
        }
    };

    const focusAreaOptions = [
        {
            id: 'time_constraints',
            name: 'Time Constraints',
            description: 'Very busy periods in life',
            icon: Clock
        },
        {
            id: 'recovery_issues',
            name: 'Recovery Issues',
            description: 'Overtrained or highly stressed',
            icon: AlertTriangle
        },
        {
            id: 'simplicity',
            name: 'Simplicity Focus',
            description: 'Want to focus solely on main lifts',
            icon: Target
        },
        {
            id: 'experiment',
            name: 'Strength Experiment',
            description: 'Test gains from basics alone',
            icon: Activity
        }
    ];

    const handleSessionDurationChange = (duration) => {
        setJackShitConfig(prev => ({
            ...prev,
            sessionDuration: duration
        }));
        updateStepData({ jackShitConfig: { ...jackShitConfig, sessionDuration: duration } });
    };

    const handleConditioningChange = (type) => {
        setJackShitConfig(prev => ({
            ...prev,
            conditioningType: type,
            conditioningReplacement: type !== 'none'
        }));
        updateStepData({
            jackShitConfig: {
                ...jackShitConfig,
                conditioningType: type,
                conditioningReplacement: type !== 'none'
            }
        });
    };

    const handleFocusAreaToggle = (areaId) => {
        const currentFocus = jackShitConfig.focusAreas || [];
        const isSelected = currentFocus.includes(areaId);

        let newFocus;
        if (isSelected) {
            newFocus = currentFocus.filter(id => id !== areaId);
        } else {
            newFocus = [...currentFocus, areaId];
        }

        setJackShitConfig(prev => ({
            ...prev,
            focusAreas: newFocus
        }));
        updateStepData({ jackShitConfig: { ...jackShitConfig, focusAreas: newFocus } });
    };

    const handleConditioningDurationChange = (duration) => {
        setJackShitConfig(prev => ({
            ...prev,
            conditioningDuration: duration
        }));
        updateStepData({ jackShitConfig: { ...jackShitConfig, conditioningDuration: duration } });
    };

    const updateStepData = (updates) => {
        updateData({
            jackShitConfig: updates.jackShitConfig || jackShitConfig,
            ...updates
        });
    };

    const isStepComplete = () => {
        return jackShitConfig.sessionDuration &&
            jackShitConfig.conditioningType &&
            (jackShitConfig.focusAreas?.length || 0) > 0;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 16: "Jack Shit" Template
                </h3>
                <p className="text-gray-400">
                    The ultimate minimalist approach - just 5/3/1 main work with zero assistance exercises
                </p>
            </div>

            {/* Philosophy Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Jack Shit Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• Pure focus on the four main lifts - nothing else</li>
                            <li>• Perfect for time-constrained periods or recovery phases</li>
                            <li>• Tests what strength gains come from basics alone</li>
                            <li>• Sessions typically last 20-30 minutes maximum</li>
                            <li>• Can optionally replace assistance with brief conditioning</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Focus Areas Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-400" />
                    Why Are You Using Jack Shit?
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Select your primary reasons for choosing this minimalist approach
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {focusAreaOptions.map((area) => {
                        const IconComponent = area.icon;
                        const isSelected = (jackShitConfig.focusAreas || []).includes(area.id);

                        return (
                            <div
                                key={area.id}
                                onClick={() => handleFocusAreaToggle(area.id)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                        ? 'border-red-500 bg-red-900/20'
                                        : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <IconComponent className={`w-5 h-5 ${isSelected ? 'text-red-400' : 'text-gray-400'
                                        }`} />
                                    <div>
                                        <h5 className="text-white font-medium">{area.name}</h5>
                                        <p className="text-gray-400 text-sm">{area.description}</p>
                                    </div>
                                    {isSelected && <CheckCircle className="w-5 h-5 text-red-400 ml-auto" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Session Duration */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Timer className="w-5 h-5 mr-2 text-red-400" />
                    Target Session Duration
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(sessionDurations).map(([key, duration]) => (
                        <div
                            key={key}
                            onClick={() => handleSessionDurationChange(key)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${jackShitConfig.sessionDuration === key
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <h5 className="text-white font-medium mb-1">{duration.name}</h5>
                            <p className="text-gray-400 text-sm mb-2">{duration.description}</p>
                            <p className="text-gray-500 text-xs italic">{duration.suitableFor}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conditioning Integration */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-red-400" />
                    Optional Conditioning Integration
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Since there's no assistance work, you can optionally add brief conditioning
                </p>

                <div className="space-y-4">
                    {Object.entries(conditioningOptions).map(([key, option]) => (
                        <div
                            key={key}
                            onClick={() => handleConditioningChange(key)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${jackShitConfig.conditioningType === key
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="text-white font-medium">{option.name}</h5>
                                {jackShitConfig.conditioningType === key && (
                                    <CheckCircle className="w-5 h-5 text-red-400" />
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Exercises:</span>
                                    <p className="text-gray-300">{option.exercises.join(', ')}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Intensity:</span>
                                    <p className="text-gray-300">{option.intensity}</p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Duration:</span>
                                    <p className="text-gray-300">{option.duration}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Conditioning Duration Adjustment */}
                {jackShitConfig.conditioningType !== 'none' && (
                    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <label className="block text-white font-medium mb-2">
                            Conditioning Duration (minutes)
                        </label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="range"
                                min="10"
                                max="30"
                                value={jackShitConfig.conditioningDuration}
                                onChange={(e) => handleConditioningDurationChange(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-white font-medium w-12 text-center">
                                {jackShitConfig.conditioningDuration}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mt-1">
                            <span>10 min</span>
                            <span>30 min</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Implementation Guidelines */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="text-yellow-200 text-sm">
                        <h5 className="font-medium mb-2">Jack Shit Implementation Guidelines</h5>
                        <div className="space-y-2 text-xs">
                            <div>
                                <span className="font-medium">Session Structure:</span>
                                <p>Warm-up → 5/3/1 main lift → Optional conditioning → Done</p>
                            </div>
                            <div>
                                <span className="font-medium">When to Use:</span>
                                <p>Busy periods, recovery phases, or when testing strength from basics alone</p>
                            </div>
                            <div>
                                <span className="font-medium">What NOT to Do:</span>
                                <p>Don't add assistance exercises - that defeats the purpose of Jack Shit</p>
                            </div>
                            <div>
                                <span className="font-medium">Duration Guidelines:</span>
                                <p>Can be used for 3-6 week blocks or indefinitely if meeting goals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sample Session Structure */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Sample Jack Shit Session</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-900/20 border border-red-600 rounded-full flex items-center justify-center text-red-400 font-medium text-xs">
                            1
                        </div>
                        <div>
                            <span className="text-white font-medium">Warm-up:</span>
                            <span className="text-gray-400 ml-2">5-8 minutes mobility + specific warm-up sets</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-900/20 border border-red-600 rounded-full flex items-center justify-center text-red-400 font-medium text-xs">
                            2
                        </div>
                        <div>
                            <span className="text-white font-medium">Main Work:</span>
                            <span className="text-gray-400 ml-2">5/3/1 sets for one main lift (8-12 minutes)</span>
                        </div>
                    </div>
                    {jackShitConfig.conditioningType !== 'none' && (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-900/20 border border-red-600 rounded-full flex items-center justify-center text-red-400 font-medium text-xs">
                                3
                            </div>
                            <div>
                                <span className="text-white font-medium">Conditioning:</span>
                                <span className="text-gray-400 ml-2">
                                    {jackShitConfig.conditioningDuration} minutes {conditioningOptions[jackShitConfig.conditioningType]?.name.toLowerCase()}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-900/20 border border-green-600 rounded-full flex items-center justify-center text-green-400 font-medium text-xs">
                            ✓
                        </div>
                        <div>
                            <span className="text-white font-medium">Total Time:</span>
                            <span className="text-gray-400 ml-2">{sessionDurations[jackShitConfig.sessionDuration]?.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 16 Complete! Jack Shit template configured for {sessionDurations[jackShitConfig.sessionDuration]?.name} sessions
                            {jackShitConfig.conditioningType !== 'none' && ` with ${jackShitConfig.conditioningDuration}-minute conditioning`}.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
