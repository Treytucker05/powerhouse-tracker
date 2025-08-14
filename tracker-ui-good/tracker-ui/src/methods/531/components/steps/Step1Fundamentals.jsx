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
            squat: { oneRM: state.lifts.squat.oneRM || '', repWeight: '', repCount: '', tmOverride: '' },
            bench: { oneRM: state.lifts.bench.oneRM || '', repWeight: '', repCount: '', tmOverride: '' },
            deadlift: { oneRM: state.lifts.deadlift.oneRM || '', repWeight: '', repCount: '', tmOverride: '' },
            press: { oneRM: state.lifts.press.oneRM || '', repWeight: '', repCount: '', tmOverride: '' }
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

        let e1rm = null;
        let suggestedTM = null;
        let finalTM = null;

        if (hasOneRM) {
            e1rm = Number(lift.oneRM);
        } else if (hasRepTest) {
            e1rm = calculateE1RM(Number(lift.repWeight), Number(lift.repCount));
        }

        if (e1rm) {
            suggestedTM = roundToIncrement(calculateTM(e1rm, localState.tmPct), localState.units, localState.rounding);
        }

        if (lift.tmOverride && Number(lift.tmOverride) > 0) {
            finalTM = roundToIncrement(Number(lift.tmOverride), localState.units, localState.rounding);
        } else {
            finalTM = suggestedTM;
        }

        const validation = validateTM(finalTM, e1rm);

        return (
            <div key={liftKey} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/60">
                <div className="grid grid-cols-12 gap-x-4 gap-y-3 items-start">
                    {/* Lift label */}
                    <div className="col-span-12 sm:col-span-3">
                        <label className="font-medium text-white block mb-1">{LIFT_LABELS[liftKey]}</label>
                        <div className="text-[11px] text-gray-500 leading-snug">
                            {e1rm ? <>e1RM <span className="text-gray-300 font-mono">{Math.round(e1rm)}</span></> : 'Enter 1RM or rep test'}
                            {suggestedTM && <><span className="mx-1">·</span>TM <span className="text-gray-300 font-mono">{suggestedTM}</span></>}
                        </div>
                    </div>

                    {/* 1RM Container */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className={`h-full rounded-md border ${hasRepTest ? 'border-gray-700/50 opacity-60' : 'border-gray-700'} bg-gray-900/60 p-3 flex flex-col gap-2`}> 
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-300">Tested 1RM</label>
                                {hasRepTest && <span className="text-[10px] text-gray-500">disabled (rep test in use)</span>}
                            </div>
                            <input
                                type="number"
                                value={lift.oneRM}
                                onChange={(e) => updateLift(liftKey, { oneRM: e.target.value, repWeight: '', repCount: '' })}
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                                disabled={hasRepTest}
                                placeholder="Enter 1RM"
                            />
                            <div className="text-[10px] text-gray-500 leading-snug">Enter a recent true 1RM. Leave blank if you prefer to estimate from a rep test.</div>
                        </div>
                    </div>

                    {/* OR Divider */}
                    <div className="col-span-12 lg:col-span-2 flex items-stretch my-2 lg:my-0">
                        <div className="w-full lg:w-auto flex lg:flex-col items-center justify-center relative">
                            <div className="hidden lg:block h-full w-px bg-gray-700/50" />
                            <div className="lg:absolute lg:inset-y-1/2 lg:-translate-y-1/2 flex items-center justify-center">
                                <span className="text-[10px] tracking-wide uppercase text-gray-500 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/70">OR</span>
                            </div>
                            <div className="hidden lg:block h-full w-px bg-gray-700/50" />
                        </div>
                    </div>

                    {/* Rep Test Container */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className={`h-full rounded-md border ${hasOneRM ? 'border-gray-700/50 opacity-60' : 'border-gray-700'} bg-gray-900/60 p-3 flex flex-col gap-2`}>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-300">Rep Test (Weight × Reps)</label>
                                {hasOneRM && <span className="text-[10px] text-gray-500">disabled (1RM in use)</span>}
                            </div>
                            <div className="flex gap-2 flex-nowrap">
                                <input
                                    type="number"
                                    value={lift.repWeight}
                                    onChange={(e) => updateLift(liftKey, { repWeight: e.target.value, oneRM: '' })}
                                    className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                                    disabled={hasOneRM}
                                    placeholder="Weight"
                                />
                                <input
                                    type="number"
                                    value={lift.repCount}
                                    onChange={(e) => updateLift(liftKey, { repCount: e.target.value, oneRM: '' })}
                                    className="w-24 shrink-0 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                                    disabled={hasOneRM}
                                    placeholder="Reps"
                                />
                                {hasRepTest && (
                                    <button
                                        onClick={() => copyRepTestToAll(liftKey)}
                                        className="text-[11px] px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-600 text-gray-200 border border-gray-600 shrink-0"
                                        title="Copy rep test to all lifts"
                                    >Copy</button>
                                )}
                            </div>
                            <div className="text-[10px] text-gray-500 leading-snug">Use a recent submax set (3–10 reps). We'll estimate e1RM & TM.</div>
                        </div>
                    </div>

                    {/* TM Override & Validation */}
                    <div className="col-span-12 mt-4 grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-6 sm:col-span-3 md:col-span-2">
                            <label className="block text-sm mb-1 text-gray-300">TM Override</label>
                            <input
                                type="number"
                                value={lift.tmOverride}
                                onChange={(e) => updateLift(liftKey, { tmOverride: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                                placeholder="Override"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3 md:col-span-2 flex items-end">
                            <div className="flex items-center gap-2 text-[11px] text-gray-400">
                                {validation.level === 'success' && <div className="w-3 h-3 bg-green-500 rounded-full" title="In recommended range" />}
                                {validation.level === 'warning' && <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Very conservative" />}
                                {validation.level === 'danger' && <div className="w-3 h-3 bg-red-500 rounded-full" title="Too high" />}
                                <span className="text-[10px] text-gray-500">Validation</span>
                            </div>
                        </div>
                    </div>
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
