import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgramV2 } from '../../contexts/ProgramContextV2.jsx';
import { buildMainSetsForLift, buildWarmupSets } from '../..'; // barrel export
import { roundToIncrement } from '../../../../lib/math/rounding.ts';
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
import { planConditioningFromState, normalizeConditioningModalities } from '../../../../lib/fiveThreeOne/conditioningPlanner.js';
import { selectTrainingMax } from '../../../../lib/selectors/programSelectors.js';

const LIFT_KEY_MAP = {
    Squat: 'squat',
    Bench: 'bench',
    Deadlift: 'deadlift',
    Press: 'press',
    Overhead: 'press'
};
const DISPLAY_LIFT_NAMES = { squat: 'Squat', bench: 'Bench', deadlift: 'Deadlift', press: 'Press' };

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

function TableBlock({ title, rows, units }) {
    if (!rows || !rows.length) return null;
    return (
        <div className="mt-4">
            <h4 className="text-sm md:text-base font-semibold mb-2 tracking-wide text-white">{title}</h4>
            <div className="overflow-x-auto rounded border border-gray-700">
                <table className="min-w-[420px] w-full text-xs md:text-sm">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <th className="text-left py-1.5 px-3 font-medium">% TM</th>
                            <th className="text-left py-1.5 px-3 font-medium">Reps</th>
                            <th className="text-left py-1.5 px-3 font-medium">Load</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i} className={`border-t border-gray-700 ${i % 2 ? 'bg-gray-900/80' : 'bg-gray-900'} text-gray-300`}>
                                <td className="py-1 px-3 font-mono text-gray-200">{r.pct}%</td>
                                <td className="py-1 px-3 font-mono">{r.reps}{r.amrap ? '+' : ''}</td>
                                <td className="py-1 px-3 font-mono text-gray-100">{r.weight}{units}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function useSafeNavigate() {
    try {
        return useNavigate();
    } catch {
        // Outside a Router (e.g., isolated unit test) – provide no-op
        return () => { };
    }
}

export default function Step4ReviewExport({ onReadyChange }) {
    const navigate = useSafeNavigate();
    const { state, dispatch } = useProgramV2();
    const [starting, setStarting] = useState(false);
    const [showTemplateExplainer, setShowTemplateExplainer] = useState(false);
    const [showChangeTemplate, setShowChangeTemplate] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState(null);
    const [confirmSwitch, setConfirmSwitch] = useState(false);
    const [weekIndex, setWeekIndex] = useState(0);
    const [exportError, setExportError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // Removed local errors/warnings state in favor of using comprehensiveValidation directly

    const effective = useMemo(() => deriveEffectiveConfig(state), [state]);

    // Normalized schedule days (custom design vs legacy schedule.order)
    const scheduleDesign = effective.schedule || {};
    const frequencyRaw = scheduleDesign.frequency || '4day';
    const frequency = typeof frequencyRaw === 'number' ? frequencyRaw : (frequencyRaw || '4day');
    // Normalize order to capitalized format for consistent validation
    const rawOrder = scheduleDesign.order || scheduleDesign.days || ['Press', 'Deadlift', 'Bench', 'Squat'];
    const order = rawOrder.map(lift => {
        // Convert to lowercase first, then capitalize properly
        const normalized = typeof lift === 'string' ? lift.toLowerCase() : lift;
        if (normalized === 'press') return 'Press';
        if (normalized === 'deadlift') return 'Deadlift';
        if (normalized === 'bench') return 'Bench';
        if (normalized === 'squat') return 'Squat';
        return lift; // fallback to original if unknown
    });
    const includeWarmups = scheduleDesign.includeWarmups !== false;
    const warmupScheme = scheduleDesign.warmupScheme || { percentages: [40, 50, 60], reps: [5, 5, 3] };

    // Unified training max map: prefer explicit state.trainingMaxes (kept in sync by reducer) then per-lift tm values
    const trainingMaxes = useMemo(() => ({
        squat: selectTrainingMax(state, 'squat'),
        bench: selectTrainingMax(state, 'bench'),
        deadlift: selectTrainingMax(state, 'deadlift'),
        press: selectTrainingMax(state, 'press')
    }), [state.trainingMaxes, effective.lifts?.squat?.tm, effective.lifts?.bench?.tm, effective.lifts?.deadlift?.tm, effective.lifts?.press?.tm]);

    // Declare variables before useMemo to avoid "Cannot access before initialization" error
    const supplemental = effective.supplemental || { strategy: 'none' };
    const assistance = effective.assistance || { mode: 'minimal' };
    const assistMode = state.assistMode || 'template';
    const assistCustom = state.assistCustom || {};

    // Comprehensive validation for Step 4
    const comprehensiveValidation = useMemo(() => {
        const errors = [];
        const warnings = [];

        // Training maxes validation
        const tmMap = state.trainingMaxes || effective.trainingMax || trainingMaxes || {};
        order.forEach(lift => {
            if (!tmMap[lift.toLowerCase()] || tmMap[lift.toLowerCase()] <= 0) {
                errors.push(`Training max for ${lift} is required`);
            }
        });

        // Schedule validation
        if (!effective.schedule?.order?.length) {
            errors.push('Training schedule not configured');
        }

        // Supplemental validation
        if (supplemental.strategy === 'bbb' && !supplemental.percentage) {
            warnings.push('BBB percentage not set - defaulting to 50%');
        }

        // Assistance validation
        if (assistance.mode === 'custom' && assistMode === 'template') {
            warnings.push('Assistance set to custom but using template mode');
        }

        return {
            isValid: errors.length === 0,
            hasWarnings: warnings.length > 0,
            errors,
            warnings
        };
    }, [effective, order, supplemental, assistance, assistMode]);

    // Update state based on validation results
    // Validation side-effects collapsed (was only mirroring comprehensiveValidation into local state)

    const roundingMode = typeof effective.rounding === 'string' ? effective.rounding : (effective.rounding?.mode || 'nearest');
    const roundingIncrement = typeof effective.rounding === 'object' ? (effective.rounding.increment || 5) : (effective.units === 'kg' ? 2.5 : 5);
    const units = effective.units === 'kg' ? 'kg' : 'lbs';
    const loadingOption = effective.loadingOption || effective.loading?.option || 1;
    const conditioning = effective.conditioning || {
        sessionsPerWeek: 3,
        hiitPerWeek: 2,
        modalities: { hiit: ['Prowler Pushes', 'Hill Sprints'], liss: ['Walking'] },
        note: 'Target 3–4 conditioning sessions (hill sprints / prowler). Keep after lifting or on off days.'
    };

    // Build a weekly conditioning session array (slim object) for export & per-day injection
    const plannedConditioning = useMemo(() => planConditioningFromState(state).map(s => ({
        day: s.day, mode: s.mode, modality: s.modality, notes: s.notes, prescription: s.prescription
    })), [state]);

    // Diagnostic: log any mismatch between schedule.order and rendered order (once per mount or when underlying changes)
    useEffect(() => {
        try {
            const schedOrder = state?.schedule?.order;
            if (!Array.isArray(schedOrder) || !schedOrder.length) return;
            const displaySched = schedOrder.map(l => l && l.charAt(0).toUpperCase() + l.slice(1));
            const mismatch = JSON.stringify(displaySched) !== JSON.stringify(order);
            if (mismatch) {
                if (typeof window !== 'undefined' && window?.localStorage?.getItem('debug.531.template') === 'off') return;
                // eslint-disable-next-line no-console
                console.info('[531:TEMPLATE_SYNC]', 'step4.orderMismatch', { scheduleOrder: displaySched, uiOrder: order });
            } else {
                if (typeof window !== 'undefined' && window?.localStorage?.getItem('debug.531.template') === 'off') return;
                // eslint-disable-next-line no-console
                console.info('[531:TEMPLATE_SYNC]', 'step4.orderAligned', { order: displaySched });
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[531:TEMPLATE_SYNC]', 'step4.orderCheckError', e.message);
        }
    }, [state?.schedule?.order, order]);

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

    // Removed unused percentMatrix

    function mapLiftDisplayName(liftDisplay) {
        const key = LIFT_KEY_MAP[liftDisplay] || liftDisplay.toLowerCase();
        return key;
    }

    function getTMForDisplayLift(display) {
        const key = mapLiftDisplayName(display);
        return trainingMaxes[key] || 0;
    }

    function getBbbPairLift(mainDisplay) {
        if (supplemental.pairing === 'same') return mainDisplay;
        // Opposite pairing map
        const map = { Press: 'Bench', Bench: 'Press', Squat: 'Deadlift', Deadlift: 'Squat' };
        return map[mainDisplay] || mainDisplay;
    }

    function getBbbExerciseName(liftDisplay) {
        const exerciseNames = {
            'Press': 'Overhead Press',
            'Bench': 'Bench Press',
            'Squat': 'Back Squat',
            'Deadlift': 'Deadlift'
        };
        return exerciseNames[liftDisplay] || liftDisplay;
    }

    // Build weeks JSON for export (optionally omit Deload week if user skipped)
    const weeksData = useMemo(() => {
        const skipDeload = state?.advanced?.skipDeload === true;
        const indexes = skipDeload ? [0, 1, 2] : [0, 1, 2, 3];
        const weeks = indexes.map(wi => {
            const daysData = order.map((displayLift) => {
                const tm = getTMForDisplayLift(displayLift);
                const warmups = buildWarmupSets({ includeWarmups, warmupScheme, tm, roundingIncrement, roundingMode, units });
                const main = buildMainSetsForLift({ tm, weekIndex: wi, option: loadingOption, roundingIncrement, roundingMode, units }).sets;
                let supplementalBlock = undefined;
                if (supplemental.strategy === 'bbb') {
                    const bbbTargetLiftDisplay = getBbbPairLift(displayLift);
                    const bbbTm = getTMForDisplayLift(bbbTargetLiftDisplay);
                    const bbbWeight = roundToIncrement(bbbTm * (supplemental.percentOfTM / 100), roundingIncrement, roundingMode);
                    const bbbExerciseName = getBbbExerciseName(bbbTargetLiftDisplay);
                    supplementalBlock = {
                        type: 'bbb',
                        exercise: bbbExerciseName,
                        targetLift: bbbTargetLiftDisplay,
                        sets: supplemental.sets, reps: supplemental.reps,
                        weight: bbbWeight, units,
                        percentOfTM: supplemental.percentOfTM
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
                // Conditioning: inject planned session if weekday matches; fallback to legacy placeholder when none
                let conditioningBlock = null;
                if (plannedConditioning.length) {
                    // Determine weekday label index wise (assume Mon/Tue/Thu/Fri for 4-day, sequential otherwise)
                    const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const weekday = defaultDays[idxForWeekday(order, displayLift, frequency)];
                    const match = plannedConditioning.find(pc => pc.day === weekday);
                    if (match) {
                        conditioningBlock = {
                            type: match.mode === 'hiit' ? 'HIIT' : 'LISS',
                            modality: match.modality,
                            minutes: match.prescription?.minutes || match.prescription?.duration || undefined,
                            intensity: match.prescription?.intensity || undefined,
                            notes: match.notes || undefined
                        };
                    }
                }
                if (!conditioningBlock) {
                    const cardioId = pickCardio(frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2, state || {});
                    const legacy = CardioTemplates[cardioId] || { type: 'LISS', minutes: 30 };
                    conditioningBlock = legacy;
                }
                return {
                    lift: displayLift,
                    warmups,
                    main,
                    supplemental: supplementalBlock,
                    assistance: assistanceComputed, // plain array for UI/export
                    conditioning: conditioningBlock
                };
            });
            return { week: wi + 1, deload: (!skipDeload && wi === 3), days: daysData };
        });
        return weeks;
    }, [order, includeWarmups, warmupScheme, roundingIncrement, roundingMode, units, supplemental, assistance, loadingOption, trainingMaxes, state?.bodyweight, state.templateKey, frequency, state?.advanced?.skipDeload, plannedConditioning, state]);

    // helper to map order index to a weekday label consistently (Mon/Tue/Thu/Fri default for 4-day classic split)
    function idxForWeekday(orderArr, liftDisplay, freq) {
        const i = orderArr.indexOf(liftDisplay);
        if (freq === '4day' || freq === 4) {
            // classic 4-day pressing & lower spacing: Mon/Tue/Thu/Fri
            return [0, 1, 3, 4][i] ?? i; // map Day3 -> Thu
        }
        if (freq === '3day' || freq === 3) {
            // Mon/Wed/Fri spacing
            return [0, 2, 4][i] ?? i;
        }
        if (freq === '2day' || freq === 2) {
            return [1, 4][i] ?? i; // Tue/Fri
        }
        return i;
    }

    // Derive template variant display name (BBB same‑lift special cases 50% start / 60% legacy)
    const isBBBSame = supplemental?.strategy === 'bbb' && supplemental.pairing === 'same';
    let templateVariantName = state.templateSpec?.name || state.templateKey || null;
    if (isBBBSame) {
        const pct = Number(supplemental.percentOfTM);
        if (pct === 50) templateVariantName = 'BBB 50% (Same-Lift Start)';
        else if (pct === 60) templateVariantName = 'BBB 60% (Same-Lift)';
    }

    const exportJson = useMemo(() => {
        const freqNum = frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2;
        const assistancePack = state.templateKey || state.assistance?.templateId || (assistance.mode === 'jack_shit' ? 'jack_shit' : 'triumvirate');
        return {
            meta: {
                schemaVersion: '1.0.0',
                catalogVersion: CATALOG_VERSION,
                createdAt: new Date().toISOString(),
                templateKey: state.flowMode === 'template' ? state.templateKey : null,
                templateName: templateVariantName || null,
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
            conditioning: conditioning ? {
                sessionsPerWeek: conditioning.sessionsPerWeek || conditioning.options?.frequency,
                hiitPerWeek: conditioning.hiitPerWeek || conditioning.options?.hiitPerWeek,
                modalities: normalizeConditioningModalities(
                    conditioning.modalities || {
                        hiit: conditioning.options?.hiitModalities,
                        liss: conditioning.options?.lissModalities
                    }
                ),
                note: conditioning.note,
                placement: conditioning.options?.placement || conditioning.placement,
                sessions: plannedConditioning
            } : undefined,
            supplemental,
            assistance,
            weeks: weeksData
        };
    }, [assistMode, state.pack, state.flowMode, state.templateKey, state.assistance?.templateId, state.schedule?.split4, state.advanced?.split4, state.equipment, units, loadingOption, trainingMaxes, state.rounding, roundingIncrement, roundingMode, frequency, order, includeWarmups, warmupScheme, supplemental, assistance, weeksData, templateVariantName, conditioning, plannedConditioning]);

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
            const blockWarnings = Object.entries(byBlock)
                .filter(entry => entry[1] > 100)
                .map(([blk]) => `High ${blk} volume (>100 reps)`);
            const warnings = [];
            if (blockWarnings.length) warnings.push(...blockWarnings);
            if (suppPctWarning) warnings.push('BBB >50% TM');
            return { mainReps, suppReps, assistReps, totalReps, mainTonnage, suppTonnage, totalTonnage, warnings };
        });
        // Dependencies cover anything affecting loads or reps
    }, [previewWeek, supplemental.percentOfTM, supplemental.strategy]);

    // Assistance editing (custom mode only)
    // Removed showAssistEditor (unused)

    async function handleStartProgram() {
        setStarting(true);
        try {
            const programPayload = exportJson; // already structured
            try {
                const { persistActiveCycle } = await import('../../../../lib/fiveThreeOne/persistCycle.js');
                persistActiveCycle(programPayload);
            } catch { /* ignore dynamic import issues */ }
            window.dispatchEvent(new CustomEvent('cycle:started'));
            navigate('/train');
        } finally {
            setStarting(false);
        }
    }

    return (
        <div className="space-y-8 text-sm md:text-base leading-6 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        <span className="text-white text-sm">Processing program...</span>
                    </div>
                </div>
            )}

            {/* Program Status */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-2">Step 4: Review & Export</h2>
                <p className="text-sm text-gray-400 mb-4">Final review of your 4-week 5/3/1 cycle before starting training.</p>

                {comprehensiveValidation.isValid ? (
                    <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-green-300 text-sm font-medium">Program Ready to Start</span>
                        </div>
                        {comprehensiveValidation.hasWarnings && (
                            <div className="mt-2 text-xs text-yellow-300">
                                {comprehensiveValidation.warnings.length} recommendation(s) below
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                            <div>
                                <div className="text-red-300 text-sm font-medium">
                                    {comprehensiveValidation.errors.length} issue(s) preventing start
                                </div>
                                <ul className="mt-1 space-y-1">
                                    {comprehensiveValidation.errors.map((error, idx) => (
                                        <li key={idx} className="text-red-200 text-xs">• {error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {comprehensiveValidation.hasWarnings && (
                    <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-yellow-400 mt-0.5" />
                            <div>
                                <div className="text-yellow-300 text-sm font-medium">Recommendations</div>
                                <ul className="mt-1 space-y-1">
                                    {comprehensiveValidation.warnings.map((warning, idx) => (
                                        <li key={idx} className="text-yellow-200 text-xs">• {warning}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Program Overview</h2>
                    <p className="text-gray-400 text-sm">Preview the full 4-week cycle, confirm details, then export or print.</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="px-2 py-1 rounded-full bg-gray-700/50 border border-gray-600 text-gray-300 tracking-wide">{frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2}-Day</span>
                        {templateVariantName && (
                            <span className="px-2 py-1 rounded-full bg-red-600/20 border border-red-500/60 text-red-300 tracking-wide">Template: {templateVariantName}</span>
                        )}
                        {frequency === '4day' && (state.schedule?.split4 || state.advanced?.split4) && (
                            <span className="px-2 py-1 rounded-full bg-gray-700/50 border border-gray-600 text-gray-300 tracking-wide">Split {(state.schedule?.split4 || state.advanced?.split4)}</span>
                        )}
                        <span className="px-2 py-1 rounded-full bg-gray-700/30 border border-gray-600 text-gray-400 italic" title="Wendler: 'Lift weights. Condition: run hills, push Prowler. Do this 3–4 times a week.'">Condition: hills / prowler 3–4x weekly (after lifts or off‑days) — keep easy enough to recover.</span>
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
                                <span>{templateVariantName || state.templateSpec.name}</span>
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
                        {weeksData.map((w, i) => (
                            <ToggleButton key={w.week} on={weekIndex === i} onClick={() => setWeekIndex(i)} className="text-xs px-4 py-2">
                                Week {w.week}{w.deload ? ' (Deload)' : ''}
                            </ToggleButton>
                        ))}
                    </div>

                    {previewWeek && (
                        <div className="space-y-6">
                            {previewWeek.days.map((day, idx) => {
                                // Map warmups/main into table row objects
                                const warmupRows = includeWarmups ? (day.warmups || []).map(w => ({ pct: w.percent, reps: w.reps, weight: w.weight })) : [];
                                const mainRows = (day.main || []).map(m => ({ pct: m.percent, reps: m.reps, weight: m.weight, amrap: !!m.amrap }));
                                return (
                                    <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base md:text-lg font-semibold text-white">Day {idx + 1} — {day.lift}</h3>
                                            {day.supplemental?.type === 'bbb' && (
                                                <span className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300 border border-red-500">BBB</span>
                                            )}
                                        </div>
                                        <TableBlock title="WARM-UPS" rows={warmupRows} units={units} />
                                        <TableBlock title="MAIN SETS" rows={mainRows} units={units} />
                                        {/* Supplemental */}
                                        {day.supplemental && day.supplemental.type === 'bbb' && (
                                            <div className="text-xs text-red-200 bg-red-900/10 border border-red-700/40 rounded p-3 font-mono">
                                                BBB {day.supplemental.exercise}: {day.supplemental.sets} × {day.supplemental.reps} @ {day.supplemental.weight}{units} ({day.supplemental.percentOfTM}% TM)
                                            </div>
                                        )}
                                        {/* Assistance */}
                                        {/* Assistance (inline condensed) */}
                                        <div className="mt-2">
                                            <div className="font-medium text-xs text-gray-300">Assistance</div>
                                            {Array.isArray(day.assistance) && day.assistance.length > 0 ? (
                                                <div className="text-[11px] opacity-80 text-gray-400 space-y-0.5">
                                                    {day.assistance.map((a, i) => (
                                                        <div key={i}>
                                                            {a.displayName ? a.displayName :
                                                                a.block ? (<><span className="text-gray-300 font-semibold">{a.block}:</span> {a.name} {a.sets}×{a.reps}</>) :
                                                                    (<>{a.name} {a.sets}×{a.reps}</>)
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-[11px] opacity-80 text-gray-500">
                                                    {state.templateKey === 'jack_shit' ? 'Main lift only' : 'None'}
                                                </div>
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
                                                    Legend: ⚠ badge appears when a category exceeds ~100 reps (soft guardrail). Aim for roughly 50–100 assistance reps per block. BBB recommended 50–60% TM (book range).
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                        <div className="text-xs text-gray-400 space-y-1">
                            <div>Loading Option: {loadingOption} {loadingOption === 1 ? '(Conservative)' : '(Aggressive)'}</div>
                            <div>Schedule: {(frequency === '4day' ? 4 : frequency === '3day' ? 3 : 2)} days – {order.join(' / ')}</div>
                            {state.deadliftRepStyle && <div>Deadlift Style: {state.deadliftRepStyle.replace('_', ' ')}</div>}
                            <div>Units: {units}</div>
                            {conditioning && (
                                <div className="pt-1 border-t border-gray-700/50">
                                    <div className="text-gray-300 font-medium mb-0.5">Conditioning Plan</div>
                                    <div className="text-[11px] leading-snug">
                                        Sessions Target: {conditioning.sessionsPerWeek || 3}{conditioning.sessionsPerWeek < 2 ? ' (below guideline – aim for ≥2)' : ''}<br />
                                        HIIT: {conditioning.hiitPerWeek || 0} · Modalities: {(conditioning.modalities?.hiit || []).join(', ') || '—'}<br />
                                        LISS: {Math.max(0, (conditioning.sessionsPerWeek || 0) - (conditioning.hiitPerWeek || 0))} · Modalities: {(conditioning.modalities?.liss || []).join(', ') || '—'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Export</h4>
                        <div className="flex flex-col space-y-2">
                            <ToggleButton on={false} disabled={!comprehensiveValidation.isValid} onClick={handleDownload} className="flex items-center justify-center gap-2 text-xs">
                                <Download className="w-4 h-4" /> <span>Download JSON</span>
                            </ToggleButton>
                            <ToggleButton on={copied} disabled={!comprehensiveValidation.isValid} onClick={handleCopy} className="flex items-center justify-center gap-2 text-xs">
                                <Copy className="w-4 h-4" /> <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                            </ToggleButton>
                            <ToggleButton on={false} disabled={!comprehensiveValidation.isValid} onClick={handlePrint} className="flex items-center justify-center gap-2 text-xs">
                                <Printer className="w-4 h-4" /> <span>Print</span>
                            </ToggleButton>
                            <ToggleButton
                                on={starting}
                                disabled={!comprehensiveValidation.isValid || starting}
                                onClick={async () => {
                                    if (!comprehensiveValidation.isValid) return;
                                    setIsLoading(true);
                                    try {
                                        await handleStartProgram();
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                className="flex items-center justify-center gap-2 text-xs !bg-green-600/30 !border-green-500/60 hover:!bg-green-600/40 disabled:!bg-gray-600/30 disabled:!border-gray-500/60"
                                data-testid="start-program"
                            >
                                {starting ? (
                                    <>
                                        <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                                        <span>Starting...</span>
                                    </>
                                ) : comprehensiveValidation.isValid ? (
                                    <span>Start Program</span>
                                ) : (
                                    <span>Fix Issues Above</span>
                                )}
                            </ToggleButton>
                            {exportError && <div className="text-xs text-red-400">{exportError}</div>}
                        </div>
                        {comprehensiveValidation.isValid && (
                            <div className="flex items-center space-x-2 text-green-400 text-xs"><CheckCircle2 className="w-4 h-4" /><span>Ready to start cycle.</span></div>
                        )}
                    </div>
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
                                    keepOpen={true}
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
                            const next = { id: pick.id, name: pick.name, sets: pick.sets || 5, reps: pick.reps || 10, block: pick.block }; // Default 5 sets for BBB compatibility
                            const copy = [...items];
                            if (picker.index < copy.length) copy[picker.index] = next; else copy.push(next);
                            update(copy);
                            // Modal stays open for easier multi-selection
                        }}
                        onClose={() => setPicker(null)}
                        keepOpen={true}
                    />
                </div>
            )}
            <div className="text-[10px] text-gray-500 italic pt-1 border-t border-gray-700">Target 50–100 reps per block; BBB at 30–50% TM.</div>
        </div>
    );
}
