import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Settings, Award, FileText, Zap, Brain, CheckCircle, Info, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';

export default function Step18ProgramCustomization({ data, updateData }) {
    const [customizationConfig, setCustomizationConfig] = useState(data.customizationConfig || {
        primaryGoal: '', // raw_strength, muscle_building, athletic_performance
        repRecordTracking: {
            enabled: true,
            prDetection: true,
            e1rmCalculation: true,
            historicalData: true
        },
        autoRegulation: {
            enabled: false,
            rpeIntegration: false,
            biofeedback: false,
            flexibleProgression: false
        },
        specialization: {
            enabled: false,
            weakLiftFocus: '',
            pauseTraining: false,
            speedWork: false
        },
        printableSheets: {
            enabled: true,
            includeWarmups: true,
            includeNotes: true,
            weeklyFormat: true
        },
        progressVisualization: {
            enabled: true,
            cycleComparison: true,
            strengthTrends: true,
            volumeTracking: true
        }
    });

    // Normalize data structure and sync with parent
    useEffect(() => {
        const normalized = {
            primaryGoal: customizationConfig.primaryGoal || '',
            repRecordTracking: {
                enabled: customizationConfig.repRecordTracking?.enabled ?? true,
                prDetection: customizationConfig.repRecordTracking?.prDetection ?? true,
                e1rmCalculation: customizationConfig.repRecordTracking?.e1rmCalculation ?? true,
                historicalData: customizationConfig.repRecordTracking?.historicalData ?? true
            },
            autoRegulation: {
                enabled: customizationConfig.autoRegulation?.enabled ?? false,
                rpeIntegration: customizationConfig.autoRegulation?.rpeIntegration ?? false,
                biofeedback: customizationConfig.autoRegulation?.biofeedback ?? false,
                flexibleProgression: customizationConfig.autoRegulation?.flexibleProgression ?? false
            },
            specialization: {
                enabled: customizationConfig.specialization?.enabled ?? false,
                weakLiftFocus: customizationConfig.specialization?.weakLiftFocus || '',
                pauseTraining: customizationConfig.specialization?.pauseTraining ?? false,
                speedWork: customizationConfig.specialization?.speedWork ?? false
            },
            printableSheets: {
                enabled: customizationConfig.printableSheets?.enabled ?? true,
                includeWarmups: customizationConfig.printableSheets?.includeWarmups ?? true,
                includeNotes: customizationConfig.printableSheets?.includeNotes ?? true,
                weeklyFormat: customizationConfig.printableSheets?.weeklyFormat ?? true
            },
            progressVisualization: {
                enabled: customizationConfig.progressVisualization?.enabled ?? true,
                cycleComparison: customizationConfig.progressVisualization?.cycleComparison ?? true,
                strengthTrends: customizationConfig.progressVisualization?.strengthTrends ?? true,
                volumeTracking: customizationConfig.progressVisualization?.volumeTracking ?? true
            }
        };

        updateData({
            step18: { customizationConfig: normalized }
        });
    }, [customizationConfig, updateData]);

    const goalConfigurations = {
        raw_strength: {
            name: 'Raw Strength Focus',
            description: 'Maximize strength in competition lifts',
            tmRecommendation: '90% for heavy singles practice',
            assistanceApproach: 'Focus on competition commands and technique',
            frequencyRecommendation: '2-3× per week per lift',
            specificFeatures: [
                'Competition command practice',
                'Pause training integration',
                'Heavy single preparation',
                'Technique refinement focus'
            ]
        },
        muscle_building: {
            name: 'Muscle Building Focus',
            description: 'Maximize muscle hypertrophy and size',
            tmRecommendation: '85% for higher volume tolerance',
            assistanceApproach: 'Emphasize bodybuilding accessories',
            frequencyRecommendation: 'Higher total weekly volume',
            specificFeatures: [
                'Higher assistance volume',
                'Hypertrophy rep ranges',
                'Bodybuilding accessories',
                'Volume progression focus'
            ]
        },
        athletic_performance: {
            name: 'Athletic Performance',
            description: 'Enhance sport-specific performance',
            tmRecommendation: '85-90% based on sport demands',
            assistanceApproach: 'Sport-specific movement patterns',
            frequencyRecommendation: 'Balanced with sport training',
            specificFeatures: [
                'Explosive movement training',
                'Sport-specific conditioning',
                'Power development focus',
                'Recovery prioritization'
            ]
        }
    };

    const autoRegulationFeatures = [
        {
            id: 'rpeIntegration',
            name: 'RPE Integration',
            description: 'Stop AMRAP sets at RPE 8-9',
            implementation: 'Use perceived exertion to guide set termination'
        },
        {
            id: 'biofeedback',
            name: 'Biofeedback Monitoring',
            description: 'Adjust based on HRV, sleep, mood',
            implementation: 'Daily readiness assessments guide training adjustments'
        },
        {
            id: 'flexibleProgression',
            name: 'Flexible Progression',
            description: 'Skip increments if performance drops',
            implementation: 'Maintain TM when performance indicators decline'
        }
    ];

    const specializationOptions = [
        {
            id: 'weakLiftFocus',
            name: 'Weak Lift Specialization',
            description: 'Extra frequency or volume for lagging lift',
            options: ['squat', 'bench', 'deadlift', 'overhead_press']
        },
        {
            id: 'pauseTraining',
            name: 'Pause Training',
            description: 'Incorporate competition commands',
            implementation: 'Add paused reps to build competition readiness'
        },
        {
            id: 'speedWork',
            name: 'Speed Work',
            description: 'Dynamic effort percentages',
            implementation: '50-60% for 8-10 sets of 3 reps with maximum speed'
        }
    ];

    const handleGoalChange = (goal) => {
        const next = { ...customizationConfig, primaryGoal: goal };
        setCustomizationConfig(next);
        updateStepData({ customizationConfig: next });
    };

    const handleFeatureToggle = (category, feature) => {
        const next = {
            ...customizationConfig,
            [category]: {
                ...customizationConfig[category],
                [feature]: !customizationConfig[category][feature]
            }
        };
        setCustomizationConfig(next);
        updateStepData({ customizationConfig: next });
    };

    const handleSpecializationToggle = (feature) => {
        if (feature === 'weakLiftFocus') return; // handled separately
        const next = {
            ...customizationConfig,
            specialization: {
                ...customizationConfig.specialization,
                [feature]: !customizationConfig.specialization?.[feature]
            }
        };
        setCustomizationConfig(next);
        updateStepData({ customizationConfig: next });
    };

    const handleWeakLiftSelection = (lift) => {
        const current = customizationConfig.specialization?.weakLiftFocus;
        const next = {
            ...customizationConfig,
            specialization: {
                ...customizationConfig.specialization,
                weakLiftFocus: current === lift ? '' : lift
            }
        };
        setCustomizationConfig(next);
        updateStepData({ customizationConfig: next });
    };

    const updateStepData = (updates) => {
        updateData({
            customizationConfig,
            ...updates
        });
    };

    const isStepComplete = () => {
        return customizationConfig.primaryGoal !== '' &&
            (customizationConfig.repRecordTracking?.enabled ||
                customizationConfig.printableSheets?.enabled ||
                customizationConfig.progressVisualization?.enabled);
    };

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 18: Program Customization and Advanced Considerations
                </h3>
                <p className="text-gray-400">
                    Advanced features, goal-specific adjustments, and progress tracking systems
                </p>
            </div>

            {/* Philosophy Box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Advanced 5/3/1 Philosophy</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• The basics work for 99% of lifters - use advanced features sparingly</li>
                            <li>• Goal-specific adjustments should enhance, not complicate the program</li>
                            <li>• Progress tracking and rep records are essential for long-term success</li>
                            <li>• Auto-regulation can help but should not replace systematic progression</li>
                            <li>• Specialization phases are temporary - return to balanced training</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Primary Goal Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-400" />
                    Primary Training Goal
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Select your primary goal to customize program recommendations
                </p>

                <div className="space-y-4">
                    {Object.entries(goalConfigurations).map(([key, goal]) => (
                        <div
                            key={key}
                            onClick={() => handleGoalChange(key)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${customizationConfig.primaryGoal === key
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="text-white font-medium">{goal.name}</h5>
                                {customizationConfig.primaryGoal === key && (
                                    <CheckCircle className="w-5 h-5 text-red-400" />
                                )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{goal.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-gray-500 font-medium">TM Recommendation:</span>
                                    <p className="text-gray-300">{goal.tmRecommendation}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 font-medium">Assistance Approach:</span>
                                    <p className="text-gray-300">{goal.assistanceApproach}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 font-medium">Frequency:</span>
                                    <p className="text-gray-300">{goal.frequencyRecommendation}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 font-medium">Features:</span>
                                    <p className="text-gray-300">{goal.specificFeatures.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rep Record Tracking */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-red-400" />
                    Rep Record Tracking System
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Configure automatic tracking of personal records and progress metrics
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                        prDetection: 'Automatic PR Detection',
                        e1rmCalculation: 'Estimated 1RM Tracking',
                        historicalData: 'Historical Data Comparison',
                        enabled: 'Enable Rep Record System'
                    }).map(([key, label]) => (
                        <div
                            key={key}
                            onClick={() => handleFeatureToggle('repRecordTracking', key)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${(customizationConfig.repRecordTracking?.[key])
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{label}</span>
                                {(customizationConfig.repRecordTracking?.[key]) && (
                                    <CheckCircle className="w-4 h-4 text-red-400" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Auto-Regulation Features */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-red-400" />
                    Auto-Regulation Options (Advanced)
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Advanced features for experienced lifters to auto-regulate training
                </p>

                <div className="mb-4">
                    <div
                        onClick={() => handleFeatureToggle('autoRegulation', 'enabled')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${(customizationConfig.autoRegulation?.enabled)
                            ? 'border-red-500 bg-red-900/20'
                            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium">Enable Auto-Regulation</span>
                            {(customizationConfig.autoRegulation?.enabled) && (
                                <CheckCircle className="w-4 h-4 text-red-400" />
                            )}
                        </div>
                    </div>
                </div>

                {(customizationConfig.autoRegulation?.enabled) && (
                    <div className="space-y-3">
                        {autoRegulationFeatures.map((feature) => (
                            <div
                                key={feature.id}
                                onClick={() => handleFeatureToggle('autoRegulation', feature.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(customizationConfig.autoRegulation?.[feature.id])
                                    ? 'border-red-500 bg-red-900/10'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-white font-medium">{feature.name}</h6>
                                    {(customizationConfig.autoRegulation?.[feature.id]) && (
                                        <CheckCircle className="w-4 h-4 text-red-400" />
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{feature.description}</p>
                                <p className="text-gray-500 text-xs">{feature.implementation}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Specialization Phases */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-red-400" />
                    Specialization Phases (Temporary)
                </h4>
                <p className="text-gray-400 mb-4 text-sm">
                    Temporary modifications to address specific weaknesses or goals
                </p>

                <div className="mb-4">
                    <div
                        onClick={() => handleFeatureToggle('specialization', 'enabled')}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${(customizationConfig.specialization?.enabled)
                            ? 'border-red-500 bg-red-900/20'
                            : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium">Enable Specialization Phase</span>
                            {(customizationConfig.specialization?.enabled) && (
                                <CheckCircle className="w-4 h-4 text-red-400" />
                            )}
                        </div>
                    </div>
                </div>

                {(customizationConfig.specialization?.enabled) && (
                    <div className="space-y-4">
                        {/* Weak Lift Focus */}
                        <div className="p-4 bg-gray-800 rounded-lg">
                            <h6 className="text-white font-medium mb-3">Weak Lift Focus</h6>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(liftNames).map(([key, name]) => (
                                    <div
                                        key={key}
                                        onClick={() => handleWeakLiftSelection(key)}
                                        className={`p-2 text-center rounded border cursor-pointer transition-all ${(customizationConfig.specialization?.weakLiftFocus) === key
                                            ? 'border-red-500 bg-red-900/20 text-red-300'
                                            : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                                            }`}
                                    >
                                        <span className="text-sm">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other Specialization Options */}
                        {specializationOptions.slice(1).map((option) => (
                            <div
                                key={option.id}
                                onClick={() => handleSpecializationToggle(option.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(customizationConfig.specialization?.[option.id])
                                    ? 'border-red-500 bg-red-900/10'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h6 className="text-white font-medium">{option.name}</h6>
                                    {(customizationConfig.specialization?.[option.id]) && (
                                        <CheckCircle className="w-4 h-4 text-red-400" />
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm">{option.description}</p>
                                {option.implementation && (
                                    <p className="text-gray-500 text-xs mt-1">{option.implementation}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Progress Tracking Features */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-red-400" />
                    Progress Tracking & Visualization
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <h6 className="text-white font-medium">Printable Workout Sheets</h6>
                        {Object.entries({
                            enabled: 'Enable Printable Sheets',
                            includeWarmups: 'Include Warm-up Sets',
                            includeNotes: 'Include Notes Section',
                            weeklyFormat: 'Weekly Format Layout'
                        }).map(([key, label]) => (
                            <div
                                key={key}
                                onClick={() => handleFeatureToggle('printableSheets', key)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(customizationConfig.printableSheets?.[key])
                                    ? 'border-red-500 bg-red-900/10'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm">{label}</span>
                                    {(customizationConfig.printableSheets?.[key]) && (
                                        <CheckCircle className="w-4 h-4 text-red-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <h6 className="text-white font-medium">Progress Visualization</h6>
                        {Object.entries({
                            enabled: 'Enable Progress Charts',
                            cycleComparison: 'Cycle-to-Cycle Comparison',
                            strengthTrends: 'Strength Trend Analysis',
                            volumeTracking: 'Volume Load Tracking'
                        }).map(([key, label]) => (
                            <div
                                key={key}
                                onClick={() => handleFeatureToggle('progressVisualization', key)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${(customizationConfig.progressVisualization?.[key])
                                    ? 'border-red-500 bg-red-900/10'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm">{label}</span>
                                    {(customizationConfig.progressVisualization?.[key]) && (
                                        <CheckCircle className="w-4 h-4 text-red-400" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced User Warning */}
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="text-yellow-200 text-sm">
                        <h5 className="font-medium mb-2">Advanced Feature Guidelines</h5>
                        <ul className="space-y-1 text-xs">
                            <li>• Start with basic 5/3/1 before adding advanced features</li>
                            <li>• Auto-regulation should enhance, not replace systematic progression</li>
                            <li>• Specialization phases are temporary (3-6 weeks maximum)</li>
                            <li>• Track progress consistently but don't overcomplicate</li>
                            <li>• Most lifters need only basic program setup - advanced features are optional</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            🎉 Complete 5/3/1 System Setup Finished!
                            Your {goalConfigurations[customizationConfig.primaryGoal]?.name || 'custom'} program is ready with
                            {customizationConfig.autoRegulation?.enabled ? ' auto-regulation' : ''}
                            {customizationConfig.specialization?.enabled ? ' and specialization features' : ''} enabled.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
