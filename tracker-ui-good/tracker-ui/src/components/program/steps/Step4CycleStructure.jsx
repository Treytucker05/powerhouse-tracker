import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { percentOfTM, toDisplayWeight } from '../../../lib/fiveThreeOne/math.js';
import { BarChart3, Target, AlertCircle, CheckCircle, Info, Settings } from 'lucide-react';

export default function Step4CycleStructure({ data, updateData }) {
    const { roundingIncrement } = useSettings();
    const [loadingOption, setLoadingOption] = useState(data.loadingOption || 1);
    const [perLiftOptions, setPerLiftOptions] = useState(data.perLiftOptions || {
        squat: 1,
        bench: 1,
        deadlift: 1,
        overhead_press: 1
    });
    const [usePerLiftOptions, setUsePerLiftOptions] = useState(data.usePerLiftOptions || false);
    const [deadliftStyle, setDeadliftStyle] = useState(data.deadliftStyle || 'dead_stop');
    const [cyclePreview, setCyclePreview] = useState(data.cyclePreview || 3);
    const [trainingMaxes, setTrainingMaxes] = useState(data.trainingMaxes || {});
    const [calculatedWeights, setCalculatedWeights] = useState({});

    const loadingOptions = {
        1: {
            name: 'Option 1 (Recommended)',
            description: 'Standard progression for most lifters',
            weeks: {
                1: { sets: [{ percent: 65, reps: 5 }, { percent: 75, reps: 5 }, { percent: 85, reps: '5+' }] },
                2: { sets: [{ percent: 70, reps: 3 }, { percent: 80, reps: 3 }, { percent: 90, reps: '3+' }] },
                3: { sets: [{ percent: 75, reps: 5 }, { percent: 85, reps: 3 }, { percent: 95, reps: '1+' }] },
                4: { sets: [{ percent: 40, reps: 5 }, { percent: 50, reps: 5 }, { percent: 60, reps: 5 }] }
            },
            characteristics: 'Moderate intensity, good for building base',
            bestFor: 'Beginners to intermediate, establishing routine'
        },
        2: {
            name: 'Option 2 (Higher Intensity)',
            description: 'More aggressive progression',
            weeks: {
                1: { sets: [{ percent: 75, reps: 5 }, { percent: 80, reps: 5 }, { percent: 85, reps: '5+' }] },
                2: { sets: [{ percent: 80, reps: 3 }, { percent: 85, reps: 3 }, { percent: 90, reps: '3+' }] },
                3: { sets: [{ percent: 85, reps: 5 }, { percent: 90, reps: 3 }, { percent: 95, reps: '1+' }] },
                4: { sets: [{ percent: 40, reps: 5 }, { percent: 50, reps: 5 }, { percent: 60, reps: 5 }] }
            },
            characteristics: 'Higher intensity, faster strength gains',
            bestFor: 'Experienced lifters, competition prep'
        }
    };

    const deadliftStyles = {
        'dead_stop': {
            name: 'Dead Stop',
            description: 'Full reset between reps',
            pros: ['More technically demanding', 'Builds starting strength', 'Traditional powerlifting style'],
            cons: ['More time between reps', 'Requires more setup'],
            technique: 'Lower bar to floor, pause, reset grip/position, lift'
        },
        'touch_and_go': {
            name: 'Touch and Go',
            description: 'Continuous reps with brief floor contact',
            pros: ['Faster pace', 'Can be safer if tightness maintained', 'Good for volume'],
            cons: ['Requires constant tension', 'Less starting strength focus'],
            technique: 'Light touch to floor, maintain position, immediate lift'
        }
    };

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    const repTargets = {
        '5+': { min: 5, good: 8, excellent: 10, description: 'Week 1 - Volume focus' },
        '3+': { min: 3, good: 5, excellent: 6, description: 'Week 2 - Intensity bridge' },
        '1+': { min: 1, good: 3, excellent: 4, description: 'Week 3 - Peak intensity' }
    };

    // Calculate weights using shared math
    const calculateWeight = (tm, percentage) => {
        if (!tm || tm === 0) return 0;
        return toDisplayWeight(percentOfTM(tm, percentage, roundingIncrement));
    };

    // Calculate all weights for a given TM and loading option
    const calculateAllWeights = (tm, option) => {
        const optionData = loadingOptions[option];
        const weights = {};

        Object.entries(optionData.weeks).forEach(([week, weekData]) => {
            weights[week] = weekData.sets.map(set => ({
                ...set,
                weight: calculateWeight(tm, set.percent)
            }));
        });

        return weights;
    };

    // Calculate cycle progressions
    const calculateCycleProgressions = (currentTM, lift, cycles = 3) => {
        const progressions = [];
        let tm = currentTM;

        // Increment rules: +5 for upper body, +10 for lower body
        const increment = (lift === 'bench' || lift === 'overhead_press') ? 5 : 10;

        for (let cycle = 1; cycle <= cycles; cycle++) {
            if (cycle > 1) {
                tm += increment;
            }

            const option = usePerLiftOptions ? perLiftOptions[lift] : loadingOption;
            const weights = calculateAllWeights(tm, option);

            progressions.push({
                cycle,
                tm,
                weights,
                increment: cycle === 1 ? 0 : increment
            });
        }

        return progressions;
    };

    // Update calculated weights when TMs or options change
    useEffect(() => {
        if (Object.keys(trainingMaxes).length > 0) {
            const newWeights = {};

            Object.entries(trainingMaxes).forEach(([lift, tm]) => {
                newWeights[lift] = calculateCycleProgressions(tm, lift, cyclePreview);
            });

            setCalculatedWeights(newWeights);
        }
    }, [trainingMaxes, loadingOption, perLiftOptions, usePerLiftOptions, cyclePreview]);

    // Get training maxes from Step 1
    useEffect(() => {
        if (data.trainingMaxes && Object.keys(data.trainingMaxes).length > 0) {
            setTrainingMaxes(data.trainingMaxes);
        }
    }, [data.trainingMaxes]);

    const handleLoadingOptionChange = (option) => {
        setLoadingOption(option);
        if (!usePerLiftOptions) {
            // Update all lifts to same option
            const newPerLiftOptions = {};
            Object.keys(perLiftOptions).forEach(lift => {
                newPerLiftOptions[lift] = option;
            });
            setPerLiftOptions(newPerLiftOptions);
        }
        updateStepData({ loadingOption: option });
    };

    const handlePerLiftOptionChange = (lift, option) => {
        const newPerLiftOptions = { ...perLiftOptions, [lift]: option };
        setPerLiftOptions(newPerLiftOptions);
        updateStepData({ perLiftOptions: newPerLiftOptions });
    };

    const handleUsePerLiftToggle = (enabled) => {
        setUsePerLiftOptions(enabled);
        updateStepData({ usePerLiftOptions: enabled });
    };

    const handleDeadliftStyleChange = (style) => {
        setDeadliftStyle(style);
        updateStepData({ deadliftStyle: style });
    };

    const handleCyclePreviewChange = (cycles) => {
        setCyclePreview(cycles);
        updateStepData({ cyclePreview: cycles });
    };

    const updateStepData = (updates) => {
        updateData({
            loadingOption,
            perLiftOptions,
            usePerLiftOptions,
            deadliftStyle,
            cyclePreview,
            trainingMaxes,
            ...updates
        });
    };

    const isStepComplete = () => {
        return Object.keys(trainingMaxes).length > 0 && deadliftStyle !== '';
    };

    const getPerformanceIndicator = (week, reps) => {
        const target = repTargets[week + '+'];
        if (!target) return 'neutral';

        if (reps >= target.excellent) return 'excellent';
        if (reps >= target.good) return 'good';
        if (reps >= target.min) return 'acceptable';
        return 'poor';
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 4: Implement the 5/3/1 Cycle Structure
                </h3>
                <p className="text-gray-400">
                    Configure your percentage scheme, cycle structure, and performance targets.
                </p>
            </div>

            {/* 5/3/1 Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">5/3/1 Core Principles</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Progressive Intensity:</strong> Week 1 (Volume) → Week 2 (Bridge) → Week 3 (Peak)</li>
                            <li>• <strong>AMRAP Philosophy:</strong> Beat rep PRs, not weight PRs</li>
                            <li>• <strong>Submaximal Training:</strong> All percentages based on 90% Training Max</li>
                            <li>• <strong>Planned Recovery:</strong> Deload every 4th week</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Loading Option Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Select Loading Option</h4>
                <div className="space-y-4">
                    {Object.entries(loadingOptions).map(([option, details]) => (
                        <div
                            key={option}
                            onClick={() => handleLoadingOptionChange(parseInt(option))}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${loadingOption === parseInt(option)
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className="text-white font-medium">{details.name}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{details.description}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div><strong>Characteristics:</strong> {details.characteristics}</div>
                                        <div><strong>Best for:</strong> {details.bestFor}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Percentage Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-600">
                                            <th className="text-left text-gray-300 py-2">Week</th>
                                            <th className="text-center text-gray-300 py-2">Set 1</th>
                                            <th className="text-center text-gray-300 py-2">Set 2</th>
                                            <th className="text-center text-gray-300 py-2">Set 3</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(details.weeks).map(([week, weekData]) => (
                                            <tr key={week} className="border-b border-gray-700">
                                                <td className="py-2 text-gray-300">
                                                    Week {week} {week === '4' && '(Deload)'}
                                                </td>
                                                {weekData.sets.map((set, index) => (
                                                    <td key={index} className="text-center py-2 text-white">
                                                        {set.percent}% × {set.reps}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Per-Lift Options */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">Advanced: Per-Lift Loading Options</h4>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="per_lift_options"
                            checked={usePerLiftOptions}
                            onChange={(e) => handleUsePerLiftToggle(e.target.checked)}
                            className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor="per_lift_options" className="text-gray-300 text-sm">
                            Use different options per lift
                        </label>
                    </div>
                </div>

                {usePerLiftOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(liftNames).map(([lift, name]) => (
                            <div key={lift} className="bg-gray-800 p-4 rounded-lg">
                                <h5 className="text-white font-medium mb-3">{name}</h5>
                                <div className="space-y-2">
                                    {Object.entries(loadingOptions).map(([option, details]) => (
                                        <div key={option} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                id={`${lift}_option_${option}`}
                                                name={`${lift}_loading`}
                                                value={option}
                                                checked={perLiftOptions[lift] === parseInt(option)}
                                                onChange={(e) => handlePerLiftOptionChange(lift, parseInt(e.target.value))}
                                                className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                                            />
                                            <label htmlFor={`${lift}_option_${option}`} className="text-gray-300 text-sm">
                                                {details.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Deadlift Style Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Deadlift Rep Style</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(deadliftStyles).map(([style, details]) => (
                        <div
                            key={style}
                            onClick={() => handleDeadliftStyleChange(style)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${deadliftStyle === style
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-center mb-2">
                                <Target className="w-5 h-5 text-blue-400 mr-2" />
                                <span className="text-white font-medium">{details.name}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{details.description}</p>

                            <div className="space-y-2 text-xs">
                                <div>
                                    <span className="text-green-400 font-medium">Pros:</span>
                                    <ul className="text-gray-300 ml-2">
                                        {details.pros.map((pro, index) => (
                                            <li key={index}>• {pro}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <span className="text-yellow-400 font-medium">Cons:</span>
                                    <ul className="text-gray-300 ml-2">
                                        {details.cons.map((con, index) => (
                                            <li key={index}>• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-2 border-t border-gray-600">
                                    <span className="text-blue-400 font-medium">Technique:</span>
                                    <p className="text-gray-300">{details.technique}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AMRAP Guidelines */}
            <div className="bg-purple-900/20 border border-purple-600 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">AMRAP Set Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(repTargets).map(([week, targets]) => (
                        <div key={week} className="bg-gray-800 p-4 rounded-lg">
                            <div className="text-purple-400 font-medium mb-2">{week} Set</div>
                            <div className="text-gray-300 text-sm mb-3">{targets.description}</div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-red-400">Minimum:</span>
                                    <span className="text-white">{targets.min} reps</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-400">Good:</span>
                                    <span className="text-white">{targets.good} reps</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-400">Excellent:</span>
                                    <span className="text-white">{targets.excellent}+ reps</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-3 bg-purple-900/20 border border-purple-600 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div className="text-purple-200 text-sm">
                            <strong>Stop Criteria:</strong> End the set when bar speed slows significantly or form begins to break down.
                            Never go to absolute failure or attempt questionable reps.
                        </div>
                    </div>
                </div>
            </div>

            {/* Cycle Preview */}
            {Object.keys(calculatedWeights).length > 0 && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-white">Cycle Preview</h4>
                        <div className="flex items-center space-x-2">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <select
                                value={cyclePreview}
                                onChange={(e) => handleCyclePreviewChange(parseInt(e.target.value))}
                                className="bg-gray-800 border border-gray-600 text-white text-sm rounded px-2 py-1"
                            >
                                <option value={2}>2 Cycles</option>
                                <option value={3}>3 Cycles</option>
                                <option value={4}>4 Cycles</option>
                                <option value={5}>5 Cycles</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(calculatedWeights).map(([lift, progressions]) => (
                            <div key={lift} className="bg-gray-800 p-4 rounded-lg">
                                <h5 className="text-white font-medium mb-3">{liftNames[lift]}</h5>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-600">
                                                <th className="text-left text-gray-300 py-2">Cycle</th>
                                                <th className="text-center text-gray-300 py-2">TM</th>
                                                <th className="text-center text-gray-300 py-2">Week 1 (85%)</th>
                                                <th className="text-center text-gray-300 py-2">Week 2 (90%)</th>
                                                <th className="text-center text-gray-300 py-2">Week 3 (95%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {progressions.map((progression) => (
                                                <tr key={progression.cycle} className="border-b border-gray-700">
                                                    <td className="py-2 text-gray-300">
                                                        {progression.cycle}
                                                        {progression.increment > 0 && (
                                                            <span className="text-green-400 text-xs ml-1">
                                                                (+{progression.increment})
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-center py-2 text-white font-medium">
                                                        {progression.tm}
                                                    </td>
                                                    <td className="text-center py-2 text-white">
                                                        {progression.weights['1'][2].weight}
                                                    </td>
                                                    <td className="text-center py-2 text-white">
                                                        {progression.weights['2'][2].weight}
                                                    </td>
                                                    <td className="text-center py-2 text-white">
                                                        {progression.weights['3'][2].weight}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 4 Complete! Cycle structure and loading options configured.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
