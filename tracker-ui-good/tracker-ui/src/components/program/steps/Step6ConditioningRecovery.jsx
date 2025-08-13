import React from 'react';
import { Info, AlertTriangle, RefreshCcw, CheckCircle } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { CONDITIONING_GUIDELINES, CONDITIONING_PLACEMENT, MODALITIES, DAYS } from '../../../lib/fiveThreeOne/conditioningLibrary.js';
import { buildConditioningPlan, deriveLiftDayMap } from '../../../lib/fiveThreeOne/conditioningPlanner.js';

export default function Step6ConditioningRecovery({ data, updateData }) {
    const st = data || {};
    const set = (patch) => updateData({ ...st, ...patch });
    const cond = st?.conditioning || { options: {}, weeklyPlan: [] };

    const opts = cond.options || {};
    const freq = Number(opts.frequency ?? 2);
    const hiitPerWeek = Number(opts.hiitPerWeek ?? Math.min(2, freq));
    const lissPerWeek = Math.max(0, freq - hiitPerWeek);
    const placement = opts.placement || CONDITIONING_PLACEMENT.AFTER_LIFTS;

    const liftMap = deriveLiftDayMap(st);

    const regenerate = () => {
        const weeklyPlan = buildConditioningPlan(st, cond.options);
        set({ conditioning: { ...cond, weeklyPlan } });
    };

    const updateOptions = (patch) => {
        const next = { ...cond, options: { ...opts, ...patch } };
        const weeklyPlan = buildConditioningPlan(st, next.options);
        set({ conditioning: { ...next, weeklyPlan } });
    };

    const toggleMod = (key, listKey) => {
        const list = Array.from(opts[listKey] || []);
        const idx = list.indexOf(key);
        if (idx >= 0) list.splice(idx, 1); else list.push(key);
        updateOptions({ [listKey]: list });
    };

    const warnTooLow = freq < (CONDITIONING_GUIDELINES.minSessionsPerWeek || 2);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 6: Conditioning & Recovery</h3>
                    <p className="text-gray-400 text-sm">Schedule prowler/hill sprints and easy conditioning without hurting your main lift performance.</p>
                </div>
                <StepStatusPill stepId={STEP_IDS.CONDITIONING_RECOVERY} data={st} />
            </div>

            {/* Info box */}
            <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Guidelines</div>
                        <ul className="list-disc ml-5 space-y-1">
                            {CONDITIONING_GUIDELINES.notes.map((n, i) => <li key={i}>{n}</li>)}
                        </ul>
                    </div>
                </div>
            </div>

            {warnTooLow && (
                <div className="bg-yellow-900/20 border border-yellow-600 rounded p-3 text-yellow-100 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Wendler recommends at least 2 conditioning sessions per week.
                </div>
            )}

            {/* Controls */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-sm text-gray-300">Total Sessions / Week</label>
                        <input
                            type="number" min="0" max="7" step="1"
                            value={freq}
                            onChange={e => {
                                const v = Number(e.target.value);
                                const hiit = Math.min(v, opts.hiitPerWeek ?? v);
                                updateOptions({ frequency: v, hiitPerWeek: hiit, lissPerWeek: Math.max(0, v - hiit) });
                            }}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">HIIT Sessions / Week</label>
                        <input
                            type="number" min="0" max={freq} step="1"
                            value={hiitPerWeek}
                            onChange={e => {
                                const hiit = Math.min(freq, Number(e.target.value));
                                updateOptions({ hiitPerWeek: hiit, lissPerWeek: Math.max(0, freq - hiit) });
                            }}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Placement</label>
                        <select
                            value={placement}
                            onChange={e => updateOptions({ placement: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        >
                            <option value={CONDITIONING_PLACEMENT.AFTER_LIFTS}>After Lifts</option>
                            <option value={CONDITIONING_PLACEMENT.OFF_DAYS}>Off Days</option>
                            <option value={CONDITIONING_PLACEMENT.MIXED}>Mixed</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={regenerate}
                            className="px-3 py-2 rounded border border-gray-600 hover:bg-gray-700/40 text-white inline-flex gap-2 items-center"
                            title="Rebuild weekly plan from options"
                        >
                            <RefreshCcw className="w-4 h-4" /> Auto-Generate Plan
                        </button>
                    </div>
                </div>

                {/* Modality picks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-3">
                        <div className="text-white font-medium mb-2">HIIT Modalities</div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(MODALITIES).filter(([, m]) => m.mode === 'hiit').map(([k, m]) => (
                                <button
                                    key={k}
                                    onClick={() => toggleMod(k, 'hiitModalities')}
                                    className={`px-2 py-1 rounded border ${opts.hiitModalities?.includes(k) ? 'border-red-500 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700/40'}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-800/60 border border-gray-700 rounded p-3">
                        <div className="text-white font-medium mb-2">LISS Modalities</div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(MODALITIES).filter(([, m]) => m.mode === 'liss').map(([k, m]) => (
                                <button
                                    key={k}
                                    onClick={() => toggleMod(k, 'lissModalities')}
                                    className={`px-2 py-1 rounded border ${opts.lissModalities?.includes(k) ? 'border-red-500 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700/40'}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recovery toggles */}
                <div className="bg-gray-800/60 border border-gray-700 rounded p-3">
                    <div className="text-white font-medium mb-2">Recovery Targets</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label className="text-sm text-gray-300">Mobility Minutes / Day</label>
                            <input
                                type="number" min="0" max="30" step="1"
                                value={opts?.recovery?.mobility_min_per_day ?? 10}
                                onChange={e => updateOptions({ recovery: { ...(opts.recovery || {}), mobility_min_per_day: Number(e.target.value) } })}
                                className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="inline-flex items-center gap-2 text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={!!opts?.recovery?.foam_roll}
                                    onChange={e => updateOptions({ recovery: { ...(opts.recovery || {}), foam_roll: !!e.target.checked } })}
                                />
                                Foam Roll (daily)
                            </label>
                        </div>
                        <div className="text-gray-400 text-sm flex items-end">
                            Target at least one rest day fully off.
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Plan editor */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4">
                <div className="text-white font-medium mb-3">Weekly Conditioning Plan</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DAYS.map(day => {
                        const session = (cond.weeklyPlan || []).find(s => s.day === day);
                        const lift = liftMap[day];

                        return (
                            <div key={day} className="bg-gray-800/60 border border-gray-700 rounded p-3">
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-200">{day}</div>
                                    <div className="text-xs text-gray-400">{lift ? `Lift: ${lift}` : 'Off'}</div>
                                </div>

                                {!session ? (
                                    <div className="text-gray-500 text-sm mt-2">No conditioning scheduled.</div>
                                ) : (
                                    <div className="mt-2 text-sm text-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">
                                                {session.mode.toUpperCase()} — {MODALITIES[session.modality]?.label || session.modality}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const next = { ...cond };
                                                    next.weeklyPlan = next.weeklyPlan.filter(s => s.day !== day);
                                                    set({ conditioning: next });
                                                }}
                                                className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white text-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="text-gray-300 mt-1">
                                            {Object.entries(session.prescription || {}).map(([k, v]) => <span key={k} className="mr-3">{k}:{String(v)}</span>)}
                                        </div>
                                        <div className="text-gray-400 mt-1">{session.notes}</div>
                                    </div>
                                )}

                                {/* Quick adders */}
                                {!session && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(opts.hiitModalities || []).slice(0, 2).map(k => (
                                            <button
                                                key={k}
                                                onClick={() => {
                                                    const mod = MODALITIES[k];
                                                    const next = { ...cond };
                                                    next.weeklyPlan = [
                                                        ...(next.weeklyPlan || []),
                                                        { day, mode: 'hiit', modality: k, prescription: { ...mod.default }, notes: lift ? `After ${lift} session` : 'Standalone session' }
                                                    ];
                                                    set({ conditioning: next });
                                                }}
                                                className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white text-xs"
                                            >
                                                + {MODALITIES[k]?.label || k}
                                            </button>
                                        ))}
                                        {(opts.lissModalities || []).slice(0, 2).map(k => (
                                            <button
                                                key={k}
                                                onClick={() => {
                                                    const mod = MODALITIES[k];
                                                    const next = { ...cond };
                                                    next.weeklyPlan = [
                                                        ...(next.weeklyPlan || []),
                                                        { day, mode: 'liss', modality: k, prescription: { ...mod.default }, notes: lift ? `After ${lift} session (easy)` : 'Standalone easy session' }
                                                    ];
                                                    set({ conditioning: next });
                                                }}
                                                className="px-2 py-1 rounded border border-gray-600 hover:bg-gray-700/40 text-white text-xs"
                                            >
                                                + {MODALITIES[k]?.label || k}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Completion */}
            <div className="bg-green-900/20 border border-green-500 rounded p-3 text-green-200 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Conditioning scheduled. You can refine prescriptions or days anytime.
            </div>
        </div>
    );
}
