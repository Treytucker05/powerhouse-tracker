// src/components/program/steps/Step7AdvancedCustomization.jsx
import React, { useMemo } from 'react';
import { Info, CheckCircle, Sliders, Target, Trophy, Printer } from 'lucide-react';
import StepStatusPill from './_shared/StepStatusPill.jsx';
import { STEP_IDS } from './_registry/stepRegistry.js';
import { DEFAULT_AUTOREG, recommendTMIncrements } from '../../../lib/fiveThreeOne/autoRegulation.js';
import { getPRs } from '../../../lib/fiveThreeOne/prTracking.js';
import PrintableWeek from '../printable/PrintableWeek.jsx';

const LIFTS = [
    { key: 'press', label: 'Overhead Press', type: 'upper' },
    { key: 'bench', label: 'Bench Press', type: 'upper' },
    { key: 'squat', label: 'Squat', type: 'lower' },
    { key: 'deadlift', label: 'Deadlift', type: 'lower' }
];

export default function Step7AdvancedCustomization({ data, updateData }) {
    const st = data || {};
    const set = (patch) => updateData({ ...st, ...patch });

    // advanced state init
    const adv = st.advanced || {};
    const autoreg = { ...DEFAULT_AUTOREG, ...(adv.autoreg || {}) };
    const spec = adv.specialization || { focus: [], volumeBiasPct: 15 };

    const prsLocal = getPRs() || {};
    const hist = adv?.history || {}; // optional arrays of e1RM by cycle

    const tmIncs = useMemo(() => {
        return recommendTMIncrements(
            {
                bench: hist.bench || [],
                press: hist.press || [],
                squat: hist.squat || [],
                deadlift: hist.deadlift || []
            },
            { upper: 5, lower: 10 },
            autoreg
        );
    }, [hist, autoreg]);

    const toggleFocus = (k) => {
        const arr = new Set(spec.focus || []);
        if (arr.has(k)) arr.delete(k); else arr.add(k);
        set({ advanced: { ...adv, specialization: { ...spec, focus: Array.from(arr) } } });
    };

    const setAutoreg = (patch) => {
        set({ advanced: { ...adv, autoreg: { ...autoreg, ...patch } } });
    };

    const setSpec = (patch) => {
        set({ advanced: { ...adv, specialization: { ...spec, ...patch } } });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Step 7: Advanced Customization</h3>
                    <p className="text-gray-400 text-sm">
                        Dial in auto‑regulation, specialization emphasis, track PRs, and generate printable week sheets.
                    </p>
                </div>
                <StepStatusPill stepId={STEP_IDS.ADVANCED_CUSTOMIZATION} data={st} />
            </div>

            {/* Info box */}
            <div className="bg-blue-900/20 border border-blue-600 rounded p-4">
                <div className="flex gap-3 items-start">
                    <Info className="w-5 h-5 text-blue-300 mt-0.5" />
                    <div className="text-blue-100 text-sm">
                        <div className="font-medium mb-1">Philosophy</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>5/3/1 progresses best when you start light and add small, consistent jumps.</li>
                            <li>Use RPE caps to keep AMRAPs productive (avoid grinders).</li>
                            <li>Specialize only when needed; don’t wreck recovery.</li>
                            <li>Track rep PRs / e1RMs to validate progress; adjust TMs conservatively.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Auto‑regulation */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-4">
                <div className="flex items-center gap-2 text-white font-medium">
                    <Sliders className="w-5 h-5" /> Auto‑Regulation
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm text-gray-300">AMRAP Cap (RPE)</label>
                        <input
                            type="number" min="8" max="10" step="0.5"
                            value={autoreg.amrapCapRPE}
                            onChange={e => setAutoreg({ amrapCapRPE: Number(e.target.value) })}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-400 mt-1">Stop '+' sets around this RPE.</div>
                    </div>
                    <div className="flex items-end">
                        <label className="inline-flex items-center gap-2 text-gray-200">
                            <input
                                type="checkbox"
                                checked={!!autoreg.holdTMIfE1RMDrops}
                                onChange={e => setAutoreg({ holdTMIfE1RMDrops: !!e.target.checked })}
                            />
                            Hold TM increment if e1RM drops
                        </label>
                    </div>
                    <div>
                        <label className="text-sm text-gray-300">Hold Threshold (%)</label>
                        <input
                            type="number" min="1" max="5" step="0.5"
                            value={autoreg.holdThresholdPct}
                            onChange={e => setAutoreg({ holdThresholdPct: Number(e.target.value) })}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="inline-flex items-center gap-2 text-gray-200">
                            <input
                                type="checkbox"
                                checked={!!autoreg.allowHalfIncrementsOnStall}
                                onChange={e => setAutoreg({ allowHalfIncrementsOnStall: !!e.target.checked })}
                            />
                            Use half increments on stalls
                        </label>
                    </div>
                </div>
                <div className="text-xs text-gray-400">
                    Note: This only affects <b>recommended</b> TM changes at cycle rollover. We still apply +5/+10 by default.
                </div>
            </div>

            {/* Specialization */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-4">
                <div className="flex items-center gap-2 text-white font-medium">
                    <Target className="w-5 h-5" /> Specialization Focus
                </div>
                <div className="text-sm text-gray-300">Pick lifts to receive slight assistance volume bias.</div>
                <div className="flex flex-wrap gap-2">
                    {LIFTS.map(l => (
                        <button
                            key={l.key}
                            onClick={() => toggleFocus(l.key)}
                            className={`px-3 py-1 rounded border ${spec.focus?.includes(l.key) ? 'border-red-500 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700/40'}`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm text-gray-300">Volume Bias (%)</label>
                        <input
                            type="number" min="0" max="25" step="1"
                            value={spec.volumeBiasPct}
                            onChange={e => setSpec({ volumeBiasPct: Number(e.target.value) })}
                            className="w-full bg-gray-800 border border-gray-600 text-white rounded px-2 py-1"
                        />
                        <div className="text-xs text-gray-400 mt-1">Applied to assistance selection later.</div>
                    </div>
                    <div className="md:col-span-2 text-xs text-gray-400">
                        Keep bias small (≤15%) to avoid recovery issues.
                    </div>
                </div>
            </div>

            {/* PR status & TM increment suggestions */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-medium">
                    <Trophy className="w-5 h-5" /> PRs & Next Cycle TM Suggestions
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-[520px] text-sm">
                        <thead className="text-gray-400">
                            <tr>
                                <th className="text-left pr-4">Lift</th>
                                <th className="text-left pr-4">Best e1RM</th>
                                <th className="text-left pr-4">Last Cycle e1RM</th>
                                <th className="text-left pr-4">Suggested TM +</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LIFTS.map(l => {
                                const pr = prsLocal[l.key]?.e1RM ? `${Number(prsLocal[l.key].e1RM).toFixed(1)} lb` : '—';
                                const last = Array.isArray(hist[l.key]) && hist[l.key].length ? `${Number(hist[l.key][hist[l.key].length - 1]).toFixed(1)} lb` : '—';
                                const inc = tmIncs?.[l.key] ?? (l.type === 'upper' ? 5 : 10);
                                return (
                                    <tr key={l.key} className="text-gray-200">
                                        <td className="pr-4">{l.label}</td>
                                        <td className="pr-4">{pr}</td>
                                        <td className="pr-4">{last}</td>
                                        <td className="pr-4">+{inc} lb</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="text-xs text-gray-400">
                    PRs update automatically when logged in the app. If no history is present yet, suggestions default to +5 (upper) / +10 (lower).
                </div>
            </div>

            {/* Printable Week Sheet */}
            <div className="bg-gray-900/60 border border-gray-700 rounded p-4 space-y-3">
                <div className="flex items-center gap-2 text-white font-medium">
                    <Printer className="w-5 h-5" /> Printable Week Sheet
                </div>
                <div className="text-sm text-gray-300">Preview and print a clean week sheet with warm-ups and main sets.</div>
                <div className="bg-gray-800/50 border border-gray-700 rounded p-2">
                    <PrintableWeek state={st} />
                </div>
            </div>

            {/* Completion */}
            <div className="bg-green-900/20 border border-green-500 rounded p-3 text-green-200 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Advanced settings saved. TM suggestions will appear at cycle rollover.
            </div>
        </div>
    );
}
