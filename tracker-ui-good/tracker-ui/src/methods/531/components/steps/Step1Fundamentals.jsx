/**
 * Step1Fundamentals.jsx - Program Fundamentals Step
 * Units, rounding, TM%, 1RM/rep tests with real-time calculation and validation
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ToggleButton from '../ToggleButton.jsx';
import { Info, AlertTriangle, Calculator, Copy, CheckCircle2 } from 'lucide-react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { roundToIncrement } from '../../../../lib/math/rounding.ts';
import { UNITS, incrementFor } from '../../../../lib/units.ts';
import { getTmPct } from '../../../../lib/tm.ts';

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

export default function Step1Fundamentals({ onValidChange, flashToken, missing = [] }) {
    const { state, dispatch } = useProgramV2();

    // Helper: read canonical tmPct (decimal) from state
    const readTmPctInt = (s) => Math.round(getTmPct(s) * 100);

    // Local working state for smooth typing
    const [showUnitConvert, setShowUnitConvert] = useState(false);
    const [pendingUnit, setPendingUnit] = useState(null);
    const [localState, setLocalState] = useState({
        units: state.units === 'lb' ? UNITS.LBS : state.units,
        rounding: state.rounding,
        tmPct: getTmPct(state),
        lifts: {
            squat: { oneRM: state.lifts.squat.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM' },
            bench: { oneRM: state.lifts.bench.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM' },
            deadlift: { oneRM: state.lifts.deadlift.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM' },
            press: { oneRM: state.lifts.press.oneRM || '', repWeight: '', repCount: '', tmOverride: '', activeMethod: 'oneRM' }
        }
    });

    // Auto-save flash indicator
    const [autoSaved, setAutoSaved] = useState(false);
    const autoSaveTimerRef = useRef(null);

    // Overall progress (count lifts with a valid computed or overridden TM > 0)
    const tmProgress = useMemo(() => {
        let completed = 0;
        const total = Object.keys(localState.lifts).length;
        Object.entries(localState.lifts).forEach(([liftKey, lift]) => {
            let oneRM = null;
            if (lift.oneRM && Number(lift.oneRM) > 0) oneRM = Number(lift.oneRM);
            else if (lift.repWeight && lift.repCount && Number(lift.repWeight) > 0 && Number(lift.repCount) > 0) {
                oneRM = calculateE1RM(Number(lift.repWeight), Number(lift.repCount));
            }
            let tm = null;
            if (lift.tmOverride && Number(lift.tmOverride) > 0) tm = Number(lift.tmOverride);
            else if (oneRM) tm = calculateTM(oneRM, localState.tmPct);
            if (tm && tm > 0) completed += 1;
        });
        const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
        return { completed, total, percent };
    }, [localState.lifts, localState.tmPct]);

    // Debounced dispatch to V2 context
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch({ type: 'SET_UNITS', units: localState.units });
            dispatch({ type: 'SET_ROUNDING', rounding: localState.rounding });
            dispatch({ type: 'SET_TM_PCT', tmPct: localState.tmPct }); // canonical decimal

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
                    tm = roundToIncrement(Number(lift.tmOverride), incrementFor(localState.units));
                } else if (oneRM) {
                    tm = roundToIncrement(calculateTM(oneRM, localState.tmPct), incrementFor(localState.units));
                }

                liftData[liftKey] = { name: liftKey, oneRM, tm };
            });

            dispatch({ type: 'BULK_SET_LIFTS', lifts: liftData });
            // Explicitly persist each TM into unified trainingMaxes map for downstream steps
            Object.entries(liftData).forEach(([liftKey, data]) => {
                if (Number(data.tm) > 0) {
                    dispatch({ type: 'SET_TRAINING_MAX', lift: liftKey, tm: data.tm });
                }
            });

            // Trigger auto-saved flash
            setAutoSaved(true);
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = setTimeout(() => setAutoSaved(false), 1200);
        }, 250);

        return () => clearTimeout(timeoutId);
    }, [localState, dispatch]);

    // Validation check
    const isValid = useMemo(() => {
        const pct = readTmPctInt(state);
        const tmOk = Number.isFinite(pct) && pct >= 80 && pct <= 95;
        const liftsOk = Object.keys(localState.lifts).every(liftKey => {
            const lift = localState.lifts[liftKey];
            const hasOneRM = lift.oneRM && Number(lift.oneRM) > 0;
            const hasRepTest = lift.repWeight && lift.repCount && Number(lift.repWeight) > 0 && Number(lift.repCount) > 0;
            return hasOneRM || hasRepTest;
        });
        return tmOk && liftsOk;
    }, [localState.lifts, state]);

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

    const applyUnitChange = useCallback((unit, mode) => {
        // mode: 'convert' | 'keep'
        setLocalState(prev => {
            if (prev.units === unit) return prev;
            const factor = unit === 'kg' ? 0.45359237 : 2.20462262; // LB -> KG or KG -> LB
            const nextLifts = { ...prev.lifts };
            Object.keys(nextLifts).forEach(k => {
                ['oneRM', 'repWeight', 'tmOverride'].forEach(field => {
                    const raw = nextLifts[k][field];
                    if (!raw) return; // skip empty
                    if (mode === 'convert') {
                        const num = Number(raw);
                        if (Number.isFinite(num)) {
                            const converted = num * factor;
                            nextLifts[k][field] = String(Math.round(converted * 100) / 100);
                        }
                    } // keep: do nothing
                });
            });
            return { ...prev, units: unit, lifts: nextLifts };
        });
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
        if (hasOneRM) e1rm = Number(lift.oneRM); else if (hasRepTest) e1rm = calculateE1RM(Number(lift.repWeight), Number(lift.repCount));
        const suggestedTM = e1rm ? roundToIncrement(calculateTM(e1rm, localState.tmPct), incrementFor(localState.units)) : null;
        const finalTM = hasOverride ? roundToIncrement(Number(lift.tmOverride), incrementFor(localState.units)) : suggestedTM;
        const validation = validateTM(finalTM, e1rm);
        const needsAttention = (missing.includes(`${liftKey} TM`) || missing.includes(liftKey)) && flashToken > 0;

        const methods = [
            { id: 'oneRM', label: 'Tested 1RM', hint: "Enter the heaviest weight you've successfully lifted for 1 rep." },
            { id: 'reps', label: 'Rep Calculator', hint: 'Enter weight and reps from a recent set (3–10 reps work best).' },
            { id: 'override', label: 'Manual Override', hint: 'Enter your desired training max directly (typically 85–90% of 1RM).' }
        ];
        const setActiveMethod = (m) => updateLift(liftKey, { activeMethod: m });
        const isActive = (m) => lift.activeMethod === m;
        const methodCompleted = { oneRM: hasOneRM, reps: hasRepTest, override: hasOverride };

        return (
            <div key={liftKey} className={`p-4 rounded-xl bg-gray-800/40 border ${needsAttention ? 'border-amber-500/70 animate-pulse' : 'border-gray-700/60'} space-y-3`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h4 className="text-lg font-semibold text-white tracking-tight flex items-center gap-1">
                            {LIFT_LABELS[liftKey]}
                            {finalTM ? <CheckCircle2 className="w-4 h-4 text-green-500" aria-label="Training max set" /> : null}
                        </h4>
                        <div className="text-[12px] text-gray-400 mt-0.5 flex flex-wrap items-center gap-1">
                            {e1rm ? <><span>e1RM</span><span className="text-gray-300 font-mono">{Math.round(e1rm)}</span></> : <span>Select a method</span>}
                            {finalTM && <><span className="text-gray-600">•</span><span>TM</span><span className="text-gray-200 font-mono">{finalTM}</span></>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-start">
                        <span className={`px-3 py-1.5 rounded-md text-[12px] font-semibold flex items-center gap-1 bg-gray-900/80 border shadow-sm ${finalTM ? 'border-green-600/60 text-green-300' : 'border-gray-700 text-gray-500'}`}>
                            TM <span className={`${finalTM ? 'text-green-400 font-bold' : 'text-gray-500 font-medium'}`}>{finalTM || '—'}</span>
                        </span>
                        {(validation.level === 'warning' || validation.level === 'danger') && (
                            <span className={`px-2 py-1 rounded text-[12px] font-medium border ${validation.level === 'warning' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-600/40' : 'bg-red-500/15 text-red-400 border-red-600/40'}`}>{validation.level === 'warning' ? 'Low' : 'High'}</span>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] uppercase tracking-wide text-gray-400 font-medium">Choose one method:</span>
                    </div>
                    <div role="tablist" className="inline-flex flex-wrap gap-1 bg-gray-900/70 backdrop-blur-sm p-1.5 rounded-lg border border-gray-700/70 shadow-inner">
                        {methods.map(m => (
                            <button
                                key={m.id}
                                role="tab"
                                aria-selected={isActive(m.id)}
                                onClick={() => setActiveMethod(m.id)}
                                className={`px-3.5 py-1.5 text-[12px] md:text-sm font-semibold rounded-md border transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-600/40 ${isActive(m.id)
                                    ? 'bg-red-600/30 border-red-500/70 text-red-200 shadow-sm'
                                    : methodCompleted[m.id]
                                        ? 'bg-gray-800/90 border-green-600/60 text-green-400 hover:bg-gray-700'
                                        : 'bg-gray-800/70 border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-600'}`}
                            >
                                {m.label}
                                {methodCompleted[m.id] && !isActive(m.id) && <span className="text-green-500">✓</span>}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2">
                        {lift.activeMethod === 'oneRM' && (
                            <div className="space-y-2">
                                <p className="text-[13px] text-gray-400">Enter the heaviest weight you've successfully lifted for 1 rep.</p>
                                <div>
                                    <label className="block text-[12px] uppercase tracking-wide text-gray-400 mb-1">Weight</label>
                                    <input
                                        type="number"
                                        value={lift.oneRM}
                                        onChange={(e) => updateLift(liftKey, { oneRM: e.target.value, repWeight: '', repCount: '', tmOverride: '' })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                        placeholder="e.g. 280"
                                    />
                                </div>
                                {suggestedTM && hasOneRM && (
                                    <div className="text-[13px] bg-gray-900/70 border border-red-500/40 rounded p-2 flex justify-between items-center">
                                        <span className="text-gray-400">TM ({Math.round(localState.tmPct * 100)}%)</span>
                                        <span className="text-red-400 font-semibold">{suggestedTM}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {lift.activeMethod === 'reps' && (
                            <div className="space-y-2">
                                <p className="text-[13px] text-gray-400">Enter weight and reps from a recent set (3–10 reps work best).</p>
                                <div className="flex gap-2 flex-wrap">
                                    <input
                                        type="number"
                                        value={lift.repWeight}
                                        onChange={(e) => updateLift(liftKey, { repWeight: e.target.value, oneRM: '', tmOverride: '' })}
                                        className="flex-1 min-w-[120px] bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                        placeholder="Weight"
                                    />
                                    <input
                                        type="number"
                                        value={lift.repCount}
                                        onChange={(e) => updateLift(liftKey, { repCount: e.target.value, oneRM: '', tmOverride: '' })}
                                        className="w-28 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                        placeholder="Reps"
                                        min={1}
                                        max={12}
                                    />
                                    {hasRepTest && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); copyRepTestToAll(liftKey); }}
                                            className="text-[12px] px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600"
                                        >Copy to All</button>
                                    )}
                                </div>
                                {hasRepTest && suggestedTM && (
                                    <div className="text-[13px] bg-gray-900/70 border border-red-500/40 rounded p-2">
                                        <span className="text-gray-400">Est. 1RM </span>
                                        <span className="text-gray-300 font-mono">{e1rm && Math.round(e1rm)}</span>
                                        <span className="mx-1">→</span>
                                        <span className="text-gray-400">TM </span>
                                        <span className="text-red-400 font-semibold">{suggestedTM}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {lift.activeMethod === 'override' && (
                            <div className="space-y-2">
                                <p className="text-[13px] text-gray-400">Enter your desired training max directly (typically 85–90% of 1RM).</p>
                                <div>
                                    <label className="block text-[12px] uppercase tracking-wide text-gray-400 mb-1">Training Max</label>
                                    <input
                                        type="number"
                                        value={lift.tmOverride}
                                        onChange={(e) => updateLift(liftKey, { tmOverride: e.target.value, oneRM: '', repWeight: '', repCount: '' })}
                                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                                        placeholder="e.g. 250"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg px-5 py-4 flex flex-col gap-3 md:gap-2 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:w-auto flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">Step 1 — Program Fundamentals</h2>
                    <p className="text-gray-300 text-sm md:text-base mb-2 md:mb-1 leading-snug">Configure base settings and establish training maxes (TMs) for all four main lifts.</p>
                    <div className="flex items-center gap-3" aria-label="Training max progress">
                        <div className="w-48 h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 transition-all duration-300" style={{ width: `${tmProgress.percent}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-400 tabular-nums">{tmProgress.completed}/{tmProgress.total} set</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {autoSaved && (
                        <div className="inline-flex items-center gap-1 text-[12px] font-medium text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-md shadow-sm transition-opacity animate-pulse">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-400" /> Auto-saved
                        </div>
                    )}
                </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center justify-start mb-2 gap-4">
                    <h3 className="text-lg font-semibold text-white tracking-wide uppercase">Settings</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 items-start">
                    {/* Units */}
                    <div>
                        <label className="block text-[12px] font-semibold text-gray-300 mb-1 uppercase tracking-wide">Units</label>
                        <div className="flex gap-2 mb-1">
                            {[UNITS.LBS, UNITS.KG].map(unit => (
                                <ToggleButton
                                    key={unit}
                                    on={localState.units === unit}
                                    onClick={() => {
                                        if (unit === localState.units) return;
                                        setPendingUnit(unit);
                                        setShowUnitConvert(true);
                                    }}
                                    className="text-xs px-4"
                                >{unit.toUpperCase()}</ToggleButton>
                            ))}
                        </div>
                        <p className="text-[12px] leading-snug text-gray-400">Choose weight units. <span className="font-medium text-gray-300">LB</span> uses 2.5 / 5 lb increments, <span className="font-medium text-gray-300">KG</span> uses 1.25 / 2.5 kg increments.</p>
                        {showUnitConvert && (
                            <div className="mt-2 p-3 rounded-md bg-gray-900/80 border border-gray-700 space-y-2">
                                <p className="text-[12px] text-gray-300">Convert existing numbers to {pendingUnit?.toUpperCase()} or keep values as typed?</p>
                                <div className="flex gap-2">
                                    <button type="button" className="px-3 py-1.5 rounded bg-red-600/70 text-white text-[12px]" onClick={() => { applyUnitChange(pendingUnit, 'convert'); setShowUnitConvert(false); }}>Convert</button>
                                    <button type="button" className="px-3 py-1.5 rounded bg-gray-700 text-gray-200 text-[12px]" onClick={() => { applyUnitChange(pendingUnit, 'keep'); setShowUnitConvert(false); }}>Keep</button>
                                    <button type="button" className="px-3 py-1.5 rounded bg-gray-800 text-gray-400 text-[12px]" onClick={() => { setShowUnitConvert(false); setPendingUnit(null); }}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rounding */}
                    <div>
                        <label className="block text-[12px] font-semibold text-gray-300 mb-1 uppercase tracking-wide">Rounding</label>
                        <select
                            value={localState.rounding}
                            onChange={(e) => updateLocalState({ rounding: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none mb-1"
                        >
                            <option value="ceil">Round up</option>
                            <option value="nearest">Nearest</option>
                            <option value="floor">Round down</option>
                        </select>
                        <ul className="text-[12px] leading-snug text-gray-400 space-y-0.5">
                            <li><span className="text-gray-400 font-medium">Round up:</span> Always to next increment (slightly heavier).</li>
                            <li><span className="text-gray-400 font-medium">Nearest:</span> Standard rounding (recommended).</li>
                            <li><span className="text-gray-400 font-medium">Round down:</span> Slightly lighter / conservative.</li>
                        </ul>
                    </div>

                    {/* TM Percentage */}
                    <div>
                        <label className="block text-[12px] font-semibold text-gray-300 mb-1 uppercase tracking-wide">Training Max %</label>
                        <div className="flex gap-2 mb-1">
                            {[90, 85].map(p => (
                                <ToggleButton
                                    key={p}
                                    on={readTmPctInt(localState) === p}
                                    onClick={() => {
                                        updateLocalState({ tmPct: p / 100 });
                                        dispatch({ type: 'SET_TM_PCT', tmPct: p / 100 });
                                    }}
                                    className="text-xs px-4"
                                >{p}%</ToggleButton>
                            ))}
                        </div>
                        <ul className="text-[12px] leading-snug text-gray-400 space-y-0.5">
                            <li><span className="text-gray-400 font-medium">90%:</span> Standard starting point for most lifters.</li>
                            <li><span className="text-gray-400 font-medium">85%:</span> Conservative (new lifters, return from layoff/injury).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Training Max Inputs */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg px-5 py-6 space-y-6">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">Training Maxes</h3>
                <div className="prose prose-invert max-w-none text-sm md:text-[15px] leading-relaxed [&_strong]:text-gray-100 [&_strong]:font-semibold">
                    <p className="text-gray-200">Establish your training max for each lift using <strong>ONE</strong> of three methods. Your training max should be <strong>85–90% of your true 1RM</strong> to allow sustainable progress without burnout.</p>
                    <div className="space-y-5 mt-4">
                        <div className="bg-gray-900/60 border border-gray-700/70 rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-semibold text-white mb-1">Tested 1RM <span className="text-xs font-medium text-gray-500">— Use your actual tested maximum</span></h4>
                            <p className="text-gray-300 text-sm">Enter the heaviest weight you can lift for 1 clean rep with solid form (no grind). Wendler suggests it should feel like you could perform 2–3 more reps on a fresh day.</p>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700/70 rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-semibold text-white mb-1">Rep Calculator <span className="text-xs font-medium text-gray-500">— Calculate from recent rep test (3–10 reps)</span></h4>
                            <p className="text-gray-300 text-sm">Use Wendler's formula: <span className="font-mono">Est. 1RM = Weight × Reps × 0.0333 + Weight</span>. Most accurate with sets of 3–5 reps. Enter weight and reps from your most recent heavy set.</p>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700/70 rounded-lg p-4 shadow-sm">
                            <h4 className="text-base font-semibold text-white mb-1">Manual Override <span className="text-xs font-medium text-gray-500">— Set custom training max (85–90% of 1RM)</span></h4>
                            <p className="text-gray-300 text-sm">Directly input your desired training max. Use <strong>85%</strong> if returning from a break, managing fatigue, or prioritizing long runway. Use <strong>90%</strong> for standard progression. Better to start <em>too light</em> than too heavy.</p>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-400 text-sm">Only one method is needed per lift. Switching tabs preserves previous entries but only the active tab's data is used.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-5">
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
