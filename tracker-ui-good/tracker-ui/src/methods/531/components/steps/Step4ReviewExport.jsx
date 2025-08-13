import { buildAssistanceForDay } from "../.."; // barrel export
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { buildMainSetsForLift, buildWarmupSets, roundToIncrement, getWeekScheme } from '../..'; // barrel export
import { Info, AlertTriangle, Download, Copy, Printer, CheckCircle2 } from 'lucide-react';

const LIFT_KEY_MAP = {
    Squat: 'squat',
    Bench: 'bench',
    Deadlift: 'deadlift',
    Press: 'press',
    Overhead: 'press'
};
const DISPLAY_LIFT_NAMES = { squat: 'Squat', bench: 'Bench', deadlift: 'Deadlift', press: 'Press', overhead_press: 'Press' };

function deriveEffectiveConfig(state) {
    const merged = { ...state };
    if (state.flowMode === 'template' && state.templateKey && state.templateAppliedConfig) {
        const cfg = state.templateAppliedConfig;
        if (cfg.schedule) {
            merged.schedule = { ...merged.schedule, ...cfg.schedule };
        }
        if (cfg.supplemental) {
            merged.supplemental = { ...merged.supplemental, ...cfg.supplemental };
        }
        if (cfg.assistance) {
            merged.assistance = { ...merged.assistance, ...cfg.assistance };
        }
        if (cfg.loadingOption) {
            merged.loadingOption = cfg.loadingOption;
        }
    }
    return merged;
}

