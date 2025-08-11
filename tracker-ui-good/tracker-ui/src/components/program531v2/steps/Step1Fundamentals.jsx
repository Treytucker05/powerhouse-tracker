/**
 * Step1Fundamentals.jsx - Program Fundamentals Step
 * Units, rounding, TM%, 1RM/rep tests with real-time calculation and validation
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Info, AlertTriangle, Calculator, Copy } from 'lucide-react';
import { useProgramV2 } from '../../../contexts/ProgramContextV2.jsx';
import { roundToIncrement } from '../../../lib/engines/FiveThreeOneEngine.v2.js';

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

    useEffect(() => {
        onValidChange(isValid);
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
            <div key={liftKey} className="grid grid-cols-12 gap-3 py-3 border-b border-gray-700/50 items-center">
                {/* Lift Name */}
                <div className="col-span-2">
                    <div className="font-medium text-white">{LIFT_LABELS[liftKey]}</div>
                </div>

                {/* One-Rep Max */}
                <div className="col-span-2">
                    <input
                        type="number"
                        placeholder="1RM"
                        value={lift.oneRM}
                        onChange={(e) => updateLift(liftKey, {
                            oneRM: e.target.value,
                            repWeight: '', // Clear rep test when entering 1RM
                            repCount: ''
                        })}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                        disabled={hasRepTest}
                    />
                </div>

                {/* OR Separator */}
                <div className="col-span-1 text-center">
                    <span className="text-gray-500 text-sm">OR</span>
                </div>

                {/* Rep Test */}
                <div className="col-span-3 flex space-x-2">
                    <input
                        type="number"
                        placeholder="Weight"
                        value={lift.repWeight}
                        onChange={(e) => updateLift(liftKey, {
                            repWeight: e.target.value,
                            oneRM: '' // Clear 1RM when entering rep test
                        })}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                        disabled={hasOneRM}
                    />
                    <span className="text-gray-400 text-sm self-center">×</span>
                    <input
                        type="number"
                        placeholder="Reps"
                        value={lift.repCount}
                        onChange={(e) => updateLift(liftKey, {
                            repCount: e.target.value,
                            oneRM: '' // Clear 1RM when entering rep test
                        })}
                        className="w-16 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                        disabled={hasOneRM}
                    />
                    {hasRepTest && (
                        <button
                            onClick={() => copyRepTestToAll(liftKey)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                            title="Copy rep test to all lifts"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* e1RM Preview */}
                <div className="col-span-1 text-center">
                    <span className="text-gray-300 text-sm font-mono">
                        {e1rm ? Math.round(e1rm) : '—'}
                    </span>
                </div>

                {/* Suggested TM */}
                <div className="col-span-1 text-center">
                    <span className="text-gray-300 text-sm font-mono">
                        {suggestedTM || '—'}
                    </span>
                </div>

                {/* TM Override */}
                <div className="col-span-1">
                    <input
                        type="number"
                        placeholder="Override"
                        value={lift.tmOverride}
                        onChange={(e) => updateLift(liftKey, { tmOverride: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                    />
                </div>

                {/* Validation */}
                <div className="col-span-1 text-center">
                    {validation.level === 'success' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                    {validation.level === 'warning' && <div className="w-3 h-3 bg-yellow-500 rounded-full" />}
                    {validation.level === 'danger' && <div className="w-3 h-3 bg-red-500 rounded-full" />}
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
                        <div className="flex space-x-2">
                            {['lb', 'kg'].map(unit => (
                                <button
                                    key={unit}
                                    onClick={() => updateLocalState({ units: unit })}
                                    className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${localState.units === unit
                                            ? 'border-red-500 bg-red-600/20 text-red-400'
                                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    {unit.toUpperCase()}
                                </button>
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
                            <option value="ceil">Ceil (Round Up)</option>
                            <option value="nearest">Nearest</option>
                            <option value="floor">Floor (Round Down)</option>
                        </select>
                    </div>

                    {/* TM Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Training Max %</label>
                        <div className="flex space-x-2">
                            {[0.90, 0.85].map(pct => (
                                <button
                                    key={pct}
                                    onClick={() => updateLocalState({ tmPct: pct })}
                                    className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${localState.tmPct === pct
                                            ? 'border-red-500 bg-red-600/20 text-red-400'
                                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                                        }`}
                                >
                                    {Math.round(pct * 100)}%
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lifts Table */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Training Maxes</h3>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 py-3 border-b border-gray-600 text-sm font-medium text-gray-300">
                    <div className="col-span-2">Lift</div>
                    <div className="col-span-2">One-Rep Max</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-3">Rep Test (Weight × Reps)</div>
                    <div className="col-span-1 text-center">e1RM</div>
                    <div className="col-span-1 text-center">TM ({Math.round(localState.tmPct * 100)}%)</div>
                    <div className="col-span-1 text-center">Override</div>
                    <div className="col-span-1 text-center">✓</div>
                </div>

                {/* Lift Rows */}
                {Object.keys(localState.lifts).map(renderLiftRow)}
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
                            <h4 className="font-semibold text-yellow-300 mb-1">TM Validation</h4>
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
