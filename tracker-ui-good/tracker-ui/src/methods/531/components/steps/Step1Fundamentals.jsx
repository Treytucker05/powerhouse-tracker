/**
 * Step1Fundamentals.jsx - Program Fundamentals Step
 * Units, rounding, TM%, 1RM/rep tests with real-time calculation and validation
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ToggleButton from '../ToggleButton.jsx';
import { Info, AlertTriangle, Calculator, Copy } from 'lucide-react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { roundToIncrement } from '../..'; // barrel export

// Wendler e1RM formula: e1RM = weight * (1 + 0.0333 * reps)
const calculateE1RM = (weight, reps) => {
    if (!weight || !reps || reps < 1) return null;
    return weight * (1 + 0.0333 * reps);
};

// Calculate TM from base weight
const calculateTM = (baseWeight, tmPct) => {
    if (!baseWeight || !tmPct) return null;
    return baseWeight * tmPct;
};

// Validate TM relative to e1RM
const validateTM = (tm, e1rm) => {
    if (!tm || !e1rm) return { level: 'neutral', message: 'Enter data to see validation' };

    const ratio = tm / e1rm;
    if (ratio > 0.95) return { level: 'danger', message: 'TM too high (>95% of e1RM). Risk of missing reps.' };
    if (ratio < 0.80) return { level: 'warning', message: 'TM very conservative (<80% of e1RM). Room to increase.' };
    return { level: 'success', message: 'TM in recommended range (80-95% of e1RM).' };
};

const LIFT_LABELS = {
    squat: 'Squat',
    bench: 'Bench Press',
    deadlift: 'Deadlift',
    press: 'Overhead Press'
};

export default function Step1Fundamentals({ onValidChange }) {
    const { state, dispatch } = useProgramV2();

    // Local working state for smooth typing
    const [localState, setLocalState] = useState({
        units: state.units,
        rounding: state.rounding,
        tmPct: state.tmPct,
        lifts: {
            squat: { oneRM: state.lifts.squat.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM', applied: false },
            bench: { oneRM: state.lifts.bench.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM', applied: false },
            deadlift: { oneRM: state.lifts.deadlift.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM', applied: false },
            press: { oneRM: state.lifts.press.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM', applied: false }
        }
    });

    // Debounced dispatch to V2 context
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch({ type: 'SET_UNITS', units: localState.units });
            dispatch({ type: 'SET_ROUNDING', rounding: localState.rounding });
            dispatch({ type: 'SET_TM_PCT', tmPct: localState.tmPct });

            // Calculate and dispatch final lift data
            const liftData = {};
            Object.keys(localState.lifts).forEach(liftKey => {
                const lift = localState.lifts[liftKey];
                let oneRM = null;
                let tm = null;

                // Determine oneRM source
                if (lift.oneRM && Number(lift.oneRM) > 0) {
                    oneRM = Number(lift.oneRM);
                } else if (lift.repWeight && lift.repCount && Number(lift.repWeight) > 0 && Number(lift.repCount) > 0) {
                    oneRM = calculateE1RM(Number(lift.repWeight), Number(lift.repCount));
                }

                // Calculate TM
                if (lift.tmOverride && Number(lift.tmOverride) > 0) {
                    tm = roundToIncrement(Number(lift.tmOverride), localState.units, localState.rounding);
                } else if (oneRM) {
                    tm = roundToIncrement(calculateTM(oneRM, localState.tmPct), localState.units, localState.rounding);
                }

                liftData[liftKey] = { name: liftKey, oneRM, tm };
            });

            dispatch({ type: 'BULK_SET_LIFTS', lifts: liftData });
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [localState, dispatch]);

    // Validation check
    const isValid = useMemo(() => {
        return Object.keys(localState.lifts).every(liftKey => {
            const lift = localState.lifts[liftKey];
            const hasOneRM = lift.oneRM && Number(lift.oneRM) > 0;
            const hasRepTest = lift.repWeight && lift.repCount && Number(lift.repWeight) > 0 && Number(lift.repCount) > 0;
            return hasOneRM || hasRepTest;
        });
    }, [localState.lifts]);

    const prevValidRef = useRef(isValid);
    useEffect(() => {
        if (prevValidRef.current !== isValid) {
            onValidChange?.(isValid);
            prevValidRef.current = isValid;
        }
    }, [isValid, onValidChange]);

    const updateLocalState = useCallback((updates) => {
        setLocalState(prev => ({ ...prev, ...updates }));
    }, []);

    const updateLift = useCallback((liftKey, updates) => {
        setLocalState(prev => ({
            ...prev,
            lifts: {
                ...prev.lifts,
                [liftKey]: { ...prev.lifts[liftKey], ...updates }
            }
        }));
    }, []);

    const copyRepTestToAll = useCallback((sourceLift) => {
        const source = localState.lifts[sourceLift];
        if (!source.repWeight || !source.repCount) return;

        const updates = {};
        Object.keys(localState.lifts).forEach(liftKey => {
            if (liftKey !== sourceLift) {
                updates[liftKey] = {
                    ...localState.lifts[liftKey],
                    repWeight: source.repWeight,
                    repCount: source.repCount,
                    oneRM: '' // Clear oneRM when copying rep test
                };
            }
        });

        setLocalState(prev => ({
            ...prev,
            lifts: { ...prev.lifts, ...updates }
        }));
    }, [localState.lifts]);

    const renderLiftRow = (liftKey) => {
        const lift = localState.lifts[liftKey];
        const hasOneRM = lift.oneRM && Number(lift.oneRM) > 0;
        const hasRepTest = lift.repWeight && lift.repCount && Number(lift.repWeight) > 0 && Number(lift.repCount) > 0;
        const hasOverride = lift.tmOverride && Number(lift.tmOverride) > 0;
        let e1rm = null;
        if (hasOneRM) {
            e1rm = Number(lift.oneRM);
        } else if (hasRepTest) {
            e1rm = calculateE1RM(Number(lift.repWeight), Number(lift.repCount));
        }
        const suggestedTM = e1rm ? roundToIncrement(calculateTM(e1rm, localState.tmPct), localState.units, localState.rounding) : null;
        const finalTM = hasOverride ? roundToIncrement(Number(lift.tmOverride), localState.units, localState.rounding) : suggestedTM;
        const validation = validateTM(finalTM, e1rm);

        const setActiveMethod = (method) => updateLift(liftKey, { activeMethod: method });
        const isActive = (m) => lift.activeMethod === m;
        const methodCompleted = {
            oneRM: hasOneRM,
            reps: hasRepTest,
            override: hasOverride
        };

        const cardBase = 'method-card rounded-lg border bg-gray-900/70 transition-all cursor-pointer px-4 py-3';
        const cardState = (m) => [
            isActive(m) ? 'border-red-500 ring-1 ring-red-500/40 shadow-sm' : 'border-gray-700',
            methodCompleted[m] && !isActive(m) ? 'border-green-600/70' : '',
            'hover:border-red-400/70'
        ].join(' ');

        const applyDisabled = !finalTM; // must have a TM to apply
        const handleApply = () => {
            if (applyDisabled) return;
            // Mark applied (and if override method not selected, do not force override; just flag)
            updateLift(liftKey, { applied: true });
        };

        return (
            <div key={liftKey} className="p-6 rounded-xl bg-gray-800/40 border border-gray-700/60">
                <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                    <div className="min-w-[160px]">
                        <h4 className="text-base font-semibold text-white tracking-tight">{LIFT_LABELS[liftKey]}</h4>
                        <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap items-center gap-1">
                            {e1rm ? <><span>e1RM</span><span className="text-gray-300 font-mono">{Math.round(e1rm)}</span></> : <span>Choose a method below</span>}
                            {finalTM && <><span className="text-gray-600">•</span><span>TM</span><span className="text-gray-200 font-mono">{finalTM}</span></>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 bg-gray-900 border ${finalTM ? 'border-gray-600 text-gray-200' : 'border-gray-700 text-gray-500'}`}>
                            Current TM: <span className={`${finalTM ? 'text-green-400' : 'text-gray-500'}`}>{finalTM || '—'}</span>
                        </span>
                        {(validation.level === 'warning' || validation.level === 'danger') && (
                            <span className={`px-2 py-1 rounded text-[10px] font-medium border ${validation.level === 'warning' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-600/40' : 'bg-red-500/15 text-red-400 border-red-600/40'}`}>{validation.level === 'warning' ? 'Low' : 'High'}</span>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Method 1: Tested 1RM */}
                    <div className={cardBase + ' ' + cardState('oneRM')} onClick={() => setActiveMethod('oneRM')}>
                        <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${isActive('oneRM') ? 'bg-red-500 text-white' : methodCompleted.oneRM ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>1</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold text-white">Tested 1RM</span>
                                    {methodCompleted.oneRM && <span className="text-green-500 text-xs">✓</span>}
                                </div>
                                <p className="text-[11px] text-gray-500 mt-0.5">Enter your actual one-rep max.</p>
                                {isActive('oneRM') && (
                                    <div className="mt-4">
                                        <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">Weight</label>
                                        <input
                                            type="number"
                                            value={lift.oneRM}
                                            onChange={(e) => updateLift(liftKey, { oneRM: e.target.value, repWeight: '', repCount: '', tmOverride: '', applied: false })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                            placeholder="e.g. 280"
                                        />
                                        {suggestedTM && hasOneRM && (
                                            <div className="mt-3 text-[11px] bg-gray-800/70 border border-red-500/40 rounded p-2 flex justify-between items-center">
                                                <span className="text-gray-400">TM ({Math.round(localState.tmPct * 100)}%)</span>
                                                <span className="text-red-400 font-semibold">{suggestedTM}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center h-8">
                        <div className="absolute inset-x-0 h-px bg-gray-700/60" />
                        <span className="relative z-10 px-4 text-[10px] font-semibold tracking-wider text-gray-600 bg-gray-800/40 rounded-full">OR</span>
                    </div>

                    {/* Method 2: Rep Calculator */}
                    <div className={cardBase + ' ' + cardState('reps')} onClick={() => setActiveMethod('reps')}>
                        <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${isActive('reps') ? 'bg-red-500 text-white' : methodCompleted.reps ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>2</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold text-white">Rep Calculator</span>
                                    {methodCompleted.reps && <span className="text-green-500 text-xs">✓</span>}
                                </div>
                                <p className="text-[11px] text-gray-500 mt-0.5">Calculate from a recent rep test (3–10 reps).</p>
                                {isActive('reps') && (
                                    <div className="mt-3 flex flex-col gap-3">
                                        <div className="flex gap-2 flex-wrap">
                                            <input
                                                type="number"
                                                value={lift.repWeight}
                                                onChange={(e) => updateLift(liftKey, { repWeight: e.target.value, oneRM: '', tmOverride: '' })}
                                                className="flex-1 min-w-[120px] bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                                placeholder="Weight"
                                            />
                                            <input
                                                type="number"
                                                value={lift.repCount}
                                                onChange={(e) => updateLift(liftKey, { repCount: e.target.value, oneRM: '', tmOverride: '' })}
                                                className="w-28 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                                placeholder="Reps"
                                                min={1}
                                                max={12}
                                            />
                                            {hasRepTest && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); copyRepTestToAll(liftKey); }}
                                                    className="text-[11px] px-3 py-2 rounded bg-gray-700/60 hover:bg-gray-600 text-gray-200 border border-gray-600"
                                                >Copy to All</button>
                                            )}
                                        </div>
                                        {hasRepTest && suggestedTM && (
                                            <div className="text-[11px] bg-gray-800/70 border border-red-500/40 rounded p-2">
                                                <span className="text-gray-400">Est. 1RM </span>
                                                <span className="text-gray-300 font-mono">{e1rm && Math.round(e1rm)}</span>
                                                <span className="mx-1">→</span>
                                                <span className="text-gray-400">TM </span>
                                                <span className="text-red-400 font-semibold">{suggestedTM}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center h-8">
                        <div className="absolute inset-x-0 h-px bg-gray-700/60" />
                        <span className="relative z-10 px-4 text-[10px] font-semibold tracking-wider text-gray-600 bg-gray-800/40 rounded-full">OR</span>
                    </div>

                    {/* Method 3: Manual Override */}
                    <div className={cardBase + ' ' + cardState('override')} onClick={() => setActiveMethod('override')}>
                        <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold ${isActive('override') ? 'bg-red-500 text-white' : methodCompleted.override ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>3</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold text-white">Manual Override</span>
                                    {methodCompleted.override && <span className="text-green-500 text-xs">✓</span>}
                                </div>
                                <p className="text-[11px] text-gray-500 mt-0.5">Set a custom training max directly.</p>
                                {isActive('override') && (
                                    <div className="mt-4">
                                        <label className="block text-[10px] uppercase tracking-wide text-gray-500 mb-1">Training Max</label>
                                        <input
                                            type="number"
                                            value={lift.tmOverride}
                                            onChange={(e) => updateLift(liftKey, { tmOverride: e.target.value, oneRM: '', repWeight: '', repCount: '', applied: false })}
                                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                            placeholder="e.g. 250"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Apply Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        disabled={applyDisabled}
                        onClick={handleApply}
                        className={`w-full text-sm font-semibold rounded-md px-4 py-3 border transition-colors ${applyDisabled ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed' : lift.applied ? 'bg-green-600/20 text-green-400 border-green-600 hover:bg-green-600/30' : 'bg-red-600 text-white border-red-500 hover:bg-red-500'}`}
                    >
                        {lift.applied ? '✓ Training Max Applied' : applyDisabled ? 'Enter Data Above' : 'Apply Training Max'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 1 — Program Fundamentals</h2>
                <p className="text-gray-400">
                    Configure basic settings and establish training maxes for all four lifts.
                </p>
            </div>

            {/* Settings */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Units */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Units</label>
                        <div className="flex gap-2">
                            {['lb', 'kg'].map(unit => (
                                <ToggleButton
                                    key={unit}
                                    on={localState.units === unit}
                                    onClick={() => updateLocalState({ units: unit })}
                                    className="text-xs px-4"
                                >{unit.toUpperCase()}</ToggleButton>
                            ))}
                        </div>
                    </div>

                    {/* Rounding */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rounding</label>
                        <select
                            value={localState.rounding}
                            onChange={(e) => updateLocalState({ rounding: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                        >
                            <option value="ceil">Round up</option>
                            <option value="nearest">Nearest</option>
                            <option value="floor">Round down</option>
                        </select>
                    </div>

                    {/* TM Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Training Max %</label>
                        <div className="flex gap-2">
                            {[0.90, 0.85].map(pct => (
                                <ToggleButton
                                    key={pct}
                                    on={localState.tmPct === pct}
                                    onClick={() => updateLocalState({ tmPct: pct })}
                                    className="text-xs px-4"
                                >{Math.round(pct * 100)}%</ToggleButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Training Max Inputs */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Training Maxes</h3>
                <p className="text-xs text-gray-400 mb-4">Provide either a tested 1RM or a recent rep test (weight and reps) for each lift. Optionally override the calculated TM.</p>
                <div className="space-y-4">
                    {Object.keys(localState.lifts).map(renderLiftRow)}
                </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Info */}
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-blue-300 mb-1">Training Max Philosophy</h4>
                            <p className="text-blue-100 text-sm">
                                TM should be 85-90% of your true 1RM. Rounding increments: {localState.units === 'kg' ? '2.5 kg' : '5 lb'} ({localState.rounding}).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-yellow-300 mb-1">Training Max Validation</h4>
                            <p className="text-yellow-100 text-sm">
                                If you can't get 5+ reps at your TM on Week 1's top set, your TM is too high.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
