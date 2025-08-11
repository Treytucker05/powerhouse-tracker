import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { percentOfTM, toDisplayWeight } from '../../../lib/fiveThreeOne/math.js';
import { Timer, Activity, CheckCircle, Info, Clock } from 'lucide-react';

export default function Step3WarmUp({ data, updateData }) {
    const { roundingIncrement } = useSettings();
    const [warmUpStyle, setWarmUpStyle] = useState(data.warmUpStyle || '');
    const [customComponents, setCustomComponents] = useState(data.customComponents || {
        softTissue: false,
        dynamicMobility: false,
        lightCardio: false,
        specificWarmUp: true // Always required
    });
    const [softTissueAreas, setSoftTissueAreas] = useState(data.softTissueAreas || {
        itBands: false,
        quads: false,
        hamstrings: false,
        back: false,
        piriformis: false
    });
    const [cardioOption, setCardioOption] = useState(data.cardioOption || 'jump_rope');
    const [trainingMaxes, setTrainingMaxes] = useState(data.trainingMaxes || {});

    const warmUpPresets = {
        'full_routine': {
            name: 'Full Routine (15-25 minutes)',
            description: 'Complete warm-up with all components',
            components: {
                softTissue: true,
                dynamicMobility: true,
                lightCardio: true,
                specificWarmUp: true
            },
            softTissueAreas: {
                itBands: true,
                quads: true,
                hamstrings: true,
                back: true,
                piriformis: true
            },
            bestFor: 'Beginners, injury prevention, thorough preparation',
            timeEstimate: '15-25 minutes'
        },
        'standard': {
            name: 'Standard Routine (8-12 minutes)',
            description: 'Dynamic mobility + specific warm-ups',
            components: {
                softTissue: false,
                dynamicMobility: true,
                lightCardio: false,
                specificWarmUp: true
            },
            softTissueAreas: {},
            bestFor: 'Most lifters, balanced approach',
            timeEstimate: '8-12 minutes'
        },
        'office_worker': {
            name: 'Office Worker Special (12-18 minutes)',
            description: 'Extra hip and shoulder mobility',
            components: {
                softTissue: true,
                dynamicMobility: true,
                lightCardio: true,
                specificWarmUp: true
            },
            softTissueAreas: {
                itBands: true,
                quads: true,
                back: true,
                piriformis: true
            },
            bestFor: 'Desk workers, tight hips/shoulders',
            timeEstimate: '12-18 minutes'
        },
        'athlete': {
            name: 'Athlete Prep (10-15 minutes)',
            description: 'Dynamic preparation focused routine',
            components: {
                softTissue: false,
                dynamicMobility: true,
                lightCardio: true,
                specificWarmUp: true
            },
            softTissueAreas: {},
            bestFor: 'Athletes, dynamic warm-up preference',
            timeEstimate: '10-15 minutes'
        },
        'minimal': {
            name: 'Minimal (5-8 minutes)',
            description: 'Specific warm-ups only',
            components: {
                softTissue: false,
                dynamicMobility: false,
                lightCardio: false,
                specificWarmUp: true
            },
            softTissueAreas: {},
            bestFor: 'Advanced lifters, time constraints',
            timeEstimate: '5-8 minutes'
        },
        'custom': {
            name: 'Custom Routine',
            description: 'Build your own warm-up sequence',
            components: customComponents,
            softTissueAreas: softTissueAreas,
            bestFor: 'Experienced users with specific needs',
            timeEstimate: 'Variable'
        }
    };

    const softTissueOptions = {
        itBands: { name: 'IT Bands', time: '1-2 min' },
        quads: { name: 'Quadriceps', time: '1-2 min' },
        hamstrings: { name: 'Hamstrings', time: '1-2 min' },
        back: { name: 'Upper/Lower Back', time: '1-2 min' },
        piriformis: { name: 'Piriformis/Glutes', time: '1-2 min' }
    };

    const dynamicMovements = [
        { name: 'Leg Swings (Forward/Back)', reps: '3-5 sets × 10 seconds each leg' },
        { name: 'Leg Swings (Side to Side)', reps: '3-5 sets × 10 seconds each leg' },
        { name: 'Arm Circles', reps: '3-5 sets × 10 seconds each direction' },
        { name: 'Hip Flexor Stretches', reps: '3-5 sets × 10 seconds each side' },
        { name: 'Shoulder Dislocations', reps: '3-5 sets × 10 reps' }
    ];

    const cardioOptions = {
        'jump_rope': {
            name: 'Jump Rope Pattern',
            description: '100/50/50/100/50/100 jumps with 30s rest',
            time: '5-8 minutes'
        },
        'rowing': {
            name: 'Light Rowing',
            description: '5-10 minutes easy pace',
            time: '5-10 minutes'
        },
        'biking': {
            name: 'Stationary Bike',
            description: '5-10 minutes easy pace',
            time: '5-10 minutes'
        },
        'walking': {
            name: 'Treadmill Walk',
            description: '5-10 minutes moderate pace',
            time: '5-10 minutes'
        }
    };

    // Calculate specific warm-up weights
    const calculateWarmUpWeights = (tm) => {
        if (!tm || tm === 0) return null;
        return {
            set1: { percentage: 40, weight: toDisplayWeight(percentOfTM(tm, 40, roundingIncrement)), reps: 5 },
            set2: { percentage: 50, weight: toDisplayWeight(percentOfTM(tm, 50, roundingIncrement)), reps: 5 },
            set3: { percentage: 60, weight: toDisplayWeight(percentOfTM(tm, 60, roundingIncrement)), reps: 3 }
        };
    };

    // Calculate total time estimate
    const calculateTimeEstimate = () => {
        let totalTime = 0;

        if (warmUpStyle === 'custom') {
            if (customComponents.softTissue) {
                const selectedAreas = Object.values(softTissueAreas).filter(Boolean).length;
                totalTime += selectedAreas * 1.5; // 1-2 min per area
            }
            if (customComponents.dynamicMobility) totalTime += 4; // 3-5 minutes
            if (customComponents.lightCardio) totalTime += 7; // 5-10 minutes average
            if (customComponents.specificWarmUp) totalTime += 6; // 5-8 minutes
        } else if (warmUpPresets[warmUpStyle]) {
            const preset = warmUpPresets[warmUpStyle];
            const timeRange = preset.timeEstimate.match(/(\d+)-(\d+)/);
            if (timeRange) {
                totalTime = (parseInt(timeRange[1]) + parseInt(timeRange[2])) / 2;
            }
        }

        return Math.round(totalTime);
    };

    const handlePresetChange = (preset) => {
        setWarmUpStyle(preset);

        if (preset !== 'custom' && warmUpPresets[preset]) {
            const presetData = warmUpPresets[preset];
            setCustomComponents(presetData.components);
            setSoftTissueAreas(presetData.softTissueAreas);
        }

        updateStepData({ warmUpStyle: preset });
    };

    const handleComponentToggle = (component, enabled) => {
        const newComponents = { ...customComponents, [component]: enabled };

        // Specific warm-up is always required
        if (component === 'specificWarmUp') {
            newComponents.specificWarmUp = true;
            return;
        }

        setCustomComponents(newComponents);
        updateStepData({ customComponents: newComponents });
    };

    const handleSoftTissueToggle = (area, enabled) => {
        const newAreas = { ...softTissueAreas, [area]: enabled };
        setSoftTissueAreas(newAreas);
        updateStepData({ softTissueAreas: newAreas });
    };

    const handleCardioChange = (option) => {
        setCardioOption(option);
        updateStepData({ cardioOption: option });
    };

    const updateStepData = (updates) => {
        updateData({
            warmUpStyle,
            customComponents,
            softTissueAreas,
            cardioOption,
            trainingMaxes,
            ...updates
        });
    };

    const isStepComplete = () => {
        return warmUpStyle !== '';
    };

    const getActiveComponents = () => {
        if (warmUpStyle === 'custom') {
            return customComponents;
        } else if (warmUpPresets[warmUpStyle]) {
            return warmUpPresets[warmUpStyle].components;
        }
        return {};
    };

    const getActiveSoftTissueAreas = () => {
        if (warmUpStyle === 'custom') {
            return softTissueAreas;
        } else if (warmUpPresets[warmUpStyle]) {
            return warmUpPresets[warmUpStyle].softTissueAreas;
        }
        return {};
    };

    // Get training maxes from previous step (Step 1 data)
    React.useEffect(() => {
        if (data.trainingMaxes && Object.keys(data.trainingMaxes).length > 0) {
            setTrainingMaxes(data.trainingMaxes);
        }
    }, [data.trainingMaxes]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 3: Warm-Up Protocols and Mobility Preparation
                </h3>
                <p className="text-gray-400">
                    Design your warm-up routine to prepare for safe, effective training.
                </p>
            </div>

            {/* Warm-Up Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Warm-Up Principles</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>• <strong>Don't over-warm-up:</strong> Save energy for work sets</li>
                            <li>• <strong>Specific warm-ups are mandatory:</strong> 40%/50%/60% of TM</li>
                            <li>• <strong>Adjust for individual needs:</strong> Age, injury history, stiffness</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Warm-Up Style Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Choose Your Warm-Up Style</h4>
                <div className="space-y-3">
                    {Object.entries(warmUpPresets).map(([preset, details]) => (
                        <div
                            key={preset}
                            onClick={() => handlePresetChange(preset)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${warmUpStyle === preset
                                ? 'border-red-500 bg-red-900/20'
                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <Timer className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className="text-white font-medium">{details.name}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{details.description}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div><strong>Best for:</strong> {details.bestFor}</div>
                                        <div className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {details.timeEstimate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Components (if custom selected) */}
            {warmUpStyle === 'custom' && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Customize Your Routine</h4>

                    <div className="space-y-4">
                        {/* Component Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="soft_tissue"
                                            checked={customComponents.softTissue}
                                            onChange={(e) => handleComponentToggle('softTissue', e.target.checked)}
                                            className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                                        />
                                        <label htmlFor="soft_tissue" className="text-white font-medium">
                                            Soft Tissue Work
                                        </label>
                                    </div>
                                    <span className="text-gray-400 text-sm">5-8 min</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="dynamic_mobility"
                                            checked={customComponents.dynamicMobility}
                                            onChange={(e) => handleComponentToggle('dynamicMobility', e.target.checked)}
                                            className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                                        />
                                        <label htmlFor="dynamic_mobility" className="text-white font-medium">
                                            Dynamic Mobility
                                        </label>
                                    </div>
                                    <span className="text-gray-400 text-sm">3-5 min</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="light_cardio"
                                            checked={customComponents.lightCardio}
                                            onChange={(e) => handleComponentToggle('lightCardio', e.target.checked)}
                                            className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                                        />
                                        <label htmlFor="light_cardio" className="text-white font-medium">
                                            Light Cardio
                                        </label>
                                    </div>
                                    <span className="text-gray-400 text-sm">5-10 min</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="specific_warmup"
                                            checked={true}
                                            disabled={true}
                                            className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded opacity-50"
                                        />
                                        <label htmlFor="specific_warmup" className="text-white font-medium">
                                            Specific Warm-Up Sets <span className="text-red-400">*</span>
                                        </label>
                                    </div>
                                    <span className="text-gray-400 text-sm">5-8 min</span>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-white font-medium mb-2">Estimated Total Time</div>
                                <div className="text-2xl font-bold text-red-400">{calculateTimeEstimate()} minutes</div>
                                <div className="text-gray-400 text-sm mt-1">* Required component</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Soft Tissue Details */}
            {(warmUpStyle === 'custom' ? customComponents.softTissue : getActiveComponents().softTissue) && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Soft Tissue Work</h4>
                    <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                        <p className="text-blue-200 text-sm">
                            <strong>Protocol:</strong> 30-50 rolls per area, focus on tight spots
                        </p>
                    </div>

                    {warmUpStyle === 'custom' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(softTissueOptions).map(([area, details]) => (
                                <div key={area} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={area}
                                            checked={softTissueAreas[area]}
                                            onChange={(e) => handleSoftTissueToggle(area, e.target.checked)}
                                            className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                                        />
                                        <label htmlFor={area} className="text-gray-300">
                                            {details.name}
                                        </label>
                                    </div>
                                    <span className="text-gray-400 text-sm">{details.time}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(getActiveSoftTissueAreas()).map(([area, enabled]) => {
                                if (!enabled) return null;
                                return (
                                    <div key={area} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span className="text-gray-300">
                                                {softTissueOptions[area]?.name || area}
                                            </span>
                                        </div>
                                        <span className="text-gray-400 text-sm">
                                            {softTissueOptions[area]?.time || '1-2 min'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Dynamic Mobility Details */}
            {(warmUpStyle === 'custom' ? customComponents.dynamicMobility : getActiveComponents().dynamicMobility) && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Dynamic Mobility</h4>
                    <div className="space-y-3">
                        {dynamicMovements.map((movement, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    <span className="text-gray-300">{movement.name}</span>
                                </div>
                                <span className="text-gray-400 text-sm">{movement.reps}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Light Cardio Details */}
            {(warmUpStyle === 'custom' ? customComponents.lightCardio : getActiveComponents().lightCardio) && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Light Cardio</h4>

                    {warmUpStyle === 'custom' && (
                        <div className="mb-4 space-y-2">
                            {Object.entries(cardioOptions).map(([option, details]) => (
                                <div key={option} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id={option}
                                        name="cardio"
                                        value={option}
                                        checked={cardioOption === option}
                                        onChange={(e) => handleCardioChange(e.target.value)}
                                        className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                                    />
                                    <label htmlFor={option} className="text-gray-300 text-sm">
                                        <strong>{details.name}:</strong> {details.description}
                                        <span className="text-gray-400 ml-2">({details.time})</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {cardioOption === 'jump_rope' && (
                        <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded-lg">
                            <div className="text-yellow-300 font-medium mb-2">Jump Rope Pattern</div>
                            <div className="text-yellow-200 text-sm">
                                100 jumps → 30s rest → 50 jumps → 30s rest → 50 jumps → 30s rest →
                                100 jumps → 30s rest → 50 jumps → 30s rest → 100 jumps
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Specific Warm-Up Sets */}
            <div className="bg-green-900/20 border border-green-600 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">
                    Specific Warm-Up Sets (Required)
                </h4>
                <div className="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                    <p className="text-green-200 text-sm">
                        <strong>Protocol:</strong> Performed before main 5/3/1 sets every training day
                    </p>
                </div>

                {Object.keys(trainingMaxes).length > 0 ? (
                    <div className="space-y-4">
                        {Object.entries(trainingMaxes).map(([lift, tm]) => {
                            const weights = calculateWarmUpWeights(tm);
                            if (!weights) return null;

                            const liftNames = {
                                squat: 'Squat',
                                bench: 'Bench Press',
                                deadlift: 'Deadlift',
                                overhead_press: 'Overhead Press'
                            };

                            return (
                                <div key={lift} className="bg-gray-800 p-4 rounded-lg">
                                    <h5 className="text-white font-medium mb-3">{liftNames[lift]} (TM: {tm} lbs)</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="text-center">
                                            <div className="text-gray-400 text-sm">Set 1</div>
                                            <div className="text-white font-medium">{weights.set1.weight} lbs × {weights.set1.reps}</div>
                                            <div className="text-gray-500 text-xs">{weights.set1.percentage}% TM</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-gray-400 text-sm">Set 2</div>
                                            <div className="text-white font-medium">{weights.set2.weight} lbs × {weights.set2.reps}</div>
                                            <div className="text-gray-500 text-xs">{weights.set2.percentage}% TM</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-gray-400 text-sm">Set 3</div>
                                            <div className="text-white font-medium">{weights.set3.weight} lbs × {weights.set3.reps}</div>
                                            <div className="text-gray-500 text-xs">{weights.set3.percentage}% TM</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded-lg">
                        <p className="text-yellow-200 text-sm">
                            Complete Step 1 to see calculated warm-up weights for each lift
                        </p>
                    </div>
                )}
            </div>

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 3 Complete! Warm-up routine configured.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
