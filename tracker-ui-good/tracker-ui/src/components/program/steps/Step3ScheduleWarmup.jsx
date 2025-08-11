import React from 'react';
import { Info, Plus, Trash2, RotateCcw } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { buildDaysByFrequency, resetToCanonical, liftOptions } from '../../../lib/fiveThreeOne/schedule.js';

export default function Step3ScheduleWarmup({ data, updateData }) {
    const st = data || {};
    const schedule = st.schedule || {};
    const warm = st.warmup || {};
    const set = (patch) => updateData({ ...st, ...patch });

    // Frequency handlers
    const setFrequency = (freq) => {
        const days = buildDaysByFrequency(freq);
        set({ schedule: { ...schedule, frequency: freq, days } });
    };

    const updateDayLift = (dayIndex, value) => {
        const days = [...(schedule.days || [])];
        days[dayIndex] = { ...days[dayIndex], lift: value };
        set({ schedule: { ...schedule, days } });
    };

    const removeDay = (dayIndex) => {
        const days = [...(schedule.days || [])];
        days.splice(dayIndex, 1);
        set({ schedule: { ...schedule, days } });
    };

    const addDay = () => {
        const nextId = `D${(schedule.days?.length || 0) + 1}`;
        set({ schedule: { ...schedule, days: [...(schedule.days || []), { id: nextId, lift: 'press' }] } });
    };

    const resetOrder = () => {
        set({ schedule: { ...schedule, days: resetToCanonical() } });
    };

    const setWarmPolicy = (policy) => {
        set({ warmup: { ...warm, policy } });
    };

    const updateCustomRow = (idx, field, value) => {
        const rows = [...(warm.custom || [])];
        rows[idx] = { ...rows[idx], [field]: field === 'pct' || field === 'reps' ? Number(value) : value };
        set({ warmup: { ...warm, custom: rows } });
    };

    const addCustomRow = () => {
        const rows = [...(warm.custom || [])];
        rows.push({ pct: 50, reps: 5 });
        set({ warmup: { ...warm, custom: rows } });
    };

    const removeCustomRow = (idx) => {
        const rows = [...(warm.custom || [])];
        rows.splice(idx, 1);
        set({ warmup: { ...warm, custom: rows } });
    };

    const setDeadliftStyle = (style) => {
        set({ warmup: { ...warm, deadliftRepStyle: style } });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 3: Training Schedule & Warm‑Up</h3>
                    <p className="text-gray-400 text-sm">Set weekly frequency and main-lift order. Then choose a warm‑up policy (default: 40/50/60 × 5/5/3 of TM).</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.SCHEDULE_WARMUP} data={st} />
            </div>

            {/* Info box */}
            <div className="bg-blue-900/20 border border-blue-600 p-4 rounded">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Guidance</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Canonical 4‑day order: <b>Press → Deadlift → Bench → Squat</b>.</li>
                            <li>3‑day schedules are “rolling”: the 4th lift appears next week (the builder handles this automatically).</li>
                            <li>Default warm‑up: <b>40/50/60% of TM for 5/5/3 reps</b> before the main sets.</li>
                            <li>Deadlift style: choose <b>Touch‑and‑Go</b> or <b>Dead‑Stop</b>.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Frequency */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Weekly Frequency</div>
                <div className="flex flex-wrap gap-2">
                    {['4day', '3day'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFrequency(f)}
                            className={`px-3 py-1 rounded border ${schedule.frequency === f ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600 hover:bg-gray-700/40'} text-white`}
                        >
                            {f === '4day' ? '4 Days / Week' : '3 Days / Week (Rolling)'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day editor */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-medium">Days & Main Lifts</div>
                    <div className="flex gap-2">
                        <button onClick={resetOrder} className="inline-flex items-center gap-2 px-3 py-1 border border-gray-500 rounded hover:bg-gray-700/40 text-gray-100">
                            <RotateCcw className="w-4 h-4" /> Reset to Canonical
                        </button>
                        <button onClick={addDay} className="inline-flex items-center gap-2 px-3 py-1 border border-gray-500 rounded hover:bg-gray-700/40 text-gray-100">
                            <Plus className="w-4 h-4" /> Add Day
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(schedule.days || []).map((d, idx) => (
                        <div key={d.id} className="bg-gray-800/50 border border-gray-700 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-gray-200 font-medium">Day {d.id}</div>
                                <button onClick={() => removeDay(idx)} className="text-gray-400 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <label className="text-sm text-gray-300 mb-1 block">Main Lift</label>
                            <select
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                value={d.lift || 'press'}
                                onChange={(e) => updateDayLift(idx, e.target.value)}
                            >
                                {liftOptions().map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Warm-up policy */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Warm‑Up Policy</div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {[
                        { id: 'standard', label: 'Standard (40/50/60 × 5/5/3)' },
                        { id: 'minimal', label: 'Minimal (50/60 × 5/3)' },
                        { id: 'custom', label: 'Custom' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setWarmPolicy(opt.id)}
                            className={`px-3 py-1 rounded border ${warm.policy === opt.id ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600 hover:bg-gray-700/40'} text-white`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {warm.policy === 'custom' && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded p-3">
                        <div className="text-gray-200 font-medium mb-2">Custom Warm‑Up Rows</div>
                        <div className="space-y-2">
                            {(warm.custom || []).map((row, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                                    <div>
                                        <label className="text-sm text-gray-300">Percent of TM</label>
                                        <input
                                            type="number" min="20" max="90" step="5"
                                            value={row.pct ?? 40}
                                            onChange={(e) => updateCustomRow(i, 'pct', e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300">Reps</label>
                                        <input
                                            type="number" min="1" max="10" step="1"
                                            value={row.reps ?? 5}
                                            onChange={(e) => updateCustomRow(i, 'reps', e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                                        />
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <button onClick={() => removeCustomRow(i)} className="text-gray-400 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addCustomRow} className="mt-2 inline-flex items-center gap-2 px-3 py-1 border border-gray-600 rounded hover:bg-gray-700/40 text-gray-100">
                                <Plus className="w-4 h-4" /> Add Row
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Deadlift rep style */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-2">Deadlift Rep Style</div>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'touch', label: 'Touch‑and‑Go' },
                        { id: 'deadstop', label: 'Dead‑Stop (reset each rep)' },
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setDeadliftStyle(opt.id)}
                            className={`px-3 py-1 rounded border ${warm.deadliftRepStyle === opt.id ? 'border-red-500 ring-2 ring-red-600' : 'border-gray-600 hover:bg-gray-700/40'} text-white`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
                <p className="text-gray-400 text-xs mt-2">Pick whichever lets you keep tightness and best technique. This will display as a cue on Deadlift days.</p>
            </div>
        </div>
    );
}
