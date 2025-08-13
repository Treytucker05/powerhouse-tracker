import React, { useMemo } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { normalizeAssistance } from '../assistance/index.js'; // unified assistance source
// Use local 531 barrel (one directory up) for engine helpers
import { buildWarmupSets, buildMainSetsForLift, roundToIncrement } from '../';

/**
 * Reusable full-screen (mobile) / centered (desktop) modal explaining a 5/3/1 template.
 * Props:
 *  - spec: template spec object (name, blurb, structure, time, recovery, assistanceHint)
 *  - state: program state (for TMs & units when building example)
 *  - open: boolean
 *  - onClose: fn
 *  - onApply: optional fn (if provided, shows "Use This Template" button)
 */
export default function TemplateExplainerModal({ spec, state, open, onClose, onApply }) {
    const units = state?.units === 'kg' ? 'kg' : 'lbs';
    const roundingMode = typeof state?.rounding === 'string' ? state?.rounding : (state?.rounding?.mode || 'nearest');
    const roundingIncrement = typeof state?.rounding === 'object' ? (state?.rounding.increment || 5) : (units === 'kg' ? 2.5 : 5);

    // Pick an example lift (prefer Bench, else Squat) for the illustrative day
    const exampleLift = 'Bench';
    const tmBench = state?.lifts?.bench?.tm || 0;
    const warmupScheme = state?.schedule?.warmupScheme || { percentages: [40, 50, 60], reps: [5, 5, 3] };
    const includeWarmups = state?.schedule?.includeWarmups !== false;
    const loadingOption = state?.loadingOption || state?.loading?.option || 1;

    const weekIndex = 0; // Week 1 example
    const warmups = useMemo(() => includeWarmups ? buildWarmupSets({ includeWarmups: true, warmupScheme, tm: tmBench, roundingIncrement, roundingMode, units }) : [], [includeWarmups, warmupScheme, tmBench, roundingIncrement, roundingMode, units]);
    const main = useMemo(() => buildMainSetsForLift({ tm: tmBench, weekIndex, option: loadingOption, roundingIncrement, roundingMode, units }).sets, [tmBench, weekIndex, loadingOption, roundingIncrement, roundingMode, units]);

    // Default assistance preview: show per main lift canonical picks (press/bench/deadlift/squat) collapsed
    const assistancePreview = useMemo(() => {
        if (!spec) return [];
        const lifts = ['Press', 'Deadlift', 'Bench', 'Squat'];
        return lifts.map(l => ({ lift: l, items: normalizeAssistance(spec.key, l, state) }));
    }, [spec, spec?.key, state]);

    if (!open || !spec) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto py-8 px-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-gray-900/95 border border-indigo-500/40 rounded-xl shadow-2xl p-6 space-y-6">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300" aria-label="Close template explainer"><X className="w-5 h-5" /></button>
                <header>
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <span>{spec?.name || 'Template'}</span>
                        {onApply && <span className="px-2 py-0.5 rounded bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-[10px] uppercase tracking-wide">Template</span>}
                    </h2>
                    <p className="text-sm text-indigo-200 mt-2 leading-snug">{spec?.blurb}</p>
                </header>

                <section className="grid md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-gray-800/60 rounded p-3">
                        <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Session Time</div>
                        <div className="text-gray-200">{spec?.time}</div>
                    </div>
                    <div className="bg-gray-800/60 rounded p-3 md:col-span-2">
                        <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Recovery</div>
                        <div className="text-gray-300 leading-snug text-[11px]">{spec?.recovery}</div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Structure</h3>
                    <ul className="list-disc list-inside text-[11px] text-gray-300 space-y-0.5">
                        {spec?.structure?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </section>

                {spec.assistanceHint && (
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Assistance Guidance</h3>
                        <p className="text-[11px] text-gray-300 leading-snug">{spec.assistanceHint.intent}</p>
                        {spec.assistanceHint.examples && Object.keys(spec.assistanceHint.examples).length > 0 && (
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(spec.assistanceHint.examples).map(([lift, arr]) => (
                                    <div key={lift} className="bg-gray-800/50 rounded p-2">
                                        <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">{lift}</div>
                                        <ul className="text-[11px] text-gray-300 space-y-0.5">
                                            {arr.map((ex, i) => <li key={i}>{ex}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Default Assistance (Preview)</h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {assistancePreview.map(ap => (
                            <div key={ap.lift} className="bg-gray-800/50 rounded p-2">
                                <div className="text-[10px] uppercase tracking-wide text-indigo-300 mb-1">{ap.lift}</div>
                                {ap.items.length > 0 ? (
                                    <ul className="text-[11px] text-gray-300 space-y-0.5">
                                        {ap.items.map((it, i) => <li key={i}>{it.block ? (<span className="text-gray-400">{it.block}: </span>) : null}{it.name} {it.sets}x{it.reps}</li>)}
                                    </ul>
                                ) : <div className="text-[11px] text-gray-500">None</div>}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Example Day (Week 1 – {exampleLift})</h3>
                    <div className="overflow-x-auto text-[11px]">
                        <table className="min-w-full text-left border-separate border-spacing-y-1">
                            <thead>
                                <tr className="text-gray-500">
                                    <th className="pr-4 font-medium">Block</th>
                                    <th className="pr-4 font-medium">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {includeWarmups && warmups.map((w, i) => (
                                    <tr key={i}>
                                        <td className="pr-4 text-gray-400">Warm-up</td>
                                        <td className="pr-4 font-mono">{w.percent}% x {w.reps} @ {w.weight}{units}</td>
                                    </tr>
                                ))}
                                {main.map((m, i) => (
                                    <tr key={i}>
                                        <td className="pr-4 text-gray-400">Main</td>
                                        <td className="pr-4 font-mono">{m.percent}% x {m.reps} @ {m.weight}{units}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="pr-4 text-gray-400 align-top">Assistance</td>
                                    <td className="pr-4 font-mono text-gray-300">See default assistance preview above.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                    <div className="text-[11px] text-gray-500">Review details then apply to auto-configure your cycle.</div>
                    <div className="flex items-center gap-3">
                        {onApply && (
                            <button
                                onClick={onApply}
                                type="button"
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500 text-indigo-200 text-xs font-medium hover:bg-indigo-600/30"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Use This Template</span>
                            </button>
                        )}
                        <button onClick={onClose} type="button" className="text-[11px] text-gray-500 hover:text-gray-300">Close</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
