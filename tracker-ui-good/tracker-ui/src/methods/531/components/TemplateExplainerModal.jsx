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

    // Dynamic naming: detect BBB Same-Lift start (50%) or legacy (60%) variants
    let dynamicName = spec?.name;
    if (spec?.key === 'bbb') {
        const supp = state?.supplemental;
        if (supp?.strategy === 'bbb' && (supp?.pairing === 'same' || !supp?.pairing)) {
            if (supp?.percentOfTM === 50) dynamicName = 'BBB 50% (Same-Lift Start)';
            else if (supp?.percentOfTM === 60) dynamicName = 'BBB 60% (Same-Lift)';
        }
    }
    const isBBBVariant = /^BBB (50% \(Same-Lift Start\)|60% \(Same-Lift\))$/.test(dynamicName || '');
    const isJackShit = spec?.key === 'jack_shit';

    // Variant-specific structure / recovery overrides
    const suppPct = state?.supplemental?.percentOfTM;
    const variantStructure = isBBBVariant ? [
        'Main 5/3/1 sets (Week 1–3 AMRAP, Week 4 deload)',
        `Supplemental: 5×10 @ ${suppPct || 50}% TM (same lift)`,
        'Assistance: ONE movement (classic BBB) – e.g. chins, dips, rows, back raises, abs'
    ] : spec?.structure;
    const variantRecovery = isBBBVariant ? 'High supplemental volume – start lighter (50%) and progress cautiously to 60% only when recovery is excellent. Favor easy conditioning (LISS) and cap assistance at 25–50 quality reps per movement. Deload Week 4.' : spec?.recovery;
    const jackShitStructure = [
        'Main 5/3/1 sets only (Week 1–3 AMRAP, Week 4 deload)',
        'Optional: 1–2 easy assistance movements (chins / dips / core)'
    ];
    const jackShitRecovery = 'Extremely low systemic stress. Ideal when time, equipment, or recovery is limited, or when re‑establishing training momentum.';

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto py-8 px-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl bg-gray-900/95 border border-indigo-500/40 rounded-xl shadow-2xl p-6 space-y-6">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300" aria-label="Close template explainer"><X className="w-5 h-5" /></button>
                <header>
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <span>{isJackShit ? 'Jack Shit' : (dynamicName || 'Template')}</span>
                        {onApply && <span className="px-2 py-0.5 rounded bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-[10px] uppercase tracking-wide">Template</span>}
                    </h2>
                    <p className="text-sm text-indigo-200 mt-2 leading-snug">
                        {isBBBVariant ? `High‑volume BBB same‑lift at ${suppPct || 50}% TM. Start light (50%)—only increase when recovery is solid.` : isJackShit ? 'Bare‑bones 5/3/1: main work only. Add a little optional assistance if fresh.' : spec?.blurb}
                    </p>
                </header>

                <section className="grid md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-gray-800/60 rounded p-3">
                        <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Session Time</div>
                        <div className="text-gray-200">{isJackShit ? 'Very short (10–25 min)' : (isBBBVariant ? 'Moderate (45–60 min)' : spec?.time)}</div>
                    </div>
                    <div className="bg-gray-800/60 rounded p-3 md:col-span-2">
                        <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Recovery</div>
                        <div className="text-gray-300 leading-snug text-[11px]">{isJackShit ? jackShitRecovery : variantRecovery}</div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Structure</h3>
                    <ul className="list-disc list-inside text-[11px] text-gray-300 space-y-0.5">
                        {(isJackShit ? jackShitStructure : variantStructure)?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </section>

                {spec.assistanceHint && !isJackShit && (
                    <section className="space-y-3">
                        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Assistance Guidance</h3>
                        <p className="text-[11px] text-gray-300 leading-snug">{isBBBVariant ? 'Choose ONE assistance movement only (book example). 25–50 quality reps. Keep it simple (e.g., chins, dips, rows, back raises, ab wheel). Progress load or reps slowly once recovery is rock solid.' : spec.assistanceHint.intent}</p>
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
                {isJackShit && (
                    <section className="space-y-2">
                        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Guidance</h3>
                        <ul className="list-disc list-inside text-[11px] text-gray-300 space-y-0.5">
                            <li>Main 5/3/1 work only; optionally add chins / dips / core if very fresh.</li>
                            <li>Use when life stress or time is high, or re‑starting after a layoff.</li>
                            <li>Great base for layering conditioning or mobility.</li>
                        </ul>
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
                    <div className="text-[11px] text-gray-500">Review details then apply to auto-configure your cycle. (More template variants coming soon.)</div>
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
