// src/components/program/steps/Step5AssistanceRouter.jsx
import React, { useMemo } from 'react';
import { Wand2, Trash2, Plus, RefreshCw, Info } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { buildWeekAssistancePlan, DEFAULT_ASSISTANCE_LIB } from '../../../lib/fiveThreeOne/assistanceRules.js';

export default function Step5AssistanceRouter({ data, updateData }) {
    const st = data || {};
    const schedule = st?.schedule?.days?.length ? st.schedule.days : [{ id: 'D1', lift: 'press' }, { id: 'D2', lift: 'deadlift' }, { id: 'D3', lift: 'bench' }, { id: 'D4', lift: 'squat' }];
    const plan = st?.assistancePlan?.byDay || {};

    const recommendedPlan = useMemo(() => buildWeekAssistancePlan(st), [st]);

    const applyAll = () => {
        updateData({ ...st, assistancePlan: recommendedPlan });
    };

    const clearAll = () => {
        if (!window.confirm('Clear all assistance selections?')) return;
        updateData({ ...st, assistancePlan: { byDay: {} } });
    };

    const setDayPlan = (dayId, payload) => {
        const byDay = { ...(st.assistancePlan?.byDay || {}) };
        byDay[dayId] = { ...(byDay[dayId] || {}), ...payload };
        updateData({ ...st, assistancePlan: { byDay } });
    };

    const addAccessory = (dayId, name) => {
        const existing = plan[dayId]?.plan?.accessories || [];
        const next = [...existing, { name, sets: 3, reps: 12 }];
        const payload = { plan: { ...(plan[dayId]?.plan || {}), accessories: next } };
        setDayPlan(dayId, payload);
    };

    const removeItem = (dayId, idx, scope = 'accessories') => {
        const cur = plan[dayId]?.plan?.[scope] || [];
        const next = cur.filter((_, i) => i !== idx);
        const payload = { plan: { ...(plan[dayId]?.plan || {}), [scope]: next } };
        setDayPlan(dayId, payload);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 5: Assistance Plan</h3>
                    <p className="text-gray-400 text-sm">Review template‑based recommendations for each day. Accept as‑is or customize.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.ASSISTANCE_ROUTER} data={st} />
            </div>

            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Principles</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Main lift drives the day; assistance never interferes with 5/3/1 performance.</li>
                            <li>BBB: 5×10 @ chosen % of TM. Triumvirate: exactly 2 accessories, 5 sets each. PB: 3 categories. Bodyweight: ≥ target reps each.</li>
                            <li>Start a little light; progress reps/loads only when quality is high and recovery is good.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap gap-2">
                <button onClick={applyAll} className="inline-flex items-center gap-2 px-3 py-1 border border-red-500 rounded hover:bg-red-600/10">
                    <Wand2 className="w-4 h-4" /> Accept Recommended For All Days
                </button>
                <button onClick={clearAll} className="inline-flex items-center gap-2 px-3 py-1 border border-gray-500 rounded hover:bg-gray-600/10">
                    <RefreshCw className="w-4 h-4" /> Clear All
                </button>
            </div>

            {/* Per-day editors */}
            <div className="space-y-4">
                {schedule.map((d) => {
                    const rec = recommendedPlan.byDay[d.id]?.plan;
                    const cur = plan[d.id]?.plan;

                    return (
                        <div key={d.id} className="bg-gray-900/60 border border-gray-700 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-white font-medium">Day {d.id}: {d.lift.toUpperCase()}</div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDayPlan(d.id, { mainLift: d.lift, plan: rec })}
                                        className="text-sm inline-flex items-center gap-2 px-3 py-1 border border-blue-500 rounded hover:bg-blue-600/10"
                                    >
                                        <Wand2 className="w-4 h-4" /> Accept Recommendation
                                    </button>
                                    <button
                                        onClick={() => setDayPlan(d.id, { mainLift: d.lift, plan: null })}
                                        className="text-sm inline-flex items-center gap-2 px-3 py-1 border border-gray-500 rounded hover:bg-gray-600/10"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Clear
                                    </button>
                                </div>
                            </div>

                            {/* Recommended preview */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {/* Recommendation */}
                                <div className="bg-gray-800/40 border border-gray-700 rounded p-3">
                                    <div className="text-gray-300 text-sm mb-2">Recommended</div>
                                    {rec ? <PlanBlock plan={rec} /> : <div className="text-gray-500 text-sm">No recommendation.</div>}
                                </div>
                                {/* Current selection */}
                                <div className="bg-gray-800/40 border border-gray-700 rounded p-3">
                                    <div className="text-gray-300 text-sm mb-2">Your Selection</div>
                                    {cur ? (
                                        <>
                                            <PlanBlock plan={cur} onRemove={(scope, idx) => removeItem(d.id, idx, scope)} />
                                            {/* Quick add accessory */}
                                            <div className="mt-3">
                                                <label className="text-sm text-gray-300">Add accessory</label>
                                                <div className="flex gap-2 mt-1">
                                                    <select
                                                        className="bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                                        onChange={(e) => e.target.value && addAccessory(d.id, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Select from library…</option>
                                                        {Object.entries(DEFAULT_ASSISTANCE_LIB.shared).map(([cat, arr]) => (
                                                            <optgroup key={cat} label={cat}>
                                                                {arr.map(name => <option key={name} value={name}>{name}</option>)}
                                                            </optgroup>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => addAccessory(d.id, 'Face Pull')}
                                                        className="inline-flex items-center gap-2 px-3 py-1 border border-gray-600 rounded hover:bg-gray-600/10"
                                                    >
                                                        <Plus className="w-4 h-4" /> Quick Add Face Pull
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-500 text-sm">No selection yet. Accept the recommendation or add items.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PlanBlock({ plan, onRemove }) {
    const blocks = plan?.blocks || [];
    const accessories = plan?.accessories || [];

    return (
        <div className="space-y-2">
            {blocks.map((b, bi) => (
                <div key={bi} className="bg-gray-900/50 border border-gray-700 rounded p-2">
                    <div className="text-white font-medium mb-1">
                        {b.type ? b.type : (b.category ? b.category : 'Block')}
                    </div>
                    <ul className="text-sm text-gray-200 space-y-1">
                        {(b.items || []).map((it, ii) => (
                            <li key={ii} className="flex items-center justify-between gap-2">
                                <span>
                                    {it.name} {it.sets ? `— ${it.sets}×${it.reps}` : (it.targetReps ? `— ≥${it.targetReps} total reps` : '')}
                                    {it.percentTM ? ` @ ${it.percentTM}% TM` : ''}
                                </span>
                                {onRemove && (
                                    <button onClick={() => onRemove('blocks', bi)} className="text-gray-400 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {accessories.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-700 rounded p-2">
                    <div className="text-white font-medium mb-1">Accessories</div>
                    <ul className="text-sm text-gray-200 space-y-1">
                        {accessories.map((it, i) => (
                            <li key={i} className="flex items-center justify-between gap-2">
                                <span>{it.name} — {it.sets}×{it.reps}</span>
                                {onRemove && (
                                    <button onClick={() => onRemove('accessories', i)} className="text-gray-400 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {blocks.length === 0 && accessories.length === 0 && (
                <div className="text-gray-500 text-sm">Empty.</div>
            )}
        </div>
    );
}
