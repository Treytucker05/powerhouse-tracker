// src/components/program/steps/Step4CycleAndProgression.jsx
import React, { useMemo, useState } from 'react';
import { Info, CheckCircle, Calculator, RefreshCcw, TrendingUp, Award } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { LOADING_OPTIONS, calcMainSets, calcE1RM } from '../../../lib/fiveThreeOne/compute531.js';
import { applyIncrements, resetTM } from '../../../lib/fiveThreeOne/progression.js';

export default function Step4CycleAndProgression({ data, updateData }) {
    const st = data || {};
    const set = (patch) => updateData({ ...st, ...patch });

    const loading = st.loading || { option: 1, previewWeek: 1 };
    const rounding = st.rounding || { increment: 5, mode: 'nearest' };
    const increments = st.increments || { upper: 5, lower: 10 };
    const lifts = st.lifts || {};
    const prs = st.prs || {};

    const [prCalc, setPrCalc] = useState({ lift: 'bench', reps: 5 });

    const setLoadingOption = (opt) => set({ loading: { ...loading, option: opt } });
    const setPreviewWeek = (wk) => set({ loading: { ...loading, previewWeek: wk } });
    const setRounding = (patch) => set({ rounding: { ...rounding, ...patch } });
    const setIncrements = (patch) => set({ increments: { ...increments, ...patch } });

    // Actions
    const applyCycleIncrements = () => {
        const next = applyIncrements(lifts, increments, rounding);
        set({ lifts: next });
    };

    const doReset = (liftKey, mode) => {
        const currentTM = Number(lifts?.[liftKey]?.tm);
        if (!Number.isFinite(currentTM)) return;
        const ratio = mode === 'conservative' ? 0.85 : 0.90;
        const newTM = resetTM(currentTM, ratio, rounding);
        const next = { ...(lifts || {}) };
        next[liftKey] = { ...(next[liftKey] || {}), tm: newTM };
        set({ lifts: next });
    };

    const savePR = (liftKey, e1rm) => {
        const prev = prs?.[liftKey]?.bestE1RM || null;
        if (prev && e1rm <= prev) return; // no downgrade
        const next = { ...(prs || {}) };
        next[liftKey] = { ...(next[liftKey] || {}), bestE1RM: e1rm };
        set({ prs: next });
    };

    // Preview main sets for each lift using previewWeek
    const previewRows = useMemo(() => {
        const week = loading.previewWeek || 1;
        const inc = rounding?.increment ?? 5;
        const mode = rounding?.mode ?? 'nearest';
        const mapLift = (key) => {
            const tm = Number(lifts?.[key]?.tm);
            if (!Number.isFinite(tm)) return { key, tm: null, sets: [] };
            return {
                key,
                tm,
                sets: calcMainSets(tm, loading.option, week, { increment: inc, mode })
            };
        };
        return [mapLift('press'), mapLift('deadlift'), mapLift('bench'), mapLift('squat')];
    }, [lifts, loading, rounding]);

    // PR calculator (uses current preview week last set)
    const prCalcResult = useMemo(() => {
        const liftKey = prCalc.lift || 'bench';
        const tm = Number(lifts?.[liftKey]?.tm);
        if (!Number.isFinite(tm)) return { weight: 0, reps: prCalc.reps, e1rm: 0, isPR: false, best: 0 };
        const sets = calcMainSets(tm, loading.option, loading.previewWeek || 1, rounding);
        const last = sets[2];
        const weight = last?.weight ?? 0;
        const reps = Number(prCalc.reps) || 0;
        const e1rm = calcE1RM(weight, reps);
        const best = Number(prs?.[liftKey]?.bestE1RM) || 0;
        return { weight, reps, e1rm, isPR: e1rm > best, best };
    }, [prCalc, lifts, loading, rounding, prs]);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 4: Cycle & Progression</h3>
                    <p className="text-gray-400 text-sm">Select loading option, rounding, TM increments, and manage resets. Use the PR calculator to verify e1RM logic.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.CYCLE_AND_PROGRESSION} data={st} />
            </div>

            {/* Info */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">5/3/1 Guidance</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>All percentages are based on <b>Training Max (TM)</b>, not true 1RM.</li>
                            <li>Week 1: 5+, Week 2: 3+, Week 3: 1+ on the 3rd set. Week 4 is a deload (no +).</li>
                            <li>Standard increments per cycle: <b>+5 lbs upper</b> (Press/Bench), <b>+10 lbs lower</b> (Squat/Deadlift).</li>
                            <li>When performance stalls, reset the TM (90% standard; 85% conservative).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Loading option & preview week */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div className="text-white font-medium mb-2">Loading Option</div>
                        <div className="flex gap-2">
                            {[1, 2].map(opt => {
                                const active = loading.option === opt;
                                return (
                                    <button
                                        key={opt}
                                        onClick={() => setLoadingOption(opt)}
                                        className={`px-3 py-1 rounded-md transition select-none outline-none ${active
                                            ? 'bg-red-600 text-white border-2 border-red-300 shadow-md ring-2 ring-red-400/70 ring-offset-1 ring-offset-gray-900'
                                            : 'bg-gray-900/40 text-red-200 border border-red-700/70 hover:border-red-500/70 hover:bg-red-900/20'}`}
                                    >
                                        {active ? <span className="mr-1">✓</span> : null}
                                        Option {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <div className="text-white font-medium mb-2">Preview Week</div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map(wk => {
                                const active = loading.previewWeek === wk;
                                return (
                                    <button
                                        key={wk}
                                        onClick={() => setPreviewWeek(wk)}
                                        className={`px-3 py-1 rounded-md transition select-none outline-none ${active
                                            ? 'bg-red-600 text-white border-2 border-red-300 shadow-md ring-2 ring-red-400/70 ring-offset-1 ring-offset-gray-900'
                                            : 'bg-gray-900/40 text-red-200 border border-red-700/70 hover:border-red-500/70 hover:bg-red-900/20'}`}
                                    >
                                        {active ? <span className="mr-1">✓</span> : null}
                                        Week {wk}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Week 4 is deload (no AMRAP).</p>
                    </div>

                    <div>
                        <div className="text-white font-medium mb-2">Rounding</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-gray-300">Increment</label>
                                <input type="number" min="1" step="0.5" value={rounding.increment ?? 5} onChange={e => setRounding({ increment: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Mode</label>
                                <select value={rounding.mode ?? 'nearest'} onChange={e => setRounding({ mode: e.target.value })} className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1">
                                    <option value="nearest">Nearest</option>
                                    <option value="floor">Floor</option>
                                    <option value="ceiling">Ceiling</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Percent table for current option */}
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-200 border border-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-3 py-2 text-left">Week</th>
                                <th className="px-3 py-2 text-left">Set 1</th>
                                <th className="px-3 py-2 text-left">Set 2</th>
                                <th className="px-3 py-2 text-left">Set 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map(wk => (
                                <tr key={wk} className="border-t border-gray-700">
                                    <td className="px-3 py-2">Week {wk}</td>
                                    {LOADING_OPTIONS[String(loading.option)][String(wk)].map((pct, i) => (
                                        <td key={i} className="px-3 py-2">{pct}%{(wk < 4 && i === 2) ? '+' : ''}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TM increments & resets */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">TM Progression & Resets</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 border border-gray-700 rounded p-3">
                        <div className="text-gray-200 font-medium mb-2">Cycle Increments</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-gray-300">Upper (+lbs)</label>
                                <input type="number" min="1" step="1" value={increments.upper ?? 5} onChange={e => setIncrements({ upper: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Lower (+lbs)</label>
                                <input type="number" min="1" step="1" value={increments.lower ?? 10} onChange={e => setIncrements({ lower: Number(e.target.value) })} className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1" />
                            </div>
                        </div>
                        <button onClick={applyCycleIncrements} className="mt-3 inline-flex items-center gap-2 px-3 py-1 border border-gray-500 rounded hover:bg-gray-700/40 text-gray-100">
                            <TrendingUp className="w-4 h-4" /> Apply increments to all TMs
                        </button>
                        <p className="text-xs text-gray-400 mt-2">Adds +Upper to Press/Bench; +Lower to Squat/Deadlift. Respects rounding.</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded p-3 md:col-span-2">
                        <div className="text-gray-200 font-medium mb-2">Reset a Lift</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {['press', 'bench', 'deadlift', 'squat'].map(liftKey => (
                                <div key={liftKey} className="bg-gray-900/50 border border-gray-700 rounded p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-gray-200 capitalize">{liftKey}</div>
                                        <div className="text-xs text-gray-400">TM: {Number.isFinite(Number(lifts?.[liftKey]?.tm)) ? lifts[liftKey].tm : '-'}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => doReset(liftKey, 'standard')} className="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white" title="Reset to 90% of current TM (ceiling to increment)">90% Reset</button>
                                        <button onClick={() => doReset(liftKey, 'conservative')} className="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white" title="Reset to 85% of current TM (ceiling to increment)">85% Reset</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Use resets when AMRAPs are consistently at minimums or reps are missed.</p>
                    </div>
                </div>
            </div>

            {/* PR calculator */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">e1RM / PR Calculator (uses Week {loading.previewWeek} last set)</div>
                    <Award className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-sm text-gray-300">Lift</label>
                        <select value={prCalc.lift} onChange={e => setPrCalc(p => ({ ...p, lift: e.target.value }))} className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1">
                            <option value="press">Overhead Press</option>
                            <option value="bench">Bench Press</option>
                            <option value="deadlift">Deadlift</option>
                            <option value="squat">Squat</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Reps on + set</label>
                        <input type="number" min="1" step="1" value={prCalc.reps} onChange={e => setPrCalc(p => ({ ...p, reps: Number(e.target.value) }))} className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1" />
                    </div>
                    <div className="md:col-span-2">
                        <div className="text-xs text-gray-400 mb-1">Computed</div>
                        <div className="bg-gray-800/50 border border-gray-700 rounded p-2 text-gray-200">
                            Weight on + set: <span className="font-mono">{Math.round((calcMainSets(Number(lifts?.[prCalc.lift]?.tm) || 0, loading.option, loading.previewWeek, rounding)[2]?.weight) || 0)}</span> ·
                            e1RM: <span className="font-mono">{Math.round(calcE1RM(calcMainSets(Number(lifts?.[prCalc.lift]?.tm) || 0, loading.option, loading.previewWeek, rounding)[2]?.weight || 0, prCalc.reps) || 0)}</span> ·
                            Best: <span className="font-mono">{Math.round((prs?.[prCalc.lift]?.bestE1RM) || 0)}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                    {prCalcResult.isPR ? (
                        <div className="inline-flex items-center gap-2 text-green-300 text-sm">
                            <CheckCircle className="w-4 h-4" /> New PR detected — save it.
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 text-gray-300 text-sm">
                            <Calculator className="w-4 h-4" /> Enter reps to evaluate e1RM vs best.
                        </div>
                    )}
                    <button onClick={() => savePR(prCalc.lift, Math.round(prCalcResult.e1rm))} className={`px-3 py-1 rounded border ${prCalcResult.isPR ? 'border-green-500 text-green-200 hover:bg-green-900/20' : 'border-gray-600 text-gray-200 hover:bg-gray-700/40'}`}>
                        Save as PR
                    </button>
                </div>
            </div>
        </div>
    );
}