export default function Step4ReviewExport({ onReadyChange }) {
    const { state } = useProgramV2();
    const [weekIndex, setWeekIndex] = useState(0);
    const [exportError, setExportError] = useState(null);
    const [copied, setCopied] = useState(false);

    const effective = useMemo(() => deriveEffectiveConfig(state), [state]);

    // Normalized schedule days (custom design vs legacy schedule.order)
    const scheduleDesign = effective.schedule || {};
    const frequencyRaw = scheduleDesign.frequency || '4day';
    const frequency = typeof frequencyRaw === 'number' ? frequencyRaw : (frequencyRaw || '4day');
    const order = scheduleDesign.order || scheduleDesign.days || ['Press', 'Deadlift', 'Bench', 'Squat'];
    const includeWarmups = scheduleDesign.includeWarmups !== false;
    const warmupScheme = scheduleDesign.warmupScheme || { percentages: [40, 50, 60], reps: [5, 5, 3] };

    const trainingMaxes = {
        squat: effective.lifts?.squat?.tm || 0,
        bench: effective.lifts?.bench?.tm || 0,
        deadlift: effective.lifts?.deadlift?.tm || 0,
        overhead_press: effective.lifts?.press?.tm || effective.lifts?.overhead_press?.tm || 0
    };

    const roundingMode = typeof effective.rounding === 'string' ? effective.rounding : (effective.rounding?.mode || 'nearest');
    const roundingIncrement = typeof effective.rounding === 'object' ? (effective.rounding.increment || 5) : (effective.units === 'kg' ? 2.5 : 5);
    const units = effective.units === 'kg' ? 'kg' : 'lbs';
    const loadingOption = effective.loadingOption || effective.loading?.option || 1;

    const supplemental = effective.supplemental || { strategy: 'none' };
    const assistance = effective.assistance || { mode: 'minimal' };
    const conditioning = effective.conditioning || {
        sessionsPerWeek: 2,
        hiitPerWeek: 1,
        modalities: { hiit: ['Prowler Pushes'], liss: ['Walking'] },
        note: 'Do 2–3 sessions/week as tolerated.'
    };

    // Validation collection
    const validation = useMemo(() => {
        const messages = [];
        // TMs
        if (!Object.values(trainingMaxes).every(v => v && v > 0)) {
            messages.push('All four training maxes must be established.');
        }
        // Schedule frequency & order
        const freqNum = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
        if (!Array.isArray(order) || order.length !== freqNum) {
            messages.push('Schedule order length must match selected frequency.');
        } else {
            const allowed = ['Press', 'Deadlift', 'Bench', 'Squat'];
            const dup = new Set(order);
            if (dup.size !== order.length) messages.push('Schedule days must be unique lifts.');
            if (!order.every(l => allowed.includes(l))) messages.push('Schedule contains invalid lift identifiers.');
        }
        // Warmups
        if (includeWarmups) {
            const p = warmupScheme?.percentages || [];
            const r = warmupScheme?.reps || [];
            if (!(Array.isArray(p) && Array.isArray(r) && p.length === r.length && p.length > 0)) {
                messages.push('Warm-up scheme percentages & reps must be equal length.');
            }
        }
        // BBB
        if (supplemental.strategy === 'bbb') {
            if (!(supplemental.sets === 5 && supplemental.reps === 10)) messages.push('BBB requires 5x10.');
            if (!(supplemental.percentOfTM >= 50 && supplemental.percentOfTM <= 70)) messages.push('BBB % of TM must be 50–70.');
            if (!['same', 'opposite'].includes(supplemental.pairing)) messages.push('BBB pairing must be same or opposite.');
        }
        return { valid: messages.length === 0, messages };
    }, [trainingMaxes, frequency, order, includeWarmups, warmupScheme, supplemental]);

    useEffect(() => { onReadyChange && onReadyChange(validation.valid); }, [validation, onReadyChange]);

    const percentMatrix = useMemo(() => getWeekScheme(loadingOption), [loadingOption]);

    function mapLiftDisplayName(liftDisplay) {
        const key = LIFT_KEY_MAP[liftDisplay] || liftDisplay.toLowerCase();
        return key;
    }

    function getTMForDisplayLift(display) {
        const key = mapLiftDisplayName(display);
        if (key === 'press') return trainingMaxes.overhead_press; // unify
        return trainingMaxes[key] || 0;
    }

    function getBbbPairLift(mainDisplay) {
        if (supplemental.pairing === 'same') return mainDisplay;
        // Opposite pairing map
        const map = { Press: 'Bench', Bench: 'Press', Squat: 'Deadlift', Deadlift: 'Squat' };
        return map[mainDisplay] || mainDisplay;
    }

    // Build weeks JSON for export (4 weeks always include deload per spec preview)
    const weeksData = useMemo(() => {
        // Assistance pack fallback: if no template chosen, prefer 'triumvirate' (never empty except Jack Shit)
        const assistancePack = state.templateKey || state.assistance?.templateId || (assistance.mode === 'jack_shit' ? 'jack_shit' : 'triumvirate');
        const weeks = [0, 1, 2, 3].map(wi => {
            const daysData = order.map((displayLift) => {
                const tm = getTMForDisplayLift(displayLift);
                const warmups = buildWarmupSets({ includeWarmups, warmupScheme, tm, roundingIncrement, roundingMode, units });
                const main = buildMainSetsForLift({ tm, weekIndex: wi, option: loadingOption, roundingIncrement, roundingMode, units }).sets;
                let supplementalBlock = undefined;
                if (supplemental.strategy === 'bbb') {
                    const bbbTargetLiftDisplay = getBbbPairLift(displayLift);
                    const bbbTm = getTMForDisplayLift(bbbTargetLiftDisplay);
                    const bbbWeight = roundToIncrement(bbbTm * (supplemental.percentOfTM / 100), roundingIncrement, roundingMode);
                    supplementalBlock = {
                        type: 'bbb',
                        sets: supplemental.sets, reps: supplemental.reps,
                        weight: bbbWeight, units
                    };
                }
                // Assistance source normalization (custom/template/bodyweight variants)
                let assistanceItems = [];
                if (assistance.mode === 'triumvirate' && assistance.patternPerDay) {
                    assistanceItems = assistance.patternPerDay[displayLift.toLowerCase()] || [];
                } else if (assistance.mode === 'custom' && assistance.customPlan) {
                    assistanceItems = assistance.customPlan[displayLift] || [];
                } else if (assistance.mode === 'periodization_bible' && assistance.blocks) {
                    assistanceItems = assistance.blocks;
                } else if (assistance.mode === 'bodyweight' && assistance.menu) {
                    assistanceItems = assistance.menu.map(name => ({ name, sets: 3, reps: 10, rule: { method: 'bodyweight' } }));
                } else if (assistance.mode === 'jack_shit') {
                    assistanceItems = [];
                }
                const assistanceComputed = buildAssistanceForDay({
                    items: assistanceItems,
                    tms: trainingMaxes,
                    units,
                    roundingIncrement,
                    roundingMode,
                    bodyweight: state?.bodyweight || 0
                });
                // Conditioning: mimic schedule.js strategy (single pickCardio id reused across days)
                let conditioning = null;
                try {
                    // eslint-disable-next-line no-undef
                    const { CardioTemplates, pickCardio } = require('../../cardioTemplates.js');
                    const cardioId = pickCardio(frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2, state || {});
                    conditioning = CardioTemplates[cardioId];
                } catch {
                    conditioning = { type: 'LISS', minutes: 30 };
                }
                return {
                    lift: displayLift,
                    warmups,
                    main,
                    supplemental: supplementalBlock,
                    assistance: assistanceComputed, // plain array for UI/export
                    conditioning
                };
            });
            return { week: wi + 1, days: daysData };
        });
        return weeks;
    }, [order, includeWarmups, warmupScheme, roundingIncrement, roundingMode, units, supplemental, assistance, loadingOption, trainingMaxes, state?.bodyweight, state.templateKey, frequency]);

    const exportJson = useMemo(() => {
        const freqNum = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
        const assistancePack = state.templateKey || state.assistance?.templateId || (assistance.mode === 'jack_shit' ? 'jack_shit' : 'triumvirate');
        return {
            meta: {
                createdAt: new Date().toISOString(),
                templateKey: state.flowMode === 'template' ? state.templateKey : null,
                pack: assistancePack,
                units,
                loadingOption,
                daysPerWeek: freqNum,
                split4: freqNum === 4 ? (state.schedule?.split4 || state.advanced?.split4 || 'A') : undefined,
                equipment: state.equipment || []
            },
            trainingMaxes,
            rounding: typeof state.rounding === 'object' ? state.rounding : { increment: roundingIncrement, mode: roundingMode },
            schedule: {
                frequency: freqNum,
                days: order,
                includeWarmups,
                warmupScheme
            },
            supplemental,
            assistance,
            weeks: weeksData
        };
    }, [state.flowMode, state.templateKey, state.assistance?.templateId, state.schedule?.split4, state.advanced?.split4, state.equipment, units, loadingOption, trainingMaxes, state.rounding, roundingIncrement, roundingMode, frequency, order, includeWarmups, warmupScheme, supplemental, assistance, weeksData]);

    const handleDownload = useCallback(() => {
        try {
            const blob = new Blob([JSON.stringify(exportJson, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `program-531-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setExportError(null);
        } catch (e) {
            setExportError(e.message || 'Download failed');
        }
    }, [exportJson]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(exportJson, null, 2)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }, [exportJson]);

    const handlePrint = useCallback(() => { window.print(); }, []);

    // Week view preview building
    const previewWeek = weeksData[weekIndex];

    return (
        <div className="space-y-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Step 4 — Review & Export</h2>
                    <p className="text-gray-400 text-sm">Preview the full 4-week cycle, confirm details, then export or print.</p>
                    {/* Context badge */}
                    <div className="text-xs uppercase tracking-wide opacity-70 mt-2">
                        {frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2}-day • {String((state.templateKey || state.assistance?.templateId || (assistance.mode === 'jack_shit' ? 'jack_shit' : 'triumvirate'))).toUpperCase()}
                        {frequency === '4day' && (state.schedule?.split4 || state.advanced?.split4) && ` • Split ${(state.schedule?.split4 || state.advanced?.split4)}`}
                    </div>
                </div>
                {state.flowMode === 'template' && state.templateKey && (
                    <div className="px-3 py-1 text-xs rounded-full bg-red-600/20 text-red-300 border border-red-500 uppercase tracking-wide self-start md:self-auto">Template: {state.templateKey}</div>
                )}
            </div>

            {/* Validation */}
            {!validation.valid && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-red-300 font-medium"><AlertTriangle className="w-4 h-4" /><span>Issues Detected</span></div>
                    <ul className="list-disc list-inside text-red-200 text-xs space-y-1">
                        {validation.messages.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left: Week Preview */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3].map(i => (
                            <button key={i} onClick={() => setWeekIndex(i)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${weekIndex === i ? 'bg-red-600/20 border-red-500 text-red-300' : 'border-gray-600 text-gray-300 hover:border-gray-500'}`}>Week {i + 1}{i === 3 && ' (Deload)'}</button>
                        ))}
                    </div>

                    {previewWeek && (
                        <div className="space-y-6">
                            {previewWeek.days.map((day, idx) => (
                                <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Day {idx + 1} – {day.lift}</h3>
                                        {day.supplemental?.type === 'bbb' && (
                                            <span className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300 border border-red-500">BBB</span>
                                        )}
                                    </div>
                                    {/* Warm-ups */}
                                    {includeWarmups && day.warmups && day.warmups.length > 0 && (
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Warm-ups</div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-xs text-gray-300">
                                                    <thead>
                                                        <tr className="text-gray-500">
                                                            <th className="text-left font-medium pb-1 pr-4">%</th>
                                                            <th className="text-left font-medium pb-1 pr-4">Reps</th>
                                                            <th className="text-left font-medium pb-1">Weight</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {day.warmups.map((s, i2) => (
                                                            <tr key={i2} className="align-top">
                                                                <td className="py-0.5 pr-4 font-mono">{s.percent}</td>
                                                                <td className="py-0.5 pr-4 font-mono">{s.reps}</td>
                                                                <td className="py-0.5 font-mono">{s.weight}{units}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    {/* Main Sets */}
                                    <div>
                                        <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Main Sets</div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-xs text-gray-300">
                                                <thead>
                                                    <tr className="text-gray-500">
                                                        <th className="text-left font-medium pb-1 pr-4">%</th>
                                                        <th className="text-left font-medium pb-1 pr-4">Reps</th>
                                                        <th className="text-left font-medium pb-1">Weight</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {day.main.map((s, i3) => (
                                                        <tr key={i3} className="align-top">
                                                            <td className="py-0.5 pr-4 font-mono">{s.percent}</td>
                                                            <td className="py-0.5 pr-4 font-mono">{s.reps}</td>
                                                            <td className="py-0.5 font-mono">{s.weight}{units}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Supplemental */}
                                    {day.supplemental && day.supplemental.type === 'bbb' && (
                                        <div className="text-xs text-red-200 bg-red-900/10 border border-red-700/40 rounded p-3 font-mono">
                                            BBB: {day.supplemental.sets} × {day.supplemental.reps} @ {day.supplemental.weight}{units}
                                        </div>
                                    )}
                                    {/* Assistance */}
                                    {/* Assistance (inline condensed) */}
                                    <div className="mt-2">
                                        <div className="font-medium text-xs text-gray-300">Assistance</div>
                                        <div className="text-[11px] opacity-80 text-gray-400">
                                            {(Array.isArray(day.assistance) && day.assistance.length)
                                                ? day.assistance.map(a => `${a.name} ${a.sets}x${a.reps}`).join(' • ')
                                                : 'None'}
                                        </div>
                                    </div>
                                    {/* Conditioning (if available on day) */}
                                    {day.conditioning && (
                                        <div className="mt-2">
                                            <div className="font-medium text-xs text-gray-300">Conditioning</div>
                                            <div className="text-[11px] opacity-80 text-gray-400">
                                                {day.conditioning.type}
                                                {day.conditioning.minutes ? ` • ${day.conditioning.minutes} min` : ''}
                                                {day.conditioning.intensity ? ` • ${day.conditioning.intensity}` : ''}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Summary / Actions */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Summary</h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            {Object.entries(trainingMaxes).map(([k, v]) => (
                                <div key={k} className="bg-gray-800/70 border border-gray-700 rounded p-2 flex flex-col">
                                    <span className="text-gray-500 uppercase tracking-wide text-[10px]">{DISPLAY_LIFT_NAMES[k] || k}</span>
                                    <span className="font-mono text-gray-200">{v || '—'}{units}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400">
                            <div>Loading Option: {loadingOption} {loadingOption === 1 ? '(Conservative)' : '(Aggressive)'}</div>
                            <div>Schedule: {(frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2)} days – {order.join(' / ')}</div>
                            {state.deadliftRepStyle && <div>Deadlift Style: {state.deadliftRepStyle.replace('_', ' ')}</div>}
                            <div>Units: {units}</div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Export</h4>
                        <div className="flex flex-col space-y-2">
                            <button onClick={handleDownload} disabled={!validation.valid} className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${validation.valid ? 'bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/30' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}>
                                <Download className="w-4 h-4" /><span>Download JSON</span>
                            </button>
                            <button onClick={handleCopy} disabled={!validation.valid} className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${validation.valid ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}>
                                <Copy className="w-4 h-4" /><span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                            </button>
                            <button onClick={handlePrint} disabled={!validation.valid} className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${validation.valid ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}>
                                <Printer className="w-4 h-4" /><span>Print</span>
                            </button>
                            {exportError && <div className="text-xs text-red-400">{exportError}</div>}
                        </div>
                        {validation.valid && (
                            <div className="flex items-center space-x-2 text-green-400 text-xs"><CheckCircle2 className="w-4 h-4" /><span>Ready to start cycle.</span></div>
                        )}
                    </div>

                    {/* Developer Inspector */}
                    {import.meta.env.MODE !== 'production' && (
                        <DevInspector effective={effective} exportJson={exportJson} />
                    )}
                </div>
            </div>
        </div>
    );
}

function DevInspector({ effective, exportJson }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 space-y-3 text-xs">
            <button title="Debug: inspect generated config & weeks (dev only)" onClick={() => setOpen(o => !o)} className="px-3 py-1.5 rounded border border-gray-600 text-gray-300 hover:border-red-500">{open ? 'Hide' : 'Show'} Program JSON (Debug)</button>
            {open && (
                <div className="space-y-4">
                    <div>
                        <div className="font-semibold text-gray-400 mb-1">Effective Config</div>
                        <pre className="max-h-64 overflow-auto bg-black/40 p-3 rounded text-[11px] leading-snug text-gray-200">{JSON.stringify(effective, null, 2)}</pre>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-400 mb-1">Generated Weeks</div>
                        <pre className="max-h-64 overflow-auto bg-black/40 p-3 rounded text-[11px] leading-snug text-gray-200">{JSON.stringify(exportJson.weeks, null, 2)}</pre>
                    </div>
                    <button onClick={() => navigator.clipboard.writeText(JSON.stringify(exportJson, null, 2))} className="text-gray-400 hover:text-gray-200">Copy Full JSON</button>
                </div>
            )}
        </div>
    );
}
