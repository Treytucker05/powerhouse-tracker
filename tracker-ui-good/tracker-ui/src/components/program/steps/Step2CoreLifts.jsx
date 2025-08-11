import React, { useState } from 'react';
import { Dumbbell, Calendar, AlertTriangle, CheckCircle, Info, Clock, Users } from 'lucide-react';

export default function Step2CoreLifts({ data, updateData }) {
    const [coreLifts, setCoreLifts] = useState(data.coreLifts || {
        squat: 'back_squat',
        bench: 'bench_press',
        deadlift: 'conventional_deadlift',
        overhead_press: 'military_press'
    });
    const [customLifts, setCustomLifts] = useState(data.customLifts || {});
    const [trainingFrequency, setTrainingFrequency] = useState(data.trainingFrequency || '');
    const [schedulePattern, setSchedulePattern] = useState(data.schedulePattern || '');
    const [equipmentAccess, setEquipmentAccess] = useState(data.equipmentAccess || {
        barbell: false,
        squat_rack: false,
        bench: false,
        plates: false
    });
    const [injuryLimitations, setInjuryLimitations] = useState(data.injuryLimitations || {
        back: false,
        shoulders: false,
        knees: false,
        other: ''
    });

    const liftOptions = {
        squat: {
            name: 'Squat Movement',
            options: {
                back_squat: 'Back Squat (Default)',
                front_squat: 'Front Squat',
                custom: 'Custom Squat Variation'
            }
        },
        bench: {
            name: 'Bench Movement',
            options: {
                bench_press: 'Bench Press (Default - No alternatives recommended)',
                custom: 'Custom Bench Variation'
            }
        },
        deadlift: {
            name: 'Deadlift Movement',
            options: {
                conventional_deadlift: 'Conventional Deadlift (Default)',
                trap_bar_deadlift: 'Trap Bar Deadlift',
                custom: 'Custom Deadlift Variation'
            }
        },
        overhead_press: {
            name: 'Overhead Press Movement',
            options: {
                military_press: 'Standing Military Press (Default)',
                push_press: 'Push Press',
                jerk: 'Jerk',
                custom: 'Custom Press Variation'
            }
        }
    };

    const frequencyOptions = {
        '4_day': {
            name: '4-Day Week (Recommended)',
            description: 'One core lift per day',
            scheduleOptions: ['Mon/Tue/Thu/Fri', 'Sun/Mon/Wed/Fri'],
            cycle: 'Standard 4-week cycle (3 work weeks + 1 deload)',
            bestFor: 'Most lifters with time for 4 sessions/week',
            timeCommitment: '45-90 minutes per session'
        },
        '3_day': {
            name: '3-Day Week (Rolling)',
            description: '3 workouts per week, rotating through lifts',
            scheduleOptions: ['Mon/Wed/Fri', 'Tue/Thu/Sat'],
            cycle: 'Rotate four lifts over 5 weeks, deload week 5',
            bestFor: 'Better recovery, more rest days',
            timeCommitment: '60-90 minutes per session'
        },
        '2_day': {
            name: '2-Day Week',
            description: 'Two lifts per session or alternating weeks',
            scheduleOptions: [
                'Variant A: Two lifts per session (SQ+BP, DL+OHP)',
                'Variant B: Alternating weeks (Week1: SQ/BP, Week2: DL/OHP)'
            ],
            cycle: 'Usually skip deload unless needed',
            bestFor: 'Very busy schedules, in-season athletes',
            timeCommitment: '60-120 minutes per session',
            warning: true
        },
        '1_day': {
            name: '1-Day Week (Emergency Only)',
            description: 'Extreme time constraints only',
            scheduleOptions: ['Week1: SQ+BP, Week2: DL+OHP'],
            cycle: 'Skip deload unless needed',
            bestFor: 'Extreme time constraints only',
            timeCommitment: '90+ minutes per session',
            warning: true
        }
    };

    const handleLiftChange = (liftType, liftVariation) => {
        const newCoreLifts = { ...coreLifts, [liftType]: liftVariation };
        setCoreLifts(newCoreLifts);
        updateStepData({ coreLifts: newCoreLifts });
    };

    const handleCustomLiftChange = (liftType, customName) => {
        const newCustomLifts = { ...customLifts, [liftType]: customName };
        setCustomLifts(newCustomLifts);
        updateStepData({ customLifts: newCustomLifts });
    };

    const handleFrequencyChange = (frequency) => {
        setTrainingFrequency(frequency);
        setSchedulePattern(''); // Reset schedule when frequency changes
        updateStepData({ trainingFrequency: frequency, schedulePattern: '' });
    };

    const handleScheduleChange = (pattern) => {
        setSchedulePattern(pattern);
        updateStepData({ schedulePattern: pattern });
    };

    const handleEquipmentChange = (equipment, available) => {
        const newEquipment = { ...equipmentAccess, [equipment]: available };
        setEquipmentAccess(newEquipment);
        updateStepData({ equipmentAccess: newEquipment });
    };

    const handleInjuryChange = (injury, hasInjury) => {
        const newInjuries = { ...injuryLimitations, [injury]: hasInjury };
        setInjuryLimitations(newInjuries);
        updateStepData({ injuryLimitations: newInjuries });
    };

    const updateStepData = (updates) => {
        updateData({
            coreLifts,
            customLifts,
            trainingFrequency,
            schedulePattern,
            equipmentAccess,
            injuryLimitations,
            ...updates
        });
    };

    const validateEquipment = () => {
        const required =
            equipmentAccess.barbell &&
            equipmentAccess.squat_rack &&
            equipmentAccess.bench &&
            equipmentAccess.plates;
        return required;
    };

    const getEquipmentWarnings = () => {
        const warnings = [];
        if (!equipmentAccess.barbell) warnings.push('Barbell required for 5/3/1 system');
        if (!equipmentAccess.squat_rack) warnings.push('Squat rack/power rack needed for safe squatting');
        if (!equipmentAccess.bench) warnings.push('Bench required for bench press');
        if (!equipmentAccess.plates) warnings.push('Weight plates needed for progression');
        return warnings;
    };

    const getInjuryWarnings = () => {
        const warnings = [];
        if (injuryLimitations.back) warnings.push('Consider modifications for deadlifts and squats');
        if (injuryLimitations.shoulders) warnings.push('May need to modify overhead press and bench press');
        if (injuryLimitations.knees) warnings.push('Consider squat depth limitations or alternatives');
        if (injuryLimitations.other) warnings.push('Consult with healthcare provider about modifications');
        return warnings;
    };

    const isStepComplete = () => {
        const liftsSelected = Object.values(coreLifts).every((lift) => lift !== '');
        const customLiftsNamed = Object.entries(coreLifts).every(([liftType, variation]) => {
            if (variation === 'custom') {
                return customLifts[liftType] && customLifts[liftType].trim() !== '';
            }
            return true;
        });
        const frequencySelected = trainingFrequency !== '';
        const scheduleSelected = schedulePattern !== '';

        return liftsSelected && customLiftsNamed && frequencySelected && scheduleSelected;
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                    Step 2: Choose Core Lifts and Weekly Training Frequency
                </h3>
                <p className="text-gray-400">
                    Select your four core lifts and determine your weekly training schedule.
                </p>
            </div>

            {/* Core Lifts Philosophy */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                        <h4 className="text-blue-300 font-medium mb-2">Core Lift Selection</h4>
                        <ul className="text-blue-200 text-sm space-y-1">
                            <li>
                                • <strong>Four mandatory movements:</strong> Squat, Bench, Deadlift, Overhead Press
                            </li>
                            <li>• <strong>Stick to basics:</strong> Wendler recommends minimal substitutions</li>
                            <li>• <strong>Master the movement:</strong> Technical proficiency is key</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Equipment Check */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Equipment Access</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            key: 'barbell',
                            name: 'Barbell',
                            icon: Dumbbell
                        },
                        {
                            key: 'squat_rack',
                            name: 'Squat Rack',
                            icon: Users
                        },
                        {
                            key: 'bench',
                            name: 'Bench',
                            icon: Users
                        },
                        {
                            key: 'plates',
                            name: 'Weight Plates',
                            icon: Dumbbell
                        }
                    ].map(({ key, name, icon: Icon }) => (
                        <div key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={key}
                                checked={equipmentAccess[key]}
                                onChange={(e) => handleEquipmentChange(key, e.target.checked)}
                                className="w-4 h-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                            />
                            <Icon className="w-4 h-4 text-gray-400" />
                            <label htmlFor={key} className="text-gray-300 text-sm">
                                {name}
                            </label>
                        </div>
                    ))}
                </div>

                {!validateEquipment() && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-600 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <h5 className="text-red-300 font-medium mb-1">Equipment Warnings</h5>
                                <ul className="text-red-200 text-sm space-y-1">
                                    {getEquipmentWarnings().map((warning, index) => (
                                        <li key={index}>• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Injury Limitations */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Injury Limitations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            key: 'back',
                            name: 'Lower Back Issues'
                        },
                        {
                            key: 'shoulders',
                            name: 'Shoulder Problems'
                        },
                        {
                            key: 'knees',
                            name: 'Knee Problems'
                        }
                    ].map(({ key, name }) => (
                        <div key={key} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={key}
                                checked={injuryLimitations[key]}
                                onChange={(e) => handleInjuryChange(key, e.target.checked)}
                                className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                            />
                            <label htmlFor={key} className="text-gray-300 text-sm">
                                {name}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label htmlFor="other_injury" className="block text-sm font-medium text-gray-300 mb-1">
                        Other limitations or injuries
                    </label>
                    <input
                        type="text"
                        id="other_injury"
                        value={injuryLimitations.other}
                        onChange={(e) => handleInjuryChange('other', e.target.value)}
                        placeholder="Describe any other concerns..."
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:border-yellow-500"
                    />
                </div>

                {getInjuryWarnings().length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                            <div>
                                <h5 className="text-yellow-300 font-medium mb-1">Modification Recommendations</h5>
                                <ul className="text-yellow-200 text-sm space-y-1">
                                    {getInjuryWarnings().map((warning, index) => (
                                        <li key={index}>• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Core Lift Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Select Your Core Lifts</h4>
                <div className="space-y-6">
                    {Object.entries(liftOptions).map(([liftType, liftData]) => (
                        <div key={liftType} className="bg-gray-800 p-4 rounded-lg">
                            <h5 className="text-white font-medium mb-3">{liftData.name}</h5>
                            <div className="space-y-2">
                                {Object.entries(liftData.options).map(([variation, name]) => (
                                    <div key={variation} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id={`${liftType}_${variation}`}
                                            name={liftType}
                                            value={variation}
                                            checked={coreLifts[liftType] === variation}
                                            onChange={(e) => handleLiftChange(liftType, e.target.value)}
                                            className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                                        />
                                        <label htmlFor={`${liftType}_${variation}`} className="text-gray-300 text-sm">
                                            {name}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {coreLifts[liftType] === 'custom' && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        value={customLifts[liftType] || ''}
                                        onChange={(e) => handleCustomLiftChange(liftType, e.target.value)}
                                        placeholder={`Enter custom ${liftData.name.toLowerCase()}...`}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-red-500"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Training Frequency Selection */}
            <div className="bg-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-white mb-4">Training Frequency</h4>
                <div className="space-y-4">
                    {Object.entries(frequencyOptions).map(([frequency, details]) => (
                        <div
                            key={frequency}
                            onClick={() => handleFrequencyChange(frequency)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${trainingFrequency === frequency
                                    ? 'border-red-500 bg-red-900/20'
                                    : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className="text-white font-medium">{details.name}</span>
                                        {details.warning && (
                                            <AlertTriangle className="w-4 h-4 text-yellow-400 ml-2" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{details.description}</p>
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div><strong>Cycle:</strong> {details.cycle}</div>
                                        <div><strong>Best for:</strong> {details.bestFor}</div>
                                        <div className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {details.timeCommitment}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule Pattern Selection */}
            {trainingFrequency && (
                <div className="bg-gray-700 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-white mb-4">Schedule Pattern</h4>
                    <div className="space-y-2">
                        {frequencyOptions[trainingFrequency].scheduleOptions.map((pattern, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={`schedule_${index}`}
                                    name="schedule"
                                    value={pattern}
                                    checked={schedulePattern === pattern}
                                    onChange={(e) => handleScheduleChange(e.target.value)}
                                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                                />
                                <label htmlFor={`schedule_${index}`} className="text-gray-300 text-sm">
                                    {pattern}
                                </label>
                            </div>
                        ))}
                    </div>

                    {frequencyOptions[trainingFrequency].warning && (
                        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                            <div className="flex items-start space-x-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                                <div className="text-yellow-200 text-sm">
                                    <strong>Warning:</strong> This frequency is suboptimal for most lifters.
                                    Consider if you can manage more training days for better results.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Completion Status */}
            {isStepComplete() && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-300 font-medium">
                            Step 2 Complete! Core lifts and training frequency selected.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
