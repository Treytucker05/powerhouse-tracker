import React, { useState } from 'react';
import { Dumbbell, Calendar, AlertTriangle, CheckCircle, Info, Clock, Users, Filter, Layers, Package } from 'lucide-react';

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
    const [equipmentAccess, setEquipmentAccess] = useState({
        barbell: false,
        plates: false,
        bench: false,
        squat_rack: false,
        dumbbells: false,
        cables: false,
        machines: false,
        kettlebells: false,
        bands: false,
        suspension: false,
        pullup_bar: false,
        dip_station: false,
        rings: false,
        ...(data.equipmentAccess || {})
    });
    const [equipmentProfile, setEquipmentProfile] = useState(data.equipmentProfile || '');
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

    const applyEquipmentProfile = (profile) => {
        let preset = {};
        switch (profile) {
            case 'full':
                preset = Object.keys(equipmentAccess).reduce((acc, k) => ({ ...acc, [k]: true }), {});
                break;
            case 'home_basic':
                preset = { ...equipmentAccess, barbell: true, plates: true, bench: true, squat_rack: true, dumbbells: true, bands: true };
                break;
            case 'minimal':
                preset = { ...equipmentAccess, barbell: true, plates: true, pullup_bar: true };
                break;
            case 'bodyweight':
                preset = { ...equipmentAccess, pullup_bar: true, dip_station: true, rings: true };
                // Turn off loaded equipment
                Object.keys(preset).forEach(k => { if (!['pullup_bar', 'dip_station', 'rings'].includes(k)) preset[k] = false; });
                break;
            default:
                return;
        }
        setEquipmentAccess(preset);
        setEquipmentProfile(profile);
        updateStepData({ equipmentAccess: preset, equipmentProfile: profile });
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
        // Keep legacy requirement for core barbell lifts
        return equipmentAccess.barbell && equipmentAccess.squat_rack && equipmentAccess.bench && equipmentAccess.plates;
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

            {/* Equipment Access & Profiles (Redesigned) */}
            <div className="bg-gray-700 p-6 rounded-lg space-y-6 border border-gray-600">
                <div className="space-y-2">
                    <h4 className="text-lg font-medium text-white">Equipment Access & Profiles</h4>
                    <p className="text-gray-300 text-sm">Selected equipment determines available assistance exercises and variations. Expand availability responsibly—more options can add unnecessary decision fatigue.</p>
                    <p className="text-[11px] text-gray-400">Toggle individual items or choose a profile below. Adjustments instantly update the sample assistance filter preview.</p>
                </div>

                {/* Profiles */}
                <div>
                    <div className="text-white font-medium text-sm mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-gray-300" />Quick Profiles</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[{
                            id: 'full', title: 'Full Gym', desc: 'All equipment available'
                        }, { id: 'home_basic', title: 'Home Gym Basic', desc: 'Barbell, rack, bench, DBs, bands' }, { id: 'minimal', title: 'Minimal Setup', desc: 'Barbell + bodyweight only' }, { id: 'bodyweight', title: 'Bodyweight Only', desc: 'Rings / bar / dips' }].map(p => {
                            const active = equipmentProfile === p.id;
                            return (
                                <button key={p.id} onClick={() => applyEquipmentProfile(p.id)} className={`text-left p-3 rounded border transition bg-gray-800/50 hover:bg-gray-800 ${active ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600'}`}>
                                    <div className="text-sm font-semibold text-white">{p.title}</div>
                                    <div className="text-[11px] text-gray-400 mt-1 leading-snug">{p.desc}</div>
                                    {active && <div className="mt-1 text-[10px] text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Categorized Equipment */}
                <div className="space-y-5">
                    {[{
                        label: 'Essential', note: 'Core barbell work requirements', items: [['barbell', 'Barbell'], ['plates', 'Plates'], ['bench', 'Bench'], ['squat_rack', 'Squat Rack']]
                    }, {
                        label: 'Assistance', note: 'Expands accessory & hypertrophy options', items: [['dumbbells', 'Dumbbells'], ['cables', 'Cables'], ['machines', 'Selectorized Machines']]
                    }, {
                        label: 'Specialty', note: 'Variation & conditioning tools', items: [['kettlebells', 'Kettlebells'], ['bands', 'Bands'], ['suspension', 'Suspension Trainer']]
                    }, {
                        label: 'Bodyweight', note: 'Calisthenics apparatus', items: [['pullup_bar', 'Pull-Up Bar'], ['dip_station', 'Dip Station'], ['rings', 'Rings']]
                    }].map(cat => (
                        <div key={cat.label} className="bg-gray-800/50 border border-gray-600 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-white font-medium text-sm">{cat.label}</div>
                                    <div className="text-[11px] text-gray-400">{cat.note}</div>
                                </div>
                                {cat.label === 'Essential' && !validateEquipment() && <span className="text-[10px] text-red-400">Incomplete</span>}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {cat.items.map(([key, label]) => (
                                    <label key={key} className={`flex items-center gap-2 px-2 py-1 rounded border text-xs cursor-pointer select-none ${equipmentAccess[key] ? 'bg-red-600/10 border-red-500 text-white' : 'bg-gray-900/40 border-gray-600 text-gray-300 hover:bg-gray-900/70'}`}>
                                        <input type="checkbox" className="hidden" checked={!!equipmentAccess[key]} onChange={e => handleEquipmentChange(key, e.target.checked)} />
                                        <span className="w-2.5 h-2.5 rounded-full border ${equipmentAccess[key] ? 'border-red-400 bg-red-500' : 'border-gray-500'}"></span>
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Impact & Preview */}
                <div className="bg-gray-800/70 border border-gray-600 rounded p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-300" />
                        <div className="text-white font-medium text-sm">Assistance Availability Preview</div>
                    </div>
                    <p className="text-[11px] text-gray-400">Demonstrates how equipment toggles unlock / restrict common assistance exercises.</p>
                    <EquipmentPreview equipmentAccess={equipmentAccess} />
                </div>

                {!validateEquipment() && (
                    <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                            <div>
                                <h5 className="text-red-300 font-medium mb-1">Essential Equipment Warnings</h5>
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

// --- Helper: EquipmentPreview ---
function EquipmentPreview({ equipmentAccess }) {
    const CATALOG = [
        { name: 'Chin Ups', need: ['pullup_bar'], cat: 'Pull' },
        { name: 'Dips', need: ['dip_station'], cat: 'Push' },
        { name: 'Ring Rows', need: ['rings'], cat: 'Pull' },
        { name: 'DB Row', need: ['dumbbells'], cat: 'Pull' },
        { name: 'DB Incline Press', need: ['dumbbells', 'bench'], cat: 'Push' },
        { name: 'Face Pull', need: ['cables'], cat: 'Rear Delt' },
        { name: 'Leg Extension', need: ['machines'], cat: 'Quad' },
        { name: 'Hamstring Curl', need: ['machines'], cat: 'Posterior' },
        { name: 'Kettlebell Swing', need: ['kettlebells'], cat: 'Posterior' },
        { name: 'Band Pull-Apart', need: ['bands'], cat: 'Upper Back' },
        { name: 'Suspension Fallouts', need: ['suspension'], cat: 'Core' }
    ];
    const rows = CATALOG.map(row => {
        const available = row.need.every(req => equipmentAccess[req]);
        return { ...row, available };
    });
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {rows.map(r => (
                <div key={r.name} className={`text-[11px] px-2 py-1 rounded border flex items-center justify-between ${r.available ? 'border-green-600 bg-green-900/20 text-green-200' : 'border-gray-600 bg-gray-900/40 text-gray-400'}`}>
                    <span>{r.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] tracking-wide ${r.available ? 'bg-green-700/40 text-green-200' : 'bg-gray-700/40 text-gray-400'}`}>{r.available ? 'UNLOCKED' : 'LOCKED'}</span>
                </div>
            ))}
        </div>
    );
}
