import { buildAssistanceForDay } from "../.."; // barrel export
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { buildMainSetsForLift, buildWarmupSets, roundToIncrement, getWeekScheme } from '../..'; // barrel export
import { Info, AlertTriangle, Download, Copy, Printer, CheckCircle2, BookOpen } from 'lucide-react';
import TemplateExplainerModal from '../../components/TemplateExplainerModal.jsx';
import { getTemplateSpec, TEMPLATE_SPECS } from '../../../../lib/templates/531.templateSpecs.js';
import { getTemplatePreset } from '../../../../lib/templates/531.presets.v2.js';
// Static imports (avoid dynamic require duplication during build)
import { normalizeAssistance, CATALOG_VERSION } from '../../assistance/index.js';
// Volume & stress helpers
import { estimateTonnage, sumRepsByBlock } from '../../calc.js';
import AssistanceCatalogData, { AssistanceCatalog } from '../../assistanceCatalog.js';
import AssistanceRow from '../assistance/AssistanceRow.jsx';
import AssistanceCatalogPicker from '../assistance/AssistanceCatalogPicker.jsx';
import ToggleButton from '../ToggleButton.jsx';
import { CardioTemplates, pickCardio } from '../../cardioTemplates.js';

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
    const { state, dispatch } = useProgramV2();
    const [showTemplateExplainer, setShowTemplateExplainer] = useState(false);
    const [showChangeTemplate, setShowChangeTemplate] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState(null);
    const [confirmSwitch, setConfirmSwitch] = useState(false);
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
    const assistMode = state.assistMode || 'template';
    const assistCustom = state.assistCustom || {};
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
                // Normalized assistance via template rules (ignores legacy state.assistance shape)
                // Assistance via template normalization
                let assistanceComputed = [];
                if (assistMode === 'template') {
                    const tplKey = state.templateKey || state.pack || assistance.templateId || assistance.mode || 'custom';
                    const rawAssist = normalizeAssistance(tplKey, displayLift, state) || [];
                    assistanceComputed = rawAssist.map(it => ({
                        id: it.id || it.name,
                        name: it.name,
                        sets: it.sets,
                        reps: it.reps,
                        block: it.block,
                        equipment: it.equipment || [],
                        note: it.note || null
                    }));
                } else {
                    // custom: day index +1 mapping (assistCustom stores by numeric day)
                    const dayIdx = order.indexOf(displayLift) + 1;
                    const customList = assistCustom[dayIdx] || [];
                    assistanceComputed = customList.map(it => ({
                        id: it.id || it.name,
                        name: it.name,
                        sets: it.sets,
                        reps: it.reps,
                        block: it.block,
                        equipment: it.equipment || [],
                        note: it.note || null
                    }));
                }
                // Conditioning: mimic schedule.js strategy (single pickCardio id reused across days)
                const cardioId = pickCardio(frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2, state || {});
                const conditioning = CardioTemplates[cardioId] || { type: 'LISS', minutes: 30 };
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
                schemaVersion: '1.0.0',
                catalogVersion: CATALOG_VERSION,
                createdAt: new Date().toISOString(),
                templateKey: state.flowMode === 'template' ? state.templateKey : null,
                templateName: state.templateSpec?.name || null,
                pack: assistancePack,
                assistanceMode: assistMode,
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
    }, [assistMode, state.pack, state.flowMode, state.templateKey, state.assistance?.templateId, state.schedule?.split4, state.advanced?.split4, state.equipment, units, loadingOption, trainingMaxes, state.rounding, roundingIncrement, roundingMode, frequency, order, includeWarmups, warmupScheme, supplemental, assistance, weeksData]);

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

    // Volume & Stress metrics (memoized)
    const dayMetrics = useMemo(() => {
        if (!previewWeek) return [];
        return previewWeek.days.map(day => {
            // Main: day.main entries have percent/weight/reps (percent key named percent in weeksData builder as s.percent)
            const mainReps = Array.isArray(day.main) ? day.main.reduce((a, s) => a + (Number(s.reps) || 0), 0) : 0;
            const mainTonnage = estimateTonnage(day.main || []);
            // Supplemental (only BBB currently)
            let suppReps = 0, suppTonnage = 0, suppPctWarning = false;
            if (day.supplemental && day.supplemental.type === 'bbb') {
                suppReps = (Number(day.supplemental.sets) || 0) * (Number(day.supplemental.reps) || 0);
                if (Number(day.supplemental.weight) && Number(day.supplemental.reps) && Number(day.supplemental.sets)) {
                    suppTonnage = Number(day.supplemental.weight) * Number(day.supplemental.reps) * Number(day.supplemental.sets);
                }
                // BBB > 50% TM warning: we only know % indirectly; we can infer if weight > (0.5 * TM of paired lift)
                // Reconstruct TM of BBB target lift by dividing weight by (%/100). We only stored weight; we have percent via supplemental.percentOfTM in state.supplemental
                const cfgPct = supplemental.percentOfTM || supplemental.intensity?.value || 0;
                if (supplemental.strategy === 'bbb' && cfgPct > 50) suppPctWarning = true;
            }
            // Assistance reps & category tallies
            const assistReps = Array.isArray(day.assistance) ? day.assistance.reduce((a, it) => {
                const sets = Number(it.sets) || 0;
                let reps = 0;
                if (typeof it.reps === 'number') reps = it.reps; else if (typeof it.reps === 'string') {
                    if (/^\d+-\d+/.test(it.reps)) { const [x, y] = it.reps.split('-').map(n => Number(n)); if (Number.isFinite(x) && Number.isFinite(y)) reps = Math.round((x + y) / 2); }
                    else if (/^\d+/.test(it.reps)) reps = Number(it.reps); else reps = 12;
                }
                return a + sets * reps;
            }, 0) : 0;
            const totalReps = mainReps + suppReps + assistReps;
            const totalTonnage = mainTonnage + suppTonnage; // assistance tonnage ignored (no load data)
            const byBlock = sumRepsByBlock(day);
            const blockWarnings = Object.entries(byBlock).filter(([_, v]) => v > 100).map(([blk]) => `High ${blk} volume (>100 reps)`);
            const warnings = [];
            if (blockWarnings.length) warnings.push(...blockWarnings);
            if (suppPctWarning) warnings.push('BBB >50% TM');
            return { mainReps, suppReps, assistReps, totalReps, mainTonnage, suppTonnage, totalTonnage, warnings };
        });
        // Dependencies cover anything affecting loads or reps
    }, [previewWeek, supplemental.percentOfTM, supplemental.strategy]);

    // Assistance editing (custom mode only)
    const [showAssistEditor, setShowAssistEditor] = useState(false);
    useEffect(() => {
        if (assistMode === 'custom') setShowAssistEditor(true);
    }, [assistMode]);

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
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {state?.templateSpec && (
                            <ToggleButton
                                on={false}
                                type="button"
                                onClick={() => { setPendingTemplate(state.templateKey); setShowTemplateExplainer(true); }}
                                className="!rounded-full !px-3 !py-1 text-[11px] flex items-center gap-1.5"
                            >
                                <BookOpen className="w-3.5 h-3.5 opacity-80" />
                                <span>{state.templateSpec.name}</span>
                                <span className="opacity-60">Info</span>
                            </ToggleButton>
                        )}
                        <div className="ml-auto flex gap-2">
                            <ToggleButton
                                on={showChangeTemplate}
                                type="button"
                                onClick={() => setShowChangeTemplate(v => !v)}
                                className="text-[11px] px-3 py-1.5"
                            >Change Template</ToggleButton>
                            {assistMode === 'template' && (
                                <ToggleButton
                                    on={false}
                                    type="button"
                                    onClick={() => dispatch({ type: 'CONVERT_ASSIST_TO_CUSTOM', order })}
                                    className="text-[11px] px-3 py-1.5"
                                >Convert to Custom Assistance</ToggleButton>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-start">
                    {state.flowMode === 'template' && state.templateKey && (
                        <div className="px-3 py-1 text-xs rounded-full bg-red-600/20 text-red-300 border border-red-500 uppercase tracking-wide self-start md:self-auto">Template: {state.templateKey}</div>
                    )}
                    <div className="px-3 py-1 text-[10px] rounded-full bg-gray-700/40 text-gray-300 border border-gray-600 uppercase tracking-wide self-start md:self-auto">Assistance Mode: {assistMode}</div>
                </div>
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
                            <ToggleButton key={i} on={weekIndex === i} onClick={() => setWeekIndex(i)} className="text-xs px-4 py-2">
                                Week {i + 1}{i === 3 && ' (Deload)'}
                            </ToggleButton>
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
                                        {Array.isArray(day.assistance) && day.assistance.length > 0 ? (
                                            <div className="text-[11px] opacity-80 text-gray-400 space-y-0.5">
                                                {day.assistance.map((a, i) => (
                                                    <div key={i}>{a.block ? (<><span className="text-gray-300 font-semibold">{a.block}:</span> {a.name} {a.sets}x{a.reps}</>) : (<>{a.name} {a.sets}x{a.reps}</>)}</div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-[11px] opacity-80 text-gray-500">None</div>
                                        )}
                                        {/* Inline custom editor (advanced) */}
                                        {assistMode === 'custom' && (
                                            <InlinePerDayCustomEditor
                                                dayIndex={idx}
                                                displayLift={day.lift}
                                                state={state}
                                                dispatch={dispatch}
                                                templateKey={state.templateKey || state.pack || 'triumvirate'}
                                            />
                                        )}
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
                                    {/* Volume & Stress mini-panel */}
                                    {dayMetrics[idx] && (
                                        <div className="mt-2 border-t border-gray-700 pt-2 text-[11px] text-gray-400 leading-snug">
                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                <span className="text-gray-300 font-medium">Reps:</span>
                                                <span>main {dayMetrics[idx].mainReps}</span>
                                                <span>supp {dayMetrics[idx].suppReps}</span>
                                                <span>assist {dayMetrics[idx].assistReps}</span>
                                                <span className="text-gray-300">(total {dayMetrics[idx].totalReps})</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                <span className="text-gray-300 font-medium">Tonnage:</span>
                                                <span>main {dayMetrics[idx].mainTonnage}</span>
                                                <span>supp {dayMetrics[idx].suppTonnage}</span>
                                                <span className="text-gray-300">(total {dayMetrics[idx].totalTonnage})</span>
                                                {dayMetrics[idx].warnings.map((w, wi) => (
                                                    <span key={wi} title={w} className="px-1.5 py-0.5 bg-amber-700/30 border border-amber-500/50 text-amber-200 rounded inline-flex items-center gap-1">⚠</span>
                                                ))}
                                            </div>
                                            {/* Legend (shown once per day card) */}
                                            <div className="mt-1 text-[10px] text-gray-500 italic">
                                                Legend: ⚠ badge appears when a category exceeds ~100 reps (soft guardrail). Aim for roughly 50–100 assistance reps per block. BBB recommended 50–70% TM.
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
                    {assistMode === 'custom' && (
                        <InlineCustomAssistanceEditor
                            order={order}
                            assistCustom={assistCustom}
                            dispatch={dispatch}
                            state={state}
                        />
                    )}
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
                            <ToggleButton on={false} disabled={!validation.valid} onClick={handleDownload} className="flex items-center justify-center gap-2 text-xs">
                                <Download className="w-4 h-4" /> <span>Download JSON</span>
                            </ToggleButton>
                            <ToggleButton on={copied} disabled={!validation.valid} onClick={handleCopy} className="flex items-center justify-center gap-2 text-xs">
                                <Copy className="w-4 h-4" /> <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                            </ToggleButton>
                            <ToggleButton on={false} disabled={!validation.valid} onClick={handlePrint} className="flex items-center justify-center gap-2 text-xs">
                                <Printer className="w-4 h-4" /> <span>Print</span>
                            </ToggleButton>
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
            {(showTemplateExplainer || showChangeTemplate) && (
                <TemplateChangeOverlay
                    open={showTemplateExplainer || showChangeTemplate}
                    onClose={() => { setShowTemplateExplainer(false); setShowChangeTemplate(false); setPendingTemplate(null); setConfirmSwitch(false); }}
                    state={state}
                    dispatch={dispatch}
                    currentKey={state.templateKey}
                    pendingKey={pendingTemplate}
                    setPendingKey={setPendingTemplate}
                    assistMode={state.assistMode}
                    confirmSwitch={confirmSwitch}
                    setConfirmSwitch={setConfirmSwitch}
                />
            )}
        </div>
    );
}

function TemplateChangeOverlay({ open, onClose, state, dispatch, currentKey, pendingKey, setPendingKey, assistMode, confirmSwitch, setConfirmSwitch }) {
    const [tab, setTab] = useState('pick');
    if (!open) return null;
    const specs = Object.values(TEMPLATE_SPECS);

    function applyTemplateKey(key) {
        const preset = getTemplatePreset(key, { state });
        if (!preset) return;
        const spec = getTemplateSpec(key);
        if (assistMode === 'custom' && !confirmSwitch) {
            setPendingKey(key);
            setConfirmSwitch(true);
            return;
        }
        // Proceed applying template; clear custom assistance
        dispatch({ type: 'SET_TEMPLATE_KEY', payload: preset.key });
        dispatch({ type: 'APPLY_TEMPLATE_CONFIG', payload: preset });
        if (spec) {
            dispatch({ type: 'SET_TEMPLATE_SPEC', payload: spec });
            if (spec.assistanceHint) dispatch({ type: 'SET_ASSISTANCE_HINT', payload: spec.assistanceHint });
        }
        dispatch({ type: 'SET_FLOW_MODE', payload: 'template' });
        dispatch({ type: 'SET_ASSIST_MODE', payload: 'template' });
        dispatch({ type: 'SET_ASSIST_CUSTOM', payload: null });
        setConfirmSwitch(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-10 px-4">
            <div className="relative w-full max-w-5xl bg-gray-900/95 border border-gray-700 rounded-xl p-6 space-y-6 shadow-2xl">
                <ToggleButton on={false} onClick={onClose} className="absolute top-3 right-3 !px-2 !py-1 text-xs">✕</ToggleButton>
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Change Template</h2>
                        <p className="text-xs text-gray-400 mt-1">Switching updates assistance & schedule defaults. Training maxes are preserved.</p>
                    </div>
                    {assistMode === 'custom' && <span className="px-2 py-1 rounded bg-amber-600/10 border border-amber-500/40 text-amber-300 text-[11px]">Custom Assistance Active</span>}
                </header>
                {!confirmSwitch && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {specs.map(spec => {
                            const active = spec.key === currentKey;
                            return (
                                <div key={spec.key} className={`rounded-lg border p-4 cursor-pointer flex flex-col ${active ? 'border-indigo-500 bg-indigo-600/10' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500'}`} onClick={() => { setPendingKey(spec.key); applyTemplateKey(spec.key); }}>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-white leading-snug pr-4">{spec.name}</h3>
                                        {active && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-snug flex-1 mb-2">{spec.blurb}</p>
                                    <div className="text-[10px] text-indigo-300 uppercase tracking-wide">Select</div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {confirmSwitch && assistMode === 'custom' && (
                    <div className="space-y-4">
                        <div className="bg-amber-900/30 border border-amber-700 rounded p-4 text-sm text-amber-200">
                            <p className="font-medium mb-1">Replace Custom Assistance?</p>
                            <p className="text-xs leading-snug">Switching templates will replace your custom assistance with the new template defaults. This cannot be undone.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-end">
                            <ToggleButton on={false} className="text-xs" onClick={() => { setConfirmSwitch(false); setPendingKey(null); }}>Keep Custom</ToggleButton>
                            <ToggleButton on={true} className="text-xs" onClick={() => { if (pendingKey) { setConfirmSwitch(false); applyTemplateKey(pendingKey); } }}>Replace with Template</ToggleButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DevInspector({ effective, exportJson }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 space-y-3 text-xs">
            <ToggleButton title="Debug: inspect generated config & weeks (dev only)" on={open} onClick={() => setOpen(o => !o)} className="text-xs">{open ? 'Hide' : 'Show'} Program JSON (Debug)</ToggleButton>
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
                    <ToggleButton on={false} className="text-xs" onClick={() => navigator.clipboard.writeText(JSON.stringify(exportJson, null, 2))}>Copy Full JSON</ToggleButton>
                </div>
            )}
        </div>
    );
}

// Inline custom assistance editor (Step 4) ----------------------------------
function InlineCustomAssistanceEditor({ order, assistCustom, dispatch, state }) {
    const [activeDay, setActiveDay] = useState(1);
    const equipment = state.equipment || [];
    const templateKey = state.templateKey || state.pack || 'triumvirate';

    function dayItems(dayIdx) { return assistCustom?.[dayIdx] || []; }

    function updateDay(dayIdx, items) {
        dispatch({ type: 'SET_ASSIST_CUSTOM', dayId: dayIdx, items });
    }

    function addItem(dayIdx) {
        const items = [...dayItems(dayIdx)];
        items.push({ id: 'new_' + Date.now(), name: '', sets: 3, reps: 10, block: undefined });
        updateDay(dayIdx, items);
    }

    function removeItem(dayIdx, idx) {
        const items = [...dayItems(dayIdx)];
        items.splice(idx, 1);
        updateDay(dayIdx, items);
    }

    function swapItem(dayIdx, idx) { setPicker({ day: dayIdx, row: idx }); }

    function resetDay(dayIdx) {
        // Use display lift name
        const displayLift = order[dayIdx - 1];
        const tpl = normalizeAssistance(templateKey, displayLift, state) || [];
        const mapped = tpl.map(it => ({ id: it.id || it.name, name: it.name, sets: it.sets, reps: it.reps, block: it.block }));
        dispatch({ type: 'RESET_ASSIST_DAY', dayId: dayIdx, items: mapped });
    }

    // Catalog filtering
    const [picker, setPicker] = useState(null); // { day, row }

    function applyCatalog(it) {
        if (!picker) return;
        const { day, row } = picker;
        const items = [...dayItems(day)];
        if (!items[row]) return;
        const prev = items[row];
        // Preserve existing sets/reps; swap id/name/block only
        items[row] = { id: it.id, name: it.name, sets: prev.sets, reps: prev.reps, block: prev.block || it.block };
        // Volume mismatch soft warning (compare suggested vs retained)
        try {
            const parseReps = (r) => (typeof r === 'string' ? Number(r.split(/[^0-9]/).filter(Boolean)[0]) : r) || 0;
            const retainedVol = (prev.sets || 0) * (parseReps(prev.reps) || 0);
            const suggestedVol = (it.sets || 0) * parseReps(it.reps);
            if (retainedVol && suggestedVol && (suggestedVol / retainedVol > 1.6 || retainedVol / suggestedVol > 1.6)) {
                items[row].volumeWarn = true;
                setTimeout(() => {
                    const after = [...dayItems(day)];
                    if (after[row]) { after[row] = { ...after[row], volumeWarn: false }; updateDay(day, after); }
                }, 3000);
            }
        } catch { /* ignore */ }
        updateDay(day, items);
        setPicker(null);
    }

    // Volume badge per category (soft guardrail): count total reps approximated sets * avg reps numeric
    function computeVolumeInfo(dayIdx) {
        const items = dayItems(dayIdx);
        let total = 0; const byCat = {};
        items.forEach(it => {
            const sets = Number(it.sets) || 0;
            let reps = 0;
            if (typeof it.reps === 'number') reps = it.reps;
            else if (typeof it.reps === 'string') {
                if (/^\d+-\d+/.test(it.reps)) {
                    const [a, b] = it.reps.split('-').map(n => Number(n));
                    if (Number.isFinite(a) && Number.isFinite(b)) reps = Math.round((a + b) / 2);
                } else if (/^\d+/.test(it.reps)) reps = Number(it.reps);
                else reps = 12;
            }
            const vol = sets * reps;
            total += vol;
            const cat = it.block || 'general';
            byCat[cat] = (byCat[cat] || 0) + vol;
        });
        const overCat = Object.values(byCat).some(v => v > 100);
        return { total, overCat };
    }

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Custom Assistance</h3>
                {picker && <span className="text-[10px] text-indigo-300">Select a movement to swap…</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
                {order.map((lift, i) => {
                    const dayIdx = i + 1;
                    const { total, overCat } = computeVolumeInfo(dayIdx);
                    return (
                        <ToggleButton key={dayIdx} on={activeDay === dayIdx} onClick={() => setActiveDay(dayIdx)} className="text-[11px] px-3 py-1.5 relative">
                            Day {dayIdx}
                            {overCat && <span className="absolute -top-1 -right-1 bg-amber-600 text-white rounded-full text-[9px] px-1" title={`High category volume (~${total} reps)`}>⚠</span>}
                        </ToggleButton>
                    );
                })}
            </div>
            <div className="space-y-3">
                {dayItems(activeDay).map((it, idx) => (
                    <div key={idx} className="bg-gray-900/40 border border-gray-700 rounded p-2 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-gray-700/40 border border-gray-600 text-gray-300 text-[10px] min-w-[1.2rem] text-center" title="Block">{it.block || '—'}</span>
                            <input value={it.name} onChange={e => { const items = [...dayItems(activeDay)]; items[idx] = { ...items[idx], name: e.target.value }; updateDay(activeDay, items); }} className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-indigo-500" placeholder="Movement" />
                            <input type="number" value={it.sets} min={1} max={10} onChange={e => { const items = [...dayItems(activeDay)]; items[idx] = { ...items[idx], sets: Number(e.target.value) }; updateDay(activeDay, items); }} className="w-14 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-indigo-500" />
                            <input value={it.reps} onChange={e => { const items = [...dayItems(activeDay)]; items[idx] = { ...items[idx], reps: e.target.value }; updateDay(activeDay, items); }} className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-indigo-500" />
                            <ToggleButton on={false} className="text-[10px] px-2 py-1" onClick={() => swapItem(activeDay, idx)}>Swap</ToggleButton>
                            <ToggleButton on={false} className="text-[10px] px-2 py-1" onClick={() => removeItem(activeDay, idx)}>✕</ToggleButton>
                        </div>
                        {it.volumeWarn && <div className="text-[10px] text-amber-300 ml-6">Volume mismatch vs suggested default.</div>}
                        {picker && picker.day === activeDay && picker.row === idx && (
                            <div className="mt-2">
                                <AssistanceCatalogPicker
                                    block={it.block}
                                    equipment={equipment}
                                    onPick={applyCatalog}
                                    onClose={() => setPicker(null)}
                                />
                            </div>
                        )}
                    </div>
                ))}
                {dayItems(activeDay).length < 4 && (
                    <ToggleButton on={false} className="text-xs" onClick={() => addItem(activeDay)}>Add Exercise</ToggleButton>
                )}
                <div>
                    <ToggleButton on={false} className="text-[10px]" onClick={() => resetDay(activeDay)}>Reset to Template</ToggleButton>
                </div>
            </div>
        </div>
    );
}

// Lightweight per-day inline editor (appears inside each day card when assistMode === 'custom')
function InlinePerDayCustomEditor({ dayIndex, displayLift, state, dispatch, templateKey }) {
    const dayId = dayIndex + 1; // 1-based
    const items = (state.assistCustom && state.assistCustom[dayId]) || [];
    const [picker, setPicker] = useState(null); // { block, index }

    function update(itemsNext) {
        dispatch({ type: 'SET_ASSIST_CUSTOM', dayId, items: itemsNext });
    }
    function resetDay() {
        const defaults = normalizeAssistance(templateKey, displayLift, state) || [];
        update(defaults.map(d => ({ id: d.id || d.name, name: d.name, sets: d.sets, reps: d.reps, block: d.block })));
    }
    function addExercise() {
        setPicker({ block: null, index: items.length });
    }
    return (
        <div className="mt-2 border border-gray-700 rounded-lg p-3 bg-gray-900/40 space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-300">Custom Assistance</span>
                <div className="flex gap-2">
                    <ToggleButton on={false} className="text-[10px] px-2 py-1" onClick={resetDay}>Reset</ToggleButton>
                    <ToggleButton on={false} className="text-[10px] px-2 py-1" onClick={addExercise}>Add</ToggleButton>
                </div>
            </div>
            <div className="space-y-1">
                {items.map((it, idx) => (
                    <AssistanceRow
                        key={it.id || idx}
                        item={it}
                        onChange={next => {
                            const copy = [...items]; copy[idx] = next; update(copy);
                        }}
                        onSwap={() => setPicker({ block: it.block || null, index: idx })}
                        onDelete={() => { const copy = items.filter((_, i) => i !== idx); update(copy); }}
                    />
                ))}
                {items.length === 0 && <div className="text-[11px] text-gray-500">No custom items yet.</div>}
            </div>
            {picker && (
                <div className="mt-2">
                    <AssistanceCatalogPicker
                        block={picker.block}
                        equipment={state.equipment || []}
                        onPick={pick => {
                            const next = { id: pick.id, name: pick.name, sets: pick.sets || 3, reps: pick.reps || 10, block: pick.block };
                            const copy = [...items];
                            if (picker.index < copy.length) copy[picker.index] = next; else copy.push(next);
                            update(copy);
                            setPicker(null);
                        }}
                        onClose={() => setPicker(null)}
                    />
                </div>
            )}
            <div className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-700">Target 50–100 reps per block; BBB at 30–50% TM.</div>
        </div>
    );
}
