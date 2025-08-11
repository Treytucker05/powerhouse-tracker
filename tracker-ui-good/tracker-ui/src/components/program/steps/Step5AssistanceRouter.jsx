// src/components/program/steps/Step5AssistanceRouter.jsx
import React, { useMemo } from 'react';
import { Info, AlertTriangle, RefreshCcw, Settings, CheckCircle } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry';
import { TEMPLATE_IDS } from '../../../lib/fiveThreeOne/assistanceLibrary.js';
import { buildAssistancePlan } from '../../../lib/fiveThreeOne/assistPlanner.js';
import { roundToIncrement } from '../../../lib/fiveThreeOne/compute531.js';

export default function Step5AssistanceRouter({ data, updateData }) {
    const st = data || {};
    const set = (patch) => updateData({ ...st, ...patch });

    const templateId = st?.template?.id || st?.template; // support either shape
    const lifts = st?.lifts || {};
    const rounding = st?.rounding || { increment: 5, mode: 'nearest' };

    const assistance = st?.assistance || {
        options: { bbb: { percent: 50, pairMode: 'same' }, bodyweight: { minRepsPerExercise: 75 } },
        perDay: { press: [], deadlift: [], bench: [], squat: [] }
    };

    const caps = st?.caps || { maxAssistanceSetsPerDay: 15, superset: true };

    const regenerate = () => {
        if (!templateId) return;
        const plan = buildAssistancePlan(templateId, assistance?.options, lifts);
        set({ assistance: { ...assistance, perDay: plan } });
    };

    const changeBBB = (patch) => {
        const next = { ...assistance, options: { ...assistance.options, bbb: { ...assistance.options.bbb, ...patch } } };
        const plan = templateId === TEMPLATE_IDS.BBB ? buildAssistancePlan(templateId, next.options, lifts) : assistance.perDay;
        set({ assistance: { ...next, perDay: plan } });
    };

    const totalSets = (items) => items.reduce((a, it) => a + (Number(it.sets) || 0), 0);

    const dayNames = { press: 'Press Day', deadlift: 'Deadlift Day', bench: 'Bench Day', squat: 'Squat Day' };

    const bbbPercent = Number(assistance?.options?.bbb?.percent ?? 50);
    const bbbPairMode = assistance?.options?.bbb?.pairMode ?? 'same';

    // UI helpers for BBB weight display
    const computeBBBWeight = (liftRef) => {
        const tm = Number(lifts?.[liftRef]?.tm);
        if (!Number.isFinite(tm)) return '-';
        const raw = tm * (bbbPercent / 100);
        return roundToIncrement(raw, rounding?.increment ?? 5, rounding?.mode ?? 'nearest');
    };

    const templateBadge = useMemo(() => {
        switch (templateId) {
            case TEMPLATE_IDS.BBB: return 'Boring But Big';
            case TEMPLATE_IDS.TRIUMVIRATE: return 'Triumvirate';
            case TEMPLATE_IDS.PERIODIZATION_BIBLE: return 'Periodization Bible';
            case TEMPLATE_IDS.BODYWEIGHT: return 'Bodyweight Only';
            case TEMPLATE_IDS.JACK_SHIT: return 'Main Lift Only';
            default: return 'No Template Selected';
        }
    }, [templateId]);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 5: Assistance Router</h3>
                    <p className="text-gray-400 text-sm">Template-driven assistance with smart defaults. Edit per day as needed.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.ASSISTANCE_ROUTER} data={st} />
            </div>

            {!templateId && (
                <div className="bg-yellow-900/20 border border-yellow-600 rounded p-4">
                    <div className="flex gap-2 items-start">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-100 text-sm">
                            Select a template in <b>Step 2: Template Selection</b> to enable assistance planning.
                        </div>
                    </div>
                </div>
            )}

            {/* Info box */}
            <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Guidelines</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Assistance supports — not replaces — the main lift PRs.</li>
                            <li>BBB: 5×10 at 50–70% of TM; pair with same or opposite lift.</li>
                            <li>Triumvirate: exactly two accessories (5 sets each) after the main lift.</li>
                            <li>Periodization Bible: 3 categories × 5 sets of 10–20 reps.</li>
                            <li>Bodyweight: 2–4 movements, target ≥75 total reps per movement.</li>
                            <li>Jack Shit: no assistance (valid if time/recovery limited).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Template header */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="flex items-center justify-between">
                    <div className="text-white font-medium">Current Template: <span className="text-red-400">{templateBadge}</span></div>
                    <button
                        onClick={regenerate}
                        disabled={!templateId}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded border ${templateId ? 'border-gray-600 hover:bg-gray-700/40 text-white' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}
                        title="Rebuild assistance from template defaults"
                    >
                        <RefreshCcw className="w-4 h-4" /> Auto-Generate
                    </button>
                </div>

                {/* Template-specific controls (BBB only for now) */}
                {templateId === TEMPLATE_IDS.BBB && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm text-gray-300">BBB % of TM</label>
                            <select
                                value={bbbPercent}
                                onChange={e => changeBBB({ percent: Number(e.target.value) })}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                            >
                                {[50, 60, 70].map(p =>
                                    <option key={p} value={p}>{p}%</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">Pairing</label>
                            <select
                                value={bbbPairMode}
                                onChange={e => changeBBB({ pairMode: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                            >
                                <option value="same">Same Lift</option>
                                <option value="opposite">Opposite Lift</option>
                            </select>
                        </div>
                        <div className="text-sm text-gray-400 flex items-end">Weights are rounded using your Step 4 rounding rules.</div>
                    </div>
                )}
            </div>

            {/* Per-day editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['press', 'deadlift', 'bench', 'squat'].map(day => {
                    const items = assistance?.perDay?.[day] || [];
                    const setCount = totalSets(items);
                    const overCap = caps?.maxAssistanceSetsPerDay && setCount > caps.maxAssistanceSetsPerDay;

                    return (
                        <div key={day} className="bg-gray-900/60 border border-gray-700 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-white font-medium">{dayNames[day]}</div>
                                <div className="text-xs text-gray-400">{setCount} sets total</div>
                            </div>

                            {!items.length && (
                                <div className="text-gray-500 text-sm">No assistance on this day.</div>
                            )}

                            {!!items.length && (
                                <ul className="space-y-2">
                                    {items.map((it, idx) => (
                                        <li key={idx} className="bg-gray-800/50 border border-gray-700 rounded p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-gray-200 font-medium">{it.name}</div>
                                                <div className="text-gray-300 text-sm">
                                                    {it.sets}×{it.reps}
                                                    {it?.load?.type === 'percentTM' && (
                                                        <span className="ml-2 text-gray-400">
                                                            @ {it.load.value}% TM
                                                            {Number.isFinite(Number(lifts?.[it.load.liftRef]?.tm)) && (
                                                                <> → <span className="font-mono">
                                                                    {(() => {
                                                                        const tm = Number(lifts[it.load.liftRef].tm);
                                                                        const raw = tm * (Number(it.load.value) / 100);
                                                                        return roundToIncrement(raw, rounding?.increment ?? 5, rounding?.mode ?? 'nearest');
                                                                    })()}
                                                                </span></>
                                                            )}
                                                        </span>
                                                    )}
                                                    {it?.load?.type === 'bw' && <span className="ml-2 text-gray-400">@ BW</span>}
                                                </div>
                                            </div>
                                            {/* Editable minimal controls (sets/reps) */}
                                            <div className="mt-2 grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="text-xs text-gray-400">Sets</label>
                                                    <input
                                                        type="number" min="1" step="1"
                                                        value={it.sets}
                                                        onChange={e => {
                                                            const next = { ...assistance };
                                                            next.perDay[day][idx].sets = Number(e.target.value);
                                                            set({ assistance: next });
                                                        }}
                                                        className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400">Reps</label>
                                                    <input
                                                        type="number" min="1" step="1"
                                                        value={it.reps}
                                                        onChange={e => {
                                                            const next = { ...assistance };
                                                            next.perDay[day][idx].reps = Number(e.target.value);
                                                            set({ assistance: next });
                                                        }}
                                                        className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                                    />
                                                </div>
                                                <div className="flex items-end justify-end">
                                                    <button
                                                        onClick={() => {
                                                            const next = { ...assistance };
                                                            next.perDay[day] = next.perDay[day].filter((_, i) => i !== idx);
                                                            set({ assistance: next });
                                                        }}
                                                        className="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {overCap && (
                                <div className="mt-2 bg-yellow-900/20 border border-yellow-600 rounded p-2 text-yellow-100 text-xs flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Over soft cap ({caps.maxAssistanceSetsPerDay} sets).
                                </div>
                            )}

                            {/* Add quick bodyweight or simple item */}
                            <div className="mt-3">
                                <button
                                    onClick={() => {
                                        const next = { ...assistance };
                                        const newItem = { name: 'Chin-Ups', sets: 5, reps: 10, load: { type: 'bw' } };
                                        next.perDay[day] = [...(next.perDay[day] || []), newItem];
                                        set({ assistance: next });
                                    }}
                                    className="px-3 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white"
                                >
                                    + Add Chin-Ups (5×10)
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Global caps & superset */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Session Options</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label className="text-sm text-gray-300">Soft Cap: Max Assistance Sets/Day</label>
                        <input
                            type="number" min="5" step="1"
                            value={caps?.maxAssistanceSetsPerDay ?? 15}
                            onChange={e => set({ caps: { ...caps, maxAssistanceSetsPerDay: Number(e.target.value) } })}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="inline-flex items-center gap-2 text-gray-200">
                            <input
                                type="checkbox"
                                checked={!!caps?.superset}
                                onChange={e => set({ caps: { ...caps, superset: !!e.target.checked } })}
                            />
                            Superset assistance where possible
                        </label>
                    </div>
                    <div className="text-gray-400 text-sm flex items-end"><Settings className="w-4 h-4 mr-2" /> Applies to preview and printouts.</div>
                </div>
            </div>

            {/* Completion */}
            <div className="bg-green-900/20 border border-green-500 rounded p-3 text-green-200 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Assistance configured. You can refine sets/reps anytime.
            </div>
        </div>
    );
}
