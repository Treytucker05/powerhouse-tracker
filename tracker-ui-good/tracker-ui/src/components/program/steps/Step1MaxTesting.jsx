import React, { useMemo, useState, useEffect } from 'react';
import { useSettings } from '../../../contexts/SettingsContext.jsx';
import { roundToIncrement } from '../../../lib/fiveThreeOne/math.js';
import { Calculator, AlertCircle, CheckCircle, Info } from 'lucide-react';
import '../../../styles/Step1Toggles.css';

export default function Step1MaxTesting({ data, updateData }) {
    const { roundingIncrement, unit, setUnit } = useSettings();
    const [testingMethod, setTestingMethod] = useState(data.testingMethod || 'estimate'); // 'known' | 'estimate' | 'tm'
    const [tmPct, setTmPct] = useState([0.85, 0.9, 0.90].includes(data.tmPct) ? (data.tmPct === 0.85 ? 0.85 : 0.90) : 0.90); // lock to 0.90 default
    const [oneRMs, setOneRMs] = useState(data.oneRMs || {
        squat: '',
        bench: '',
        deadlift: '',
        overhead_press: ''
    });
    const [repTests, setRepTests] = useState(data.repTests || {
        squat: { weight: '', reps: '' },
        bench: { weight: '', reps: '' },
        deadlift: { weight: '', reps: '' },
        overhead_press: { weight: '', reps: '' }
    });
    const [trainingMaxes, setTrainingMaxes] = useState(data.trainingMaxes || {});
    const [deadliftStyle, setDeadliftStyle] = useState(['dead_stop', 'touch_and_go'].includes(data.deadliftStyle) ? data.deadliftStyle : 'touch_and_go'); // 'dead_stop' | 'touch_and_go'
    const [roundingMode, setRoundingMode] = useState(['nearest', 'floor', 'ceil'].includes(data.roundingMode) ? data.roundingMode : 'nearest'); // 'nearest' | 'floor' | 'ceil'

    // Enforce a default selection in each group on mount in case upstream state is missing
    useEffect(() => {
        const normUnit = (unit === 'lb' || unit === 'kg') ? unit : 'lb';
        if (normUnit !== unit) setUnit('lb');
        const normPct = (tmPct === 0.85 || tmPct === 0.90) ? tmPct : 0.90;
        if (normPct !== tmPct) setTmPct(0.90);
        const normRound = ['nearest', 'floor', 'ceil'].includes(roundingMode) ? roundingMode : 'nearest';
        if (normRound !== roundingMode) setRoundingMode('nearest');
        const normStyle = ['dead_stop', 'touch_and_go'].includes(deadliftStyle) ? deadliftStyle : 'touch_and_go';
        if (normStyle !== deadliftStyle) setDeadliftStyle('touch_and_go');
        // Persist normalized defaults to parent so selections survive any remounts
        updateData({
            testingMethod,
            tmPct: normPct,
            oneRMs,
            repTests,
            trainingMaxes,
            deadliftStyle: normStyle,
            roundingMode: normRound,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Normalized current selections for sticky initial highlight
    const currentUnit = unit === 'kg' ? 'kg' : 'lb';
    const currentTmPct = tmPct === 0.85 ? 0.85 : 0.90;
    const currentRounding = ['nearest', 'floor', 'ceil'].includes(roundingMode) ? roundingMode : 'nearest';
    const currentDeadliftStyle = ['dead_stop', 'touch_and_go'].includes(deadliftStyle) ? deadliftStyle : 'touch_and_go';

    const liftNames = {
        squat: 'Squat',
        bench: 'Bench Press',
        deadlift: 'Deadlift',
        overhead_press: 'Overhead Press'
    };

    // Wendler's formula: Estimated 1RM = Weight × Reps × 0.0333 + Weight
    const calculateEst1RM = (weight, reps) => {
        if (!weight || !reps || reps < 1) return 0;
        const w = parseFloat(weight);
        const r = parseInt(reps);
        if (r === 1) return w;
        return Math.round(w * r * 0.0333 + w);
    };

    // Training Max = tmPct of 1RM
    const calculateTrainingMax = (oneRM) => {
        if (!oneRM) return 0;
        return roundToIncrement(oneRM * tmPct, roundingIncrement, roundingMode);
    };

    const handleOneRMChange = (lift, value) => {
        const newOneRMs = { ...oneRMs, [lift]: value };
        setOneRMs(newOneRMs);

        // Calculate training maxes
        const newTrainingMaxes = {};
        Object.keys(newOneRMs).forEach(liftKey => {
            if (newOneRMs[liftKey]) {
                newTrainingMaxes[liftKey] = calculateTrainingMax(parseFloat(newOneRMs[liftKey]));
            }
        });
        setTrainingMaxes(newTrainingMaxes);

        updateData({
            testingMethod,
            tmPct,
            oneRMs: newOneRMs,
            repTests,
            trainingMaxes: newTrainingMaxes,
            deadliftStyle,
            roundingMode,
        });
    };

    const handleRepTestChange = (lift, field, value) => {
        const newRepTests = {
            ...repTests,
            [lift]: { ...repTests[lift], [field]: value }
        };
        setRepTests(newRepTests);

        // Calculate estimated 1RMs and training maxes
        const newOneRMs = { ...oneRMs };
        const newTrainingMaxes = {};

        Object.keys(newRepTests).forEach(liftKey => {
            const test = newRepTests[liftKey];
            if (test.weight && test.reps) {
                const est1RM = calculateEst1RM(test.weight, test.reps);
                newOneRMs[liftKey] = est1RM.toString();
                newTrainingMaxes[liftKey] = calculateTrainingMax(est1RM);
            }
        });

        setOneRMs(newOneRMs);
        setTrainingMaxes(newTrainingMaxes);

        updateData({
            testingMethod,
            tmPct,
            oneRMs: newOneRMs,
            repTests: newRepTests,
            trainingMaxes: newTrainingMaxes,
            deadliftStyle,
            roundingMode,
        });
    };

    // Direct TM entry handler
    const handleTMChange = (lift, value) => {
        const tmVal = Number(value || 0);
        const newTMs = { ...trainingMaxes, [lift]: tmVal };
        setTrainingMaxes(newTMs);
        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes: newTMs, deadliftStyle, roundingMode });
    };

    const isStepComplete = () => Object.values(trainingMaxes).filter(Boolean).length === 4;
    const completedCount = useMemo(() => Object.values(trainingMaxes).filter(v => Number(v) > 0).length, [trainingMaxes]);

    return (
        <div className="space-y-6">
            {/* Program Fundamentals */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-white font-semibold">Program Fundamentals</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Units toggle */}
                        <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1">
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentUnit === 'lb' ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => setUnit('lb')}
                                type="button"
                                aria-pressed={currentUnit === 'lb'}
                                title="Use pounds"
                            >
                                LBS
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentUnit === 'kg' ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => setUnit('kg')}
                                type="button"
                                aria-pressed={currentUnit === 'kg'}
                                title="Use kilograms"
                            >
                                KG
                            </button>
                        </div>

                        {/* TM percent toggle */}
                        <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1">
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentTmPct === 0.90 ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => {
                                    setTmPct(0.90);
                                    // Recompute TMs if we already have 1RMs
                                    if (testingMethod !== 'tm') {
                                        const newTMs = Object.fromEntries(Object.entries(oneRMs).map(([k, v]) => [k, v ? roundToIncrement(Number(v) * 0.90, roundingIncrement, roundingMode) : 0]));
                                        setTrainingMaxes(newTMs);
                                        updateData({ testingMethod, tmPct: 0.90, oneRMs, repTests, trainingMaxes: newTMs, deadliftStyle, roundingMode });
                                    } else {
                                        updateData({ testingMethod, tmPct: 0.90, oneRMs, repTests, trainingMaxes, deadliftStyle, roundingMode });
                                    }
                                }}
                                type="button"
                                aria-pressed={currentTmPct === 0.90}
                                title="Training Max at 90% (recommended)"
                            >
                                TM: 90%
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentTmPct === 0.85 ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => {
                                    setTmPct(0.85);
                                    if (testingMethod !== 'tm') {
                                        const newTMs = Object.fromEntries(Object.entries(oneRMs).map(([k, v]) => [k, v ? roundToIncrement(Number(v) * 0.85, roundingIncrement, roundingMode) : 0]));
                                        setTrainingMaxes(newTMs);
                                        updateData({ testingMethod, tmPct: 0.85, oneRMs, repTests, trainingMaxes: newTMs, deadliftStyle, roundingMode });
                                    } else {
                                        updateData({ testingMethod, tmPct: 0.85, oneRMs, repTests, trainingMaxes, deadliftStyle, roundingMode });
                                    }
                                }}
                                type="button"
                                aria-pressed={currentTmPct === 0.85}
                                title="Training Max at 85% (conservative)"
                            >
                                TM: 85%
                            </button>
                        </div>

                        {/* Rounding mode toggle */}
                        <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1">
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentRounding === 'nearest' ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => {
                                    setRoundingMode('nearest');
                                    if (testingMethod !== 'tm') {
                                        const newTMs = Object.fromEntries(Object.entries(oneRMs).map(([k, v]) => [k, v ? roundToIncrement(Number(v) * tmPct, roundingIncrement, 'nearest') : 0]));
                                        setTrainingMaxes(newTMs);
                                        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes: newTMs, deadliftStyle, roundingMode: 'nearest' });
                                    } else {
                                        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes, deadliftStyle, roundingMode: 'nearest' });
                                    }
                                }}
                                type="button"
                                aria-pressed={currentRounding === 'nearest'}
                                title="Round to nearest increment"
                            >
                                Nearest
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentRounding === 'floor' ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => {
                                    setRoundingMode('floor');
                                    if (testingMethod !== 'tm') {
                                        const newTMs = Object.fromEntries(Object.entries(oneRMs).map(([k, v]) => [k, v ? roundToIncrement(Number(v) * tmPct, roundingIncrement, 'floor') : 0]));
                                        setTrainingMaxes(newTMs);
                                        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes: newTMs, deadliftStyle, roundingMode: 'floor' });
                                    } else {
                                        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes, deadliftStyle, roundingMode: 'floor' });
                                    }
                                }}
                                type="button"
                                aria-pressed={currentRounding === 'floor'}
                                title="Round down to increment"
                            >
                                Down
                            </button>
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentRounding === 'ceil' ? 'toggle-selected' : 'toggle-unselected'}`}
                                onClick={() => {
                                    setRoundingMode('ceil');
                                    if (testingMethod !== 'tm') {
                                        const newTMs = Object.fromEntries(Object.entries(oneRMs).map(([k, v]) => [k, v ? roundToIncrement(Number(v) * tmPct, roundingIncrement, 'ceil') : 0]));
                                        setTrainingMaxes(newTMs);
                                        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes: newTMs, deadliftStyle, roundingMode: 'ceil' });
                                    } else {
                                        updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes, deadliftStyle, roundingMode: 'ceil' });
                                    }
                                }}
                                type="button"
                                aria-pressed={currentRounding === 'ceil'}
                                title="Round up to increment"
                            >
                                Up
                            </button>
                        </div>

                        {/* Deadlift style pills are shown inside the Deadlift card below */}
                    </div>
                </div>
            </div>

            {/* Method Selection (applies to all lifts) */}
            <div className="bg-gray-800 border border-red-600/40 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">Method Selection</h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 method-selector">
                    <button
                        type="button"
                        onClick={() => setTestingMethod('known')}
                        className={`toggle-button px-3 py-1.5 rounded-md border-2 ${testingMethod === 'known' ? 'bg-red-600 text-white border-white font-semibold' : 'bg-gray-900 text-gray-200 border-gray-700 hover:border-gray-500'}`}
                        title="Enter tested 1RM"
                    >
                        Tested 1RM
                        <span className="ml-2 text-amber-300 text-xs method-help">Your recent max single</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTestingMethod('estimate')}
                        className={`toggle-button px-3 py-1.5 rounded-md border-2 ${testingMethod === 'estimate' ? 'bg-red-600 text-white border-white font-semibold' : 'bg-gray-900 text-gray-200 border-gray-700 hover:border-gray-500'}`}
                        title="Estimate 1RM from reps × weight"
                    >
                        Reps × Weight
                        <span className="ml-2 text-amber-300 text-xs method-help">We’ll multiply by your TM%</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTestingMethod('tm')}
                        className={`toggle-button px-3 py-1.5 rounded-md border-2 ${testingMethod === 'tm' ? 'bg-red-600 text-white border-white font-semibold' : 'bg-gray-900 text-gray-200 border-gray-700 hover:border-gray-500'}`}
                        title="Enter Training Max directly"
                    >
                        Direct TM
                        <span className="ml-2 text-amber-300 text-xs method-help">Skip 1RM, enter TM</span>
                    </button>
                </div>
            </div>

            {/* Exercise Cards */}
            <div className="space-y-3">
                {Object.entries(liftNames).map(([lift, name]) => {
                    const tm = Number(trainingMaxes?.[lift] || 0);
                    const complete = tm > 0;
                    return (
                        <div
                            key={lift}
                            className={`exercise-card bg-[#0f1222] border ${complete ? 'border-green-700/60' : 'border-gray-700'} rounded-lg p-4 transition-all ${complete ? 'pl-3 border-l-4 border-l-emerald-500' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {complete ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border border-gray-600" />
                                    )}
                                    <div className="text-white font-semibold">{name}</div>
                                </div>
                                <div className={`tm-display text-sm ${complete ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}>
                                    TM: {complete ? `${tm} ${unit}` : '---'}
                                </div>
                            </div>

                            {/* Inputs based on method */}
                            <div className="mt-3">
                                {testingMethod === 'known' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs text-gray-300 mb-1">Tested 1RM ({unit.toUpperCase()})</label>
                                            <input
                                                type="number"
                                                value={oneRMs[lift]}
                                                onChange={(e) => handleOneRMChange(lift, e.target.value)}
                                                placeholder={currentUnit === 'kg' ? 'e.g., 140' : 'e.g., 315'}
                                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:border-red-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 flex items-end text-xs text-gray-400">
                                            Rounding: {currentRounding} {roundingIncrement}{currentUnit === 'kg' ? 'kg' : 'lb'}
                                        </div>
                                    </div>
                                )}

                                {testingMethod === 'estimate' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">Weight ({unit.toUpperCase()})</label>
                                            <input
                                                type="number"
                                                value={repTests[lift].weight}
                                                onChange={(e) => handleRepTestChange(lift, 'weight', e.target.value)}
                                                placeholder={currentUnit === 'kg' ? 'e.g., 120' : 'e.g., 275'}
                                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">Reps</label>
                                            <input
                                                type="number"
                                                value={repTests[lift].reps}
                                                onChange={(e) => handleRepTestChange(lift, 'reps', e.target.value)}
                                                placeholder="e.g., 5"
                                                min="1"
                                                max="20"
                                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-300 mb-1">Estimated 1RM</label>
                                            <div className="px-3 py-2 bg-gray-700 rounded-md text-white font-medium">
                                                {repTests[lift].weight && repTests[lift].reps
                                                    ? `${calculateEst1RM(repTests[lift].weight, repTests[lift].reps)} ${currentUnit}`
                                                    : '---'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {testingMethod === 'tm' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-1">
                                            <label className="block text-xs text-gray-300 mb-1">Training Max ({unit.toUpperCase()})</label>
                                            <input
                                                type="number"
                                                value={trainingMaxes[lift] || ''}
                                                onChange={(e) => handleTMChange(lift, e.target.value)}
                                                placeholder={currentUnit === 'kg' ? 'e.g., 120' : 'e.g., 245'}
                                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:border-red-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 flex items-end text-xs text-gray-400">
                                            Enter your actual TM; rounding not applied.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Deadlift style pills (exactly one selected) */}
                            {lift === 'deadlift' && (
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="text-xs text-gray-300">Style:</span>
                                    <button
                                        className={`px-3 py-1 rounded-md text-sm ${currentDeadliftStyle === 'dead_stop' ? 'toggle-selected' : 'toggle-unselected'}`}
                                        onClick={() => { setDeadliftStyle('dead_stop'); updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes, deadliftStyle: 'dead_stop', roundingMode }); }}
                                        type="button"
                                        aria-pressed={currentDeadliftStyle === 'dead_stop'}
                                        aria-current={deadliftStyle === 'dead_stop' ? 'true' : undefined}
                                        title="Dead Stop reps"
                                    >
                                        Dead Stop
                                    </button>
                                    <button
                                        className={`px-3 py-1 rounded-md text-sm ${currentDeadliftStyle === 'touch_and_go' ? 'toggle-selected' : 'toggle-unselected'}`}
                                        onClick={() => { setDeadliftStyle('touch_and_go'); updateData({ testingMethod, tmPct, oneRMs, repTests, trainingMaxes, deadliftStyle: 'touch_and_go', roundingMode }); }}
                                        type="button"
                                        aria-pressed={currentDeadliftStyle === 'touch_and_go'}
                                        aria-current={deadliftStyle === 'touch_and_go' ? 'true' : undefined}
                                        title="Touch & Go reps"
                                    >
                                        Touch & Go
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary / Progress */}
            <div className="progress-section bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="h-2 bg-gray-900 rounded">
                    <div className="h-2 bg-red-600 rounded" style={{ width: `${(completedCount / 4) * 100}%` }} />
                </div>
                <div className="progress-details mt-3 flex flex-wrap gap-3 text-sm">
                    <span className={`${trainingMaxes.overhead_press ? 'text-green-300' : 'text-gray-400'}`}>{trainingMaxes.overhead_press ? '✓' : '○'} OHP{trainingMaxes.overhead_press ? `: ${trainingMaxes.overhead_press}` : ''}</span>
                    <span className={`${trainingMaxes.bench ? 'text-green-300' : 'text-gray-400'}`}>{trainingMaxes.bench ? '✓' : '○'} Bench{trainingMaxes.bench ? `: ${trainingMaxes.bench}` : ''}</span>
                    <span className={`${trainingMaxes.squat ? 'text-green-300' : 'text-gray-400'}`}>{trainingMaxes.squat ? '✓' : '○'} Squat{trainingMaxes.squat ? `: ${trainingMaxes.squat}` : ''}</span>
                    <span className={`${trainingMaxes.deadlift ? 'text-green-300' : 'text-gray-400'}`}>{trainingMaxes.deadlift ? '✓' : '○'} Deadlift{trainingMaxes.deadlift ? `: ${trainingMaxes.deadlift}` : ''}</span>
                </div>

                <div className="mt-2 text-xs text-amber-300">You can add missing lifts later, but you'll need all 4 to generate your program.</div>
            </div>

            {/* Guidance */}
            <div className="bg-blue-900/20 border border-blue-600 p-3 rounded-lg">
                <div className="flex items-start gap-2 text-sm">
                    <Info className="w-4 h-4 text-blue-300 mt-0.5" />
                    <div className="text-blue-200">
                        With 5/3/1, start conservatively. TM is typically 90% of your 1RM. Use 85% for an even smoother start.
                    </div>
                </div>
            </div>
        </div>
    );
}
