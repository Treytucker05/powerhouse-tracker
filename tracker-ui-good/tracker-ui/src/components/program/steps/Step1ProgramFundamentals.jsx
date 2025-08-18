// src/components/program/steps/Step1ProgramFundamentals.jsx
import React, { useMemo } from 'react';
import { Info, AlertTriangle, CheckCircle, Calculator, Wand2, Sliders, Ruler } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { estimate1RM } from '../../../lib/fiveThreeOne/compute531.js';
import { roundToIncrement } from '../../../lib/math/rounding.ts';
import { getTmPct } from '../../../lib/tm.ts';

const LIFT_ORDER = ['press', 'deadlift', 'bench', 'squat'];
const LIFT_LABEL = { press: 'Overhead Press', bench: 'Bench Press', deadlift: 'Deadlift', squat: 'Back Squat' };

function numOrNull(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

export default function Step1ProgramFundamentals({ data, updateData }) {
    const state = data || {};

    // ----- GLOBAL CONTROLS -----
    const units = state.units ?? 'lb';
    const rounding = state.rounding || { increment: units === 'kg' ? 2.5 : 5, mode: 'nearest' };
    const tmPctDecimal = getTmPct(state); // canonical decimal (0.80–0.95 typical)
    const tmPctGlobalInt = Math.round(tmPctDecimal * 100); // integer 80-95

    const lifts = state.lifts || {
        squat: { oneRM: null, tm: null, tmPct: tmPctDecimal },
        bench: { oneRM: null, tm: null, tmPct: tmPctDecimal },
        deadlift: { oneRM: null, tm: null, tmPct: tmPctDecimal },
        press: { oneRM: null, tm: null, tmPct: tmPctDecimal },
    };
    const enabled = state.coreLiftsEnabled || { squat: true, bench: true, deadlift: true, press: true };

    const setGlobal = (patch) => updateData({ ...state, ...patch });

    const setRounding = (patch) => {
        const next = { ...(state.rounding || {}), ...patch };
        setGlobal({ rounding: next });
    };

    const setLift = (lift, patch) => {
        const next = { ...(lifts[lift] || {}), ...patch };
        updateData({ ...state, lifts: { ...lifts, [lift]: next } });
    };

    const toggleLift = (lift, on) => {
        updateData({ ...state, coreLiftsEnabled: { ...enabled, [lift]: on } });
    };

    const applyTmPctToAll = (pctInt) => {
        const pctDecimal = pctInt / 100;
        const next = { ...lifts };
        for (const k of Object.keys(next)) {
            next[k] = { ...(next[k] || {}), tmPct: pctDecimal };
        }
        updateData({ ...state, tmPct: pctDecimal, lifts: next });
    };

    const computeTM = (oneRM, tmPct, inc, mode) => {
        if (!oneRM) return null;
        const raw = oneRM * (tmPct / 100);
        return roundToIncrement(raw, inc, mode);
    };

    const inferOneRM = (liftObj) => {
        // Prefer explicit 1RM; if not present, compute from rep test if provided
        if (numOrNull(liftObj.oneRM)) return numOrNull(liftObj.oneRM);
        const w = numOrNull(liftObj.testWeight);
        const r = numOrNull(liftObj.testReps);
        if (w && r && r >= 1) return estimate1RM(w, r);
        return null;
    };

    const calcAllTMs = () => {
        const inc = rounding?.increment ?? (units === 'kg' ? 2.5 : 5);
        const mode = rounding?.mode ?? 'nearest';
        const next = { ...lifts };
        for (const k of Object.keys(next)) {
            if (!enabled[k]) continue;
            const lo = next[k] || {};
            // Prefer per-lift decimal if present, else global
            const tmPctPercent = (typeof lo.tmPct === 'number' && lo.tmPct <= 1)
                ? Math.round(lo.tmPct * 100)
                : tmPctGlobalInt;
            const one = inferOneRM(lo);
            const tm = computeTM(one, tmPctPercent, inc, mode);
            next[k] = { ...lo, oneRM: one, tm, tmPct: tmPctPercent / 100 };
        }
        updateData({ ...state, lifts: next });
    };

    // Auto choose rounding increment when switching units if user never set it.
    const onUnitsChange = (val) => {
        const wantsKg = val === 'kg';
        const autoInc = wantsKg ? 2.5 : 5;
        const currentInc = state.rounding?.increment;
        const newRounding = currentInc ? state.rounding : { increment: autoInc, mode: 'nearest' };
        updateData({ ...state, units: val, rounding: newRounding });
    };

    const warmupText = 'Warm‑up: 40/50/60% TM × 5/5/3 (Wendler standard)';

    const completionHint = useMemo(() => {
        const missing = [];
        for (const k of LIFT_ORDER) {
            if (!enabled[k]) continue;
            const L = lifts[k] || {};
            if (!(numOrNull(L.tm) || numOrNull(L.oneRM) || (numOrNull(L.testWeight) && numOrNull(L.testReps)))) {
                missing.push(LIFT_LABEL[k]);
            }
        }
        return missing;
    }, [lifts, enabled]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 1: Program Fundamentals</h3>
                    <p className="text-gray-400 text-sm">
                        Set units, rounding, and enter either 1RM or a rep test for each lift. The calculator will suggest Training Max (TM).
                    </p>
                </div>
                <StepStatusPill stepId={STEP_IDS.PROGRAM_FUNDAMENTALS} data={state} />
            </div>

            {/* Info box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Wendler Rules</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Calculate all work sets from the <b>Training Max (TM)</b>, not your true 1RM.</li>
                            <li>Standard TM is <b>90%</b> of 1RM (or e1RM from a rep test). Conservative: 85%.</li>
                            <li>{warmupText} before main sets.</li>
                            <li>Start a little light. If you can’t get ≥5 on Week‑1 top set, your TM is too high.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Global controls */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-white font-medium">
                        <Sliders className="w-5 h-5" /> Global Settings
                    </div>
                    <button
                        onClick={() => applyTmPctToAll(tmPctGlobalInt)}
                        className="inline-flex items-center gap-2 text-sm px-3 py-1 border border-red-500 rounded hover:bg-red-600/10"
                        title="Apply this TM% to all lifts"
                    >
                        <Wand2 className="w-4 h-4" />
                        Apply TM% to all
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Units */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-300 mb-1">Units</label>
                        <select
                            value={units}
                            onChange={(e) => onUnitsChange(e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        >
                            <option value="lb">Pounds (lb)</option>
                            <option value="kg">Kilograms (kg)</option>
                        </select>
                    </div>

                    {/* Rounding increment */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-300 mb-1">Rounding Increment</label>
                        <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            value={rounding?.increment ?? (units === 'kg' ? 2.5 : 5)}
                            onChange={(e) => setRounding({ increment: numOrNull(e.target.value) || (units === 'kg' ? 2.5 : 5) })}
                            className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">
                            Typical: 5 lb or 2.5 kg
                        </span>
                    </div>

                    {/* Rounding mode */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-300 mb-1">Rounding Mode</label>
                        <select
                            value={rounding?.mode || 'nearest'}
                            onChange={(e) => setRounding({ mode: e.target.value })}
                            className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        >
                            <option value="nearest">Nearest</option>
                            <option value="ceiling">Ceiling</option>
                            <option value="floor">Floor</option>
                        </select>
                    </div>

                    {/* Global TM% */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-300 mb-1">Global TM %</label>
                        <input
                            type="number"
                            min="80"
                            max="95"
                            value={tmPctGlobalInt}
                            onChange={(e) => {
                                const pct = Math.max(80, Math.min(95, Number(e.target.value) || 90));
                                setGlobal({ tmPct: pct / 100 });
                            }}
                            className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                        <span className="text-xs text-gray-500 mt-1">Wendler default: 90%</span>
                    </div>
                </div>
            </div>

            {/* Lift cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LIFT_ORDER.map((lift) => {
                    const L = lifts[lift] || {};
                    const on = enabled[lift] ?? true;
                    const oneRM = inferOneRM(L);
                    const tmPct = (typeof L.tmPct === 'number' && L.tmPct <= 1) ? L.tmPct : (tmPctGlobalInt / 100);
                    const inc = rounding?.increment ?? (units === 'kg' ? 2.5 : 5);
                    const mode = rounding?.mode ?? 'nearest';
                    const suggestedTM = oneRM ? roundToIncrement(oneRM * (tmPct / 100), inc, mode) : null;

                    return (
                        <div key={lift} className="bg-gray-900/60 border border-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-white font-medium">{LIFT_LABEL[lift]}</div>
                                <label className="text-sm text-gray-300 flex items-center gap-2">
                                    <input type="checkbox" checked={!!on} onChange={(e) => toggleLift(lift, e.target.checked)} />
                                    Enable
                                </label>
                            </div>

                            {!on ? (
                                <div className="text-gray-500 text-sm">Lift disabled for this program.</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* 1RM direct */}
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-300 mb-1">1RM ({units})</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                value={L.oneRM ?? ''}
                                                onChange={(e) => setLift(lift, { oneRM: numOrNull(e.target.value) })}
                                                className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                            />
                                            <span className="text-xs text-gray-500 mt-1">Leave blank if using a rep test.</span>
                                        </div>

                                        {/* Rep test */}
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-300 mb-1">Rep Test (Weight × Reps)</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Weight"
                                                    value={L.testWeight ?? ''}
                                                    onChange={(e) => setLift(lift, { testWeight: numOrNull(e.target.value) })}
                                                    className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Reps"
                                                    value={L.testReps ?? ''}
                                                    onChange={(e) => setLift(lift, { testReps: numOrNull(e.target.value) })}
                                                    className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">
                                                e1RM = weight × reps × 0.0333 + weight
                                            </span>
                                        </div>

                                        {/* TM% override */}
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-300 mb-1">TM % (this lift)</label>
                                            <input
                                                type="number"
                                                min="80"
                                                max="95"
                                                value={Math.round(tmPct * 100)}
                                                onChange={(e) => {
                                                    const pctVal = Math.max(80, Math.min(95, Number(e.target.value) || Math.round(tmPct * 100)));
                                                    setLift(lift, { tmPct: pctVal / 100 });
                                                }}
                                                className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                            />
                                            <span className="text-xs text-gray-500 mt-1">Default comes from Global TM% above.</span>
                                        </div>

                                        {/* TM (computed or manual override) */}
                                        <div className="flex flex-col">
                                            <label className="text-sm text-gray-300 mb-1">Training Max (TM)</label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="0"
                                                value={L.tm ?? ''}
                                                onChange={(e) => setLift(lift, { tm: numOrNull(e.target.value) })}
                                                className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                            />
                                            <span className="text-xs text-gray-500 mt-1">You can override the computed TM here.</span>
                                        </div>
                                    </div>

                                    {/* Calculated preview */}
                                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                        <div className="bg-gray-800/60 border border-gray-700 rounded p-2">
                                            <div className="text-gray-400 text-xs">e1RM (computed)</div>
                                            <div className="text-white font-medium">{oneRM ? `${Math.round(oneRM)} ${units}` : '—'}</div>
                                        </div>
                                        <div className="bg-gray-800/60 border border-gray-700 rounded p-2">
                                            <div className="text-gray-400 text-xs">Suggested TM</div>
                                            <div className="text-white font-medium">{suggestedTM ? `${suggestedTM} ${units}` : '—'}</div>
                                        </div>
                                        <div className="bg-gray-800/60 border border-gray-700 rounded p-2">
                                            <div className="text-gray-400 text-xs">Current TM</div>
                                            <div className="text-white font-medium">{L.tm ? `${L.tm} ${units}` : '—'}</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => {
                                                const one = inferOneRM(L);
                                                const tm = computeTM(one, Math.round(tmPct * 100), inc, mode);
                                                setLift(lift, { oneRM: one, tm, tmPct });
                                            }}
                                            className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500 rounded hover:bg-blue-600/10"
                                        >
                                            <Calculator className="w-4 h-4" />
                                            Set TM from 1RM/Rep Test
                                        </button>
                                        <button
                                            onClick={() => setLift(lift, { oneRM: null, testWeight: null, testReps: null, tm: null })}
                                            className="inline-flex items-center gap-2 px-3 py-1 border border-gray-600 rounded hover:bg-gray-600/10"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Batch calculator + guidance */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-white font-medium">
                        <Ruler className="w-5 h-5" /> Batch Calculate
                    </div>
                    <button
                        onClick={calcAllTMs}
                        className="inline-flex items-center gap-2 px-3 py-1 border border-red-500 rounded hover:bg-red-600/10"
                    >
                        <Calculator className="w-4 h-4" />
                        Calculate All TMs
                    </button>
                </div>
                <div className="text-sm text-gray-300">
                    This uses each lift’s 1RM (or e1RM from your rep test) and the lift’s TM% (or global TM%) with your rounding rules.
                </div>
            </div>

            {/* Small warning if lots missing */}
            {completionHint.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-200 rounded p-3 text-sm">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5" />
                        <div>
                            Enter 1RM or a rep test (and set TM) for: {completionHint.join(', ')}.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
