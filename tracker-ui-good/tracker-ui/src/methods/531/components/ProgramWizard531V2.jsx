/**
 * ProgramWizard531V2.jsx - New V2 5/3/1 Wizard Shell
 * Clean, minimal wizard with step navigation and V2 context integration
 * 
 * This is the RESTORED and ENHANCED 5-step workflow that includes:
 * - Enhanced Section C (Programming Approach)
 * - Enhanced Section E (Assistance)
 * - Enhanced Section G (Conditioning)
 * 
 * The route /builder/531/v2 has been updated to use this component directly.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle2, Info, AlertTriangle, RotateCcw } from 'lucide-react';
import ToggleButton from './ToggleButton.jsx';
import { useNavigate, useParams } from "react-router-dom";
import { useProgramV2 } from "../contexts/ProgramContextV2.jsx";
import { buildMainSetsForLift, buildWarmupSets, roundToIncrement } from "../"; // barrel export
// Conditioning planner (HIIT/LISS distribution)
import { buildConditioningPlan, planConditioningFromState } from '../../../lib/fiveThreeOne/conditioningPlanner.js';
import { loadPack531BBB } from "../loadPack";
import { extractSupplementalFromPack, extractWarmups, extractWeekByLabel } from "../packAdapter";
import { applyDecisionsFromPack } from "../decisionAdapter";
import { mapTemplateAssistance, validateAssistanceVolume } from "../assistanceMapper";
import { buildSchedule, buildSchedule4Day, buildSchedule2Day, buildSchedule1Day, SPLIT_4DAY_A, SPLIT_4DAY_B } from "../schedule";
import { advanceCycle } from "../progression";
import { toUiDays } from "../scheduleRender";
import { computeWarmupsFromPack, computeMainFromPack, computeBBBFromConfig } from "../calc";

// Enable packs by default; allow kill-switch via env (Vite or CRA style)
// Avoid direct unguarded access to process.* in browser (Vite doesn't polyfill by default)
const viteFlag = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_METHOD_PACKS);
// Support legacy CRA-style var only if process object exists (SSR or test env)
const legacyFlag = (typeof process !== 'undefined' && process?.env?.REACT_APP_USE_METHOD_PACKS);
const envFlag = viteFlag ?? legacyFlag;
const USE_METHOD_PACKS = envFlag == null ? true : String(envFlag).toLowerCase() === 'true';

// --- Simplified deterministic Step 1 gating (only core fundamentals) ---
// Per spec: require 4 valid TMs, units, rounding, TM% (0.90 or 0.85). Allow dev bypass via env.
const LIFTS = ["squat", "bench", "deadlift", "press"];

function isStep1Complete(state) {
    if (!state) return false;
    // Accept both 'lb' and 'lbs' plus 'kg'
    const unitsOk = state?.units === "lbs" || state?.units === "lb" || state?.units === "kg";
    const roundingOk = !!state?.rounding;
    const tmPctRaw = state?.tmPercent ?? state?.tmPct ?? 90; // fallback to 90 if undefined (matches legacy default)
    const tmPct = Number(tmPctRaw);
    const tmPctOk = Number.isFinite(tmPct) && tmPct >= 80 && tmPct <= 95;
    // Build a tms object from current lifts if not already present
    const tmsSource = state?.tms || (() => {
        const out = {}; LIFTS.forEach(k => { out[k] = state?.lifts?.[k]?.tm; }); return out;
    })();
    const tmsOk = LIFTS.every(k => {
        const v = Number(tmsSource[k]);
        return Number.isFinite(v) && v > 0;
    });
    return unitsOk && roundingOk && tmPctOk && tmsOk;
}

function allowStep1Next(state) {
    const bypass =
        (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_RELAX_STEP1 === "true") ||
        (typeof process !== 'undefined' && process?.env?.REACT_APP_RELAX_STEP1 === "true");
    return bypass || isStep1Complete(state);
}
import Step1Fundamentals from './steps/Step1Fundamentals.jsx';
import Step2TemplateOrCustom from './steps/Step2TemplateOrCustom.jsx';
import Step3DesignCustom from './steps/Step3DesignCustom.jsx';
import Step4ReviewExport from './steps/Step4ReviewExport.jsx';
import Step5ProgressionSmart from './steps/Step5ProgressionSmart.jsx';

const STEPS = [
    { id: 'fundamentals', title: 'Fundamentals', description: 'Units, rounding, TM%, 1RM/rep tests' },
    { id: 'template', title: 'Template / Custom', description: 'Select template or continue custom' },
    { id: 'design', title: 'Design (if Custom)', description: 'Custom schedule, warm-ups, supplemental, assistance' },
    { id: 'review', title: 'Review & Export', description: 'Cycle preview, export & print' },
    { id: 'progress', title: 'Progress TMs', description: 'Week 4 done? Advance training maxes' }
];

function WizardShell() {
    const { stepNumber } = useParams();
    const navigate = useNavigate();

    // Initialize stepIndex from URL parameter
    const getStepIndexFromUrl = () => {
        const step = parseInt(stepNumber, 10);
        // Validate step number is in range [1-5], default to 1 if invalid
        if (step >= 1 && step <= 5) {
            return step - 1; // Convert 1-based to 0-based
        } else {
            // If invalid step number, redirect to step 1
            if (stepNumber && (step < 1 || step > 5 || isNaN(step))) {
                navigate('/builder/531/v2/step/1', { replace: true });
            }
            return 0; // Default to step 1 (index 0)
        }
    };

    const [stepIndex, setStepIndex] = useState(getStepIndexFromUrl);
    const [stepValidation, setStepValidation] = useState({ fundamentals: false, design: false, review: false, progress: true });
    // Step1 feedback state
    const [step1Error, setStep1Error] = useState(null); // string message
    const [step1Missing, setStep1Missing] = useState([]); // array of lift keys / field labels
    const [step1FlashToken, setStep1FlashToken] = useState(0); // increment to trigger child highlight
    const { state, dispatch } = useProgramV2();
    const packRef = useRef(null);

    // Sync stepIndex with URL parameter changes and update page title
    useEffect(() => {
        const urlStep = getStepIndexFromUrl();
        if (urlStep !== stepIndex) {
            setStepIndex(urlStep);
        }

        // Update page title based on current step
        const currentStepData = STEPS[urlStep] || STEPS[0];
        document.title = `${currentStepData.title} - 5/3/1 Builder V2`;

        return () => {
            // Reset title when component unmounts
            document.title = '5/3/1 Program Builder';
        };
    }, [stepNumber]); // Re-run when URL step parameter changes

    // Update URL when stepIndex changes programmatically
    const updateStepUrl = (newStepIndex) => {
        const stepNumber = newStepIndex + 1; // Convert 0-based to 1-based
        navigate(`/builder/531/v2/step/${stepNumber}`, { replace: true });
    };
    // Packs always on unless env kill-switch disables

    // Enhanced step validation helper functions
    const getStepWarnings = (stepIndex) => {
        const warnings = [];
        const errors = [];

        switch (stepIndex) {
            case 0: // Fundamentals
                if (!state?.units) errors.push("Units (lbs/kg) required");
                if (!state?.rounding) errors.push("Rounding preference required");
                {
                    // Accept tmPercent (new) or tmPct (legacy); validate numeric range
                    const tmPctRaw = state?.tmPercent ?? state?.tmPct;
                    const tmPctNum = Number(tmPctRaw);
                    if (!(Number.isFinite(tmPctNum) && tmPctNum >= 80 && tmPctNum <= 95)) {
                        errors.push("Training max percentage (80-95%) required");
                    }
                }

                const tmsSource = state?.tms || {};
                LIFTS.forEach(lift => {
                    const tm = Number(tmsSource[lift] || state?.lifts?.[lift]?.tm);
                    if (!Number.isFinite(tm) || tm <= 0) {
                        errors.push(`${lift.charAt(0).toUpperCase() + lift.slice(1)} training max required`);
                    }
                });
                break;

            case 1: // Template/Custom
                if (!state?.templateKey && !state?.schedule?.frequency) {
                    errors.push("Select a template or configure custom schedule");
                }
                if (state?.templateKey && !isStep1Complete(state)) {
                    errors.push("Complete Step 1 before using templates");
                }
                if (state?.templateKey) {
                    warnings.push("Template selected - ready to apply configuration");
                } else if (!state?.schedule?.frequency) {
                    warnings.push("Custom path chosen - configure schedule in next step");
                }
                break;

            case 2: // Design Custom
                if (!state?.templateKey) { // Only validate if not using template
                    if (!state?.schedule?.frequency) {
                        errors.push("Training frequency not set");
                    } else {
                        warnings.push(`${state.schedule.frequency}-day schedule configured`);
                    }

                    if (!state?.supplemental?.strategy || state?.supplemental?.strategy === 'none') {
                        warnings.push("Supplemental work not configured");
                    } else {
                        warnings.push(`${state.supplemental.strategy.toUpperCase()} supplemental configured`);
                    }

                    if (!state?.assistance?.mode || state?.assistance?.mode === 'minimal') {
                        warnings.push("Assistance exercises not configured");
                    } else {
                        warnings.push(`${state.assistance.mode} assistance configured`);
                    }
                } else {
                    warnings.push("Template applied - custom design skipped");
                }
                break;

            case 3: // Review & Export
                if (!isStep1Complete(state)) {
                    errors.push("Training maxes incomplete");
                }
                if (!state?.schedule?.frequency && !state?.templateKey) {
                    errors.push("No training schedule configured");
                }
                if (state?.templateKey) {
                    warnings.push(`Using ${state.templateKey.toUpperCase()} template`);
                } else {
                    if (state?.schedule?.frequency) {
                        warnings.push(`Custom ${state.schedule.frequency}-day program`);
                    }
                }
                if (!state?.advanced?.generatedProgram) {
                    warnings.push("Program ready to generate");
                } else {
                    warnings.push("Program generated - ready for export");
                }
                break;

            case 4: // Progress
                if (!state?.advanced?.generatedProgram) {
                    warnings.push("Generate program first in Review step");
                }
                if (!state?.amrapWk3 || Object.keys(state.amrapWk3).length === 0) {
                    warnings.push("Enter Week 3 AMRAP results to calculate new training maxes");
                } else {
                    warnings.push("AMRAP data entered - training maxes ready to advance");
                }
                break;
        }

        return { errors, warnings, hasIssues: errors.length > 0 || warnings.length > 0 };
    };

    // Reset step function with confirmation
    const resetStep = (stepIndex) => {
        const stepName = STEPS[stepIndex].title;
        const confirmed = window.confirm(`Reset ${stepName} to defaults?\n\nThis will clear all data for this step and cannot be undone.`);

        if (!confirmed) return;

        switch (stepIndex) {
            case 0: // Fundamentals
                dispatch({ type: 'RESET_FUNDAMENTALS' });
                break;
            case 1: // Template/Custom
                dispatch({ type: 'SET_TEMPLATE_KEY', templateKey: null });
                dispatch({ type: 'SET_SCHEDULE', schedule: {} });
                break;
            case 2: // Design Custom
                dispatch({ type: 'SET_SCHEDULE', schedule: {} });
                dispatch({ type: 'SET_SUPPLEMENTAL', supplemental: { strategy: 'none' } });
                dispatch({ type: 'SET_ASSISTANCE', assistance: { mode: 'minimal' } });
                dispatch({ type: 'SET_CONDITIONING', conditioning: {} });
                break;
            case 3: // Review & Export
                // Reset any program generation state
                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), generatedProgram: null } });
                break;
            case 4: // Progress
                dispatch({ type: 'SET_AMRAP_WK3', payload: {} });
                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), progressData: null } });
                break;
        }

        // Show success feedback
        setStep1FlashToken(prev => prev + 1); // Reuse flash system for visual feedback
    };

    // Optional future pack loading (no behavior change while flag is false)
    useEffect(() => {
        let cancelled = false;
        async function maybeLoadPack() {
            if (!USE_METHOD_PACKS) return; // kill-switch path
            const pack = await loadPack531BBB();
            if (!cancelled && pack) {
                packRef.current = pack;
                console.info("Loaded 531 BBB pack:", pack);
                // Decision adapter (feature flagged) – translate current UI answers into state merges
                try {
                    const answers = {
                        daysPerWeek: state?.schedule?.frequency || state?.daysPerWeek || 4,
                        assistanceChoice: state?.assistanceTemplate || state?.templateKey || 'BBB',
                        tmMethod: state?.tmMethod || 'known_1rm'
                    };
                    const decision = applyDecisionsFromPack({ pack, answers });
                    if (decision) {
                        // Schedule mode -> update schedule.frequency if changed
                        if (decision.scheduleMode) {
                            const currentFreq = state?.schedule?.frequency;
                            const nextFreqMap = { '4day': 4, '3day': 3, '2day': 2, '1day': 1 };
                            const nextFreq = nextFreqMap[decision.scheduleMode];
                            if (nextFreq && nextFreq !== currentFreq) {
                                dispatch({ type: 'SET_SCHEDULE', schedule: { ...(state?.schedule || {}), frequency: nextFreq } });
                            }
                            // Build schedule preview whenever we have a scheduleMode we recognize (3day|4day)
                            if (decision.scheduleMode === '3day') {
                                const liftOrder = ["press", "deadlift", "bench", "squat"]; // canonical order
                                const sched = buildSchedule({ mode: '3day', liftOrder });
                                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), schedulePreview: sched } });
                                console.info("531 schedule preview (3day):", sched);
                            } else if (decision.scheduleMode === '4day') {
                                // Build lightweight 4-day current-week preview (week1 by default)
                                const sched4 = buildSchedule4Day({ state, pack, split: SPLIT_4DAY_A, weekLabel: '3x5' });
                                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), schedulePreview: sched4 } });
                                console.info("531 schedule preview (4day):", sched4);
                            }
                        }
                        // Template id capture (non-destructive)
                        if (decision.templateId && decision.templateId !== state?.templateId) {
                            dispatch({ type: 'SET_TEMPLATE', template: decision.templateId });
                        }
                        // TM method future use (store in advanced)
                        if (decision.tmMethod && decision.tmMethod !== state?.advanced?.tmMethod) {
                            dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), tmMethod: decision.tmMethod } });
                        }
                    }
                } catch (e) {
                    console.warn('Decision adapter error', e);
                }
                const sup = extractSupplementalFromPack(pack, "bbb50");
                if (sup) {
                    // Dispatch only supplemental fields (non-destructive)
                    dispatch({
                        type: 'SET_SUPPLEMENTAL', supplemental: {
                            strategy: sup.mode === 'bbb' ? 'bbb' : (sup.mode || 'none'),
                            pairing: sup.pairing,
                            percentOfTM: sup.intensity?.value || 60,
                            sets: sup.sets,
                            reps: sup.reps,
                            _pack: sup._provenance
                        }
                    });
                }
                // Assistance mapping from selected template (only if no custom assistance already)
                try {
                    const selectedTemplateId = state?.templateKey || state?.template || 'bbb50';
                    const tpl = (pack.templates || []).find(t => t.id === selectedTemplateId);
                    if (tpl?.effects?.assistance && (!state?.assistance || state.assistance.mode === 'minimal')) {
                        const items = mapTemplateAssistance(tpl.effects.assistance);
                        const issues = validateAssistanceVolume(items);
                        dispatch({ type: 'SET_ASSISTANCE', assistance: { mode: 'template', templateId: selectedTemplateId, items, issues: issues.length ? issues : undefined } });
                    }
                } catch (e) {
                    console.warn('Assistance mapping error', e);
                }

                // Warmups (store into schedule.warmupScheme if different)
                const wu = extractWarmups(pack);
                if (Array.isArray(wu)) {
                    const currentWU = state?.schedule?.warmupScheme;
                    const nextWU = { percentages: wu.map(w => w.value), reps: wu.map(w => w.reps) };
                    const sameWU = currentWU && JSON.stringify(currentWU) === JSON.stringify(nextWU);
                    if (!sameWU) {
                        dispatch({ type: 'SET_SCHEDULE', schedule: { ...(state?.schedule || {}), warmupScheme: nextWU, includeWarmups: true } });
                    }
                }
                // Main sets percent table for current active week label (derive from stepIndex for simplicity)
                const weekLabelMap = ['3x5', '3x3', '5/3/1', 'Deload'];
                const currentWeekLabel = weekLabelMap[0]; // default for config; detailed preview uses engine still
                const wk = extractWeekByLabel(pack, currentWeekLabel);
                if (wk?.main && Array.isArray(wk.main)) {
                    // Store a lightweight capture for potential future use (e.g., state.previewWeekMain)
                    const existing = state?.previewWeekMain;
                    const asSimple = wk.main.map(m => ({ value: m.value, reps: m.reps, amrap: !!m.amrap }));
                    if (!existing || JSON.stringify(existing) !== JSON.stringify(asSimple)) {
                        dispatch({ type: 'SET_LOADING_OPTION', option: state?.loadingOption || state?.loading?.option || 1 }); // noop preserve
                        // Attach via a generic advanced field to avoid schema churn
                        dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), packMainWeek0: asSimple } });
                    }
                }
            }
        }
        maybeLoadPack();
        return () => { cancelled = true; };
    }, []);
    // Auto rebuild schedulePreview whenever core dependencies change (daysPerWeek, split4, equipment, week, cycle, units, rounding, tmPct, tms, templateKey)
    useEffect(() => {
        const daysPerWeek = Number(state?.daysPerWeek || state?.schedule?.frequency || 4);
        const splitVal = state?.advanced?.split4 || state?.schedule?.split4 || 'A';
        const split = splitVal === 'B' ? SPLIT_4DAY_B : SPLIT_4DAY_A;
        const pack = packRef.current;
        // Assistance pack default fallback (avoid empty assistance unless explicitly jack_shit)
        if (!state?.templateKey && (!state?.assistance || state.assistance.mode === 'minimal')) {
            // Set a default templateKey (triumvirate) silently once
            dispatch({ type: 'SET_TEMPLATE_KEY', payload: 'triumvirate' });
        }
        let sched;
        try {
            if (daysPerWeek === 4) sched = buildSchedule4Day({ state, pack, split, weekLabel: '3x5' });
            else if (daysPerWeek === 3) sched = buildSchedule({ mode: '3day', liftOrder: ["press", "deadlift", "bench", "squat"], state });
            else if (daysPerWeek === 2) sched = buildSchedule2Day({ state, pack, split, weekLabel: '3x5' });
            else if (daysPerWeek === 1) sched = buildSchedule1Day({ state, pack, split, weekLabel: '3x5' });
        } catch (e) {
            console.warn('schedulePreview rebuild failed', e);
        }
        if (sched) {
            dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), split4: splitVal, schedulePreview: sched } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.daysPerWeek, state.advanced?.split4, state.schedule?.split4, state.week, state.cycle, state.units, state.rounding, state.tmPct, state.lifts?.squat?.tm, state.lifts?.bench?.tm, state.lifts?.deadlift?.tm, state.lifts?.press?.tm, state.equipment, state.templateKey, state.assistance?.mode, state.assistance?.templateId]);
    function humanLiftName(key) {
        return key === "press" ? "Press" : key[0].toUpperCase() + key.slice(1);
    }
    function oppositeOf(liftKey) {
        if (liftKey === "press") return "bench";
        if (liftKey === "bench") return "press";
        if (liftKey === "squat") return "deadlift";
        if (liftKey === "deadlift") return "squat";
        return liftKey;
    }

    function handleStartCycle() {
        const {
            units = "lbs",
            rounding = { increment: 5, mode: "nearest" },
            loadingOption = 1,
            schedule = {},
            supplemental = { strategy: "none" },
            assistance = { mode: "minimal" },
            flowMode,
            templateKey,
            conditioning: conditioningState
        } = state || {};

        // Derive training maxes from current lift TMs in context (state does not store a standalone trainingMaxes object)
        const trainingMaxes = {
            squat: state?.lifts?.squat?.tm || 0,
            bench: state?.lifts?.bench?.tm || 0,
            deadlift: state?.lifts?.deadlift?.tm || 0,
            press: state?.lifts?.press?.tm || 0
        };

        const tmKeys = ["squat", "bench", "deadlift", "press"];
        const tmOk = tmKeys.every(k => Number(trainingMaxes?.[k]) > 0);
        if (!tmOk) return;

        const freq = Number(schedule?.frequency || 4);
        const defaultDays = ["press", "deadlift", "bench", "squat"];
        const days = Array.isArray(schedule?.days) && schedule.days.length === freq
            ? schedule.days
            : defaultDays.slice(0, freq);

        // Unified planned conditioning (supports Step6 advanced config or legacy simple fields)
        const plannedConditioning = planConditioningFromState(state).map(s => ({
            day: s.day,
            mode: s.mode,
            modality: s.modality,
            prescription: s.prescription,
            notes: s.notes
        }));

        function weekdayIndexMap(i, freq) {
            // Map training day index -> weekday index (Mon=0 .. Sun=6) similar to Step4ReviewExport
            if (freq === 4) return [0, 1, 3, 4][i] ?? i; // Mon/Tue/Thu/Fri
            if (freq === 3) return [0, 2, 4][i] ?? i;     // Mon/Wed/Fri
            if (freq === 2) return [1, 4][i] ?? i;        // Tue/Fri
            return i; // fallback sequential
        }
        const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Normalize rounding (state.rounding may be a string from Step1Fundamentals or an object from legacy/other flows)
        const roundingConfig = typeof rounding === 'object'
            ? { increment: rounding.increment || (units === 'kg' ? 2.5 : 5), mode: rounding.mode || 'nearest' }
            : { increment: units === 'kg' ? 2.5 : 5, mode: rounding || 'nearest' };

        const weeks = [];
        for (let w = 0; w < 4; w++) {
            const daysOut = days.map((liftKey, idx) => {
                const tm = Number(trainingMaxes?.[liftKey] || 0);

                const warmups = buildWarmupSets({
                    includeWarmups: !!schedule?.includeWarmups,
                    warmupScheme: schedule?.warmupScheme,
                    tm,
                    roundingIncrement: roundingConfig.increment,
                    roundingMode: roundingConfig.mode,
                    units
                });

                const main = buildMainSetsForLift({
                    tm,
                    weekIndex: w,
                    option: loadingOption || 1,
                    roundingIncrement: roundingConfig.increment,
                    roundingMode: roundingConfig.mode,
                    units
                });

                let supplementalOut = null;
                if (supplemental?.strategy === "bbb") {
                    const pairing = supplemental?.pairing || "same";
                    const bbbLiftKey = pairing === "opposite" ? oppositeOf(liftKey) : liftKey;
                    const bbbTm = Number(trainingMaxes?.[bbbLiftKey] || 0);
                    const pct = Number(supplemental?.percentOfTM || 50);
                    const raw = bbbTm * (pct / 100);
                    const weight = roundToIncrement(raw, roundingConfig.increment, roundingConfig.mode);
                    supplementalOut = {
                        type: "bbb",
                        pairing,
                        liftKey: bbbLiftKey,
                        sets: 5,
                        reps: 10,
                        percentOfTM: pct,
                        weight,
                        units
                    };
                }

                let assistanceOut = { mode: assistance?.mode || "minimal" };
                if (assistanceOut.mode === "custom" && assistance?.customPlan?.[liftKey]) {
                    assistanceOut.custom = assistance.customPlan[liftKey].map(item => ({
                        name: item.name,
                        sets: item.sets,
                        reps: item.reps
                    }));
                }

                // Conditioning: inject matching planned session for this weekday (single plan repeated across weeks)
                let conditioningBlock = undefined;
                if (plannedConditioning.length) {
                    const weekday = weekdayNames[weekdayIndexMap(idx, freq)] || weekdayNames[0];
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

                return {
                    day: idx + 1,
                    liftKey,
                    lift: humanLiftName(liftKey),
                    warmups,
                    main,
                    // Always provide a supplemental object (prevents downstream undefined access)
                    supplemental: supplementalOut || { type: 'none', sets: 0, reps: 0, percentOfTM: null },
                    assistance: assistanceOut,
                    conditioning: conditioningBlock
                };
            });
            weeks.push({ week: w + 1, days: daysOut });
        }

        const tmPctRaw = state?.tmPercent ?? state?.tmPct ?? 90;
        const tmPct = Number(tmPctRaw);
        const payload = {
            meta: {
                createdAt: new Date().toISOString(),
                templateKey: templateKey || null,
                flowMode: flowMode || "custom",
                units,
                loadingOption,
                tmPercent: tmPct
            },
            trainingMaxes,
            rounding: { increment: roundingConfig.increment, mode: roundingConfig.mode },
            schedule: {
                frequency: freq,
                days,
                includeWarmups: !!schedule?.includeWarmups,
                warmupScheme: schedule?.warmupScheme || null
            },
            supplemental: supplemental || { strategy: "none" },
            assistance: assistance || { mode: "minimal" },
            conditioning: conditioningState ? { ...conditioningState, sessions: plannedConditioning } : undefined,
            weeks
        };

        try {
            localStorage.setItem("ph531.activeProgram.v2", JSON.stringify(payload));
            navigate("/program/531/active");
        } catch (e) {
            console.error("Failed to save active program:", e);
        }
    }

    const markComplete = (id) => setStepValidation(prev => ({ ...prev, [id]: true }));

    const currentStep = STEPS[stepIndex];
    const canGoNext = (() => {
        if (currentStep.id === 'fundamentals') return allowStep1Next(state); // new single source of truth
        if (currentStep.id === 'design') return stepValidation.design;
        if (currentStep.id === 'review') return stepValidation.review;
        if (currentStep.id === 'progress') return stepValidation.progress;
        return false;
    })() && stepIndex < STEPS.length - 1;
    const canGoBack = stepIndex > 0;

    const handleStepValidation = useCallback((stepId, isValid) => {
        setStepValidation(prev => {
            const prevVal = prev[stepId];
            if (prevVal === isValid) return prev; // guard: no state update if unchanged
            return { ...prev, [stepId]: isValid };
        });
    }, []);

    const handleNext = () => {
        if (canGoNext) {
            // Clear any prior error context when advancing
            if (stepIndex === 0) {
                setStep1Error(null);
                setStep1Missing([]);
            }
            const nextStep = stepIndex + 1;
            setStepIndex(nextStep);
            updateStepUrl(nextStep);
            return;
        }
        // If user clicked while disabled on Step 1, surface guidance
        if (stepIndex === 0 && !canGoNext) {
            const missing = [];
            if (!(state?.units === 'lbs' || state?.units === 'lb' || state?.units === 'kg')) missing.push('units');
            if (!state?.rounding) missing.push('rounding');
            {
                const _tmPctRaw = state?.tmPercent ?? state?.tmPct ?? 90;
                const _tmPct = Number(_tmPctRaw);
                if (!(Number.isFinite(_tmPct) && _tmPct >= 80 && _tmPct <= 95)) missing.push('TM %');
            }
            const liftsMissing = [];
            for (const k of LIFTS) {
                const tm = state?.lifts?.[k]?.tm;
                if (!(Number.isFinite(tm) && tm > 0)) liftsMissing.push(k);
            }
            if (liftsMissing.length) missing.push(...liftsMissing.map(l => `${l} TM`));
            setStep1Missing(missing);
            const msg = missing.length ? `Still need: ${missing.join(', ')}` : 'Complete all required fields to continue.';
            setStep1Error(msg);
            // trigger child highlight animation
            setStep1FlashToken(t => t + 1);
            // auto-clear after delay
            setTimeout(() => {
                setStep1Error(null);
            }, 4000);
        }
    };

    const handleBack = () => {
        if (canGoBack) {
            const prevStep = stepIndex - 1;
            setStepIndex(prevStep);
            updateStepUrl(prevStep);
        }
    };

    const handleStepClick = (index) => {
        // Allow clicking on current or previous steps only
        if (index <= stepIndex) {
            setStepIndex(index);
            updateStepUrl(index);
        }
    };

    // Placeholder: progression trigger (would be invoked after reviewing Week 4 / Deload completion)
    function onAdvanceCycle(amrapWk3 = {}, includeMap) {
        const forcePass = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PROGRESS_FORCE_PASS === 'true');
        const repsMap = forcePass ? {} : amrapWk3; // empty map => treat all as pass
        // We don't have direct state setter (using reducer) so dispatch an advanced patch capturing next TMs
        const nextState = advanceCycle({
            ...state,
            tms: Object.fromEntries(Object.entries(state.lifts || {}).map(([k, v]) => [k, v?.tm || 0]))
        }, { amrapWk3: repsMap });
        // If selective include map provided, override nextState.tms accordingly
        if (includeMap && Object.keys(includeMap).some(k => includeMap[k] === false)) {
            for (const lift of Object.keys(nextState.lifts || {})) {
                if (includeMap[lift] === false) {
                    // revert TM for excluded lift to previous value
                    const prevTm = state.lifts?.[lift]?.tm || 0;
                    nextState.lifts[lift].tm = prevTm;
                    nextState.tms[lift] = prevTm;
                }
            }
        }
        // Apply updated lift TMs
        for (const lift of Object.keys(nextState.lifts || {})) {
            const tmVal = nextState.lifts[lift].tm;
            dispatch({ type: 'SET_TM', lift, tm: tmVal });
        }
        dispatch({ type: 'SET_ADVANCED', advanced: { ...(state.advanced || {}), cycle: nextState.cycle } });
        console.info('Cycle advanced:', { cycle: nextState.cycle, nextTms: nextState.tms });
    }

    // Hoisted hook: avoid calling useCallback inside conditional render paths
    const onFundamentalsValidChange = useCallback((isValid) => handleStepValidation('fundamentals', isValid), [handleStepValidation]);

    const renderStepContent = () => {
        switch (stepIndex) {
            case 0:
                return (
                    <Step1Fundamentals onValidChange={onFundamentalsValidChange} flashToken={step1FlashToken} missing={step1Missing} />
                );
            case 1:
                return (
                    <Step2TemplateOrCustom
                        onChoose={(mode) => {
                            markComplete('template');
                            if (mode === 'custom') {
                                setStepIndex(2); // go to design
                                updateStepUrl(2);
                            }
                        }}
                        onAutoNext={() => {
                            // Jump straight to review (index 3)
                            setStepIndex(3);
                            updateStepUrl(3);
                        }}
                        extraControls={<div className="mt-4 space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs uppercase tracking-wide text-gray-400">Days per week</label>
                                    <span className="text-[10px] text-gray-500">Choose 1-4</span>
                                </div>
                                <div className="flex gap-2 flex-wrap" role="group" aria-label="Days per week">
                                    {[1, 2, 3, 4].map(d => (
                                        <ToggleButton
                                            key={d}
                                            on={Number(state?.daysPerWeek || 4) === d}
                                            aria-label={`${d} day${d > 1 ? 's' : ''}`}
                                            onClick={() => {
                                                const val = d;
                                                dispatch({ type: 'SET_DAYS_PER_WEEK', payload: val });
                                                const split = state?.split4 === 'B' ? SPLIT_4DAY_B : SPLIT_4DAY_A;
                                                const pack = packRef.current;
                                                let sched;
                                                if (val === 4) sched = buildSchedule4Day({ state: { ...state, daysPerWeek: val }, pack, split, weekLabel: '3x5' });
                                                else if (val === 3) sched = buildSchedule({ mode: '3day', liftOrder: ["press", "deadlift", "bench", "squat"] });
                                                else if (val === 2) sched = buildSchedule2Day({ state: { ...state, daysPerWeek: val }, pack, split, weekLabel: '3x5' });
                                                else sched = buildSchedule1Day({ state: { ...state, daysPerWeek: val }, pack, split, weekLabel: '3x5' });
                                                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), schedulePreview: sched } });
                                            }}
                                        >{d}</ToggleButton>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs uppercase tracking-wide text-gray-400">4-day Split</label>
                                    <span className="text-[10px] text-gray-500">For 4-day</span>
                                </div>
                                <div className="flex gap-2 flex-wrap" role="group" aria-label="4-day split">
                                    {['A', 'B'].map(code => (
                                        <ToggleButton
                                            key={code}
                                            on={(state?.split4 || 'A') === code}
                                            aria-label={`Split ${code}`}
                                            onClick={() => {
                                                const splitVal = code;
                                                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), split4: splitVal } });
                                                const split = splitVal === 'B' ? SPLIT_4DAY_B : SPLIT_4DAY_A;
                                                const val = Number(state?.daysPerWeek || 4);
                                                const pack = packRef.current;
                                                let sched;
                                                if (val === 4) sched = buildSchedule4Day({ state: { ...state }, pack, split, weekLabel: '3x5' });
                                                else if (val === 3) sched = buildSchedule({ mode: '3day', liftOrder: ["press", "deadlift", "bench", "squat"] });
                                                else if (val === 2) sched = buildSchedule2Day({ state: { ...state }, pack, split, weekLabel: '3x5' });
                                                else sched = buildSchedule1Day({ state: { ...state }, pack, split, weekLabel: '3x5' });
                                                dispatch({ type: 'SET_ADVANCED', advanced: { ...(state?.advanced || {}), split4: splitVal, schedulePreview: sched } });
                                            }}
                                        >{code === 'A' ? 'A: P/D/B/S' : 'B: B/S/P/D'}</ToggleButton>
                                    ))}
                                </div>
                            </div>
                        </div>}
                    />
                );
            case 2:
                return (
                    <Step3DesignCustom onValidChange={(ok) => handleStepValidation('design', ok)} />
                );
            case 3:
                return (
                    <Step4ReviewExport onReadyChange={(ok) => handleStepValidation('review', ok)} />
                );
            case 4:
                return (
                    <Step5ProgressionSmart
                        onAdvance={(includeMap, customState) => {
                            // Use custom progression logic if provided, otherwise use standard
                            if (customState?.customIncrements) {
                                // Apply custom increments using advanceCycleSelective
                                const nextState = advanceCycleSelective(state, {
                                    amrapWk3: state?.amrapWk3 || {},
                                    include: includeMap,
                                    customIncrements: customState.customIncrements
                                });

                                // Update the state with the new TMs and cycle info
                                Object.entries(nextState.lifts || {}).forEach(([lift, liftData]) => {
                                    dispatch({ type: 'SET_TM', lift, tm: liftData.tm });
                                });

                                // Update cycle and history
                                dispatch({ type: 'SET_CYCLE', cycle: nextState.cycle });
                                dispatch({ type: 'SET_WEEK', week: nextState.week });
                                dispatch({ type: 'SET_HISTORY', history: nextState.history });
                            } else {
                                // Use standard progression
                                onAdvanceCycle(state?.amrapWk3 || {}, includeMap);
                            }
                        }}
                    />
                );
            default:
                return <div className="text-red-400">Unknown step</div>;
        }
    };

    // One-time debug insight for Step 1 gating each render (cheap; aids troubleshooting)
    if (currentStep.id === 'fundamentals') {
        // eslint-disable-next-line no-console
        console.debug("Step1 validation:", {
            canNext: allowStep1Next(state), stateSnapshot: {
                units: state?.units,
                rounding: state?.rounding,
                tmPct: state?.tmPct,
                tmPercent: state?.tmPercent,
                tms: LIFTS.reduce((acc, k) => { acc[k] = state?.lifts?.[k]?.tm || null; return acc; }, {})
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                                5/3/1 Program Builder V2
                                {state?.advanced?.schedulePreview?.mode === '3day' && (
                                    <span className="ml-3 inline-flex items-center rounded-full border border-red-500/40 bg-red-600/10 px-2 py-0.5 text-xs text-red-300">
                                        3-day rotation (5 weeks)
                                    </span>
                                )}
                            </h1>
                            <p className="text-gray-400">Jim Wendler's proven strength training methodology</p>
                        </div>
                        {/* Packs enabled by default; set VITE_USE_METHOD_PACKS=false or REACT_APP_USE_METHOD_PACKS=false to disable */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Navigation */}
                    <aside className="lg:col-span-3">
                        <nav className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-300 mb-4 uppercase tracking-wide">
                                Steps
                            </h3>
                            <ol className="space-y-1">
                                {STEPS.map((step, index) => {
                                    const isCurrent = index === stepIndex;
                                    const isCompleted = stepValidation[step.id];
                                    const isPast = index < stepIndex;
                                    const isAccessible = index <= stepIndex;

                                    return (
                                        <li key={step.id}>
                                            <button
                                                onClick={() => handleStepClick(index)}
                                                disabled={!isAccessible}
                                                className={`w-full text-left px-3 py-3 rounded transition-colors ${isCurrent
                                                    ? 'bg-red-600/20 border border-red-500/50 text-white'
                                                    : isAccessible
                                                        ? 'hover:bg-gray-700/50 border border-transparent text-gray-300'
                                                        : 'opacity-40 cursor-not-allowed border border-transparent text-gray-500'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs uppercase tracking-wide text-gray-400">
                                                        Step {index + 1}
                                                    </span>
                                                    {(isCompleted || isPast) && (
                                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                    )}
                                                </div>
                                                <div className="font-medium">{step.title}</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {step.description}
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-9">
                        <div className="space-y-6">
                            {/* Step Header with Reset Button and Validation */}
                            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">
                                            Step {stepIndex + 1}: {STEPS[stepIndex].title}
                                        </h2>
                                        <p className="text-sm text-gray-400 mt-1">
                                            {STEPS[stepIndex].description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => resetStep(stepIndex)}
                                        className="text-xs text-gray-400 hover:text-white cursor-pointer flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
                                        title={`Reset ${STEPS[stepIndex].title}`}
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        Reset
                                    </button>
                                </div>

                                {(() => {
                                    const validation = getStepWarnings(stepIndex);
                                    if (validation.hasIssues) {
                                        return (
                                            <div className="space-y-2">
                                                {validation.errors.length > 0 && (
                                                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                                                        <div className="flex items-start gap-2">
                                                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <div className="text-red-300 text-sm font-medium">
                                                                    {validation.errors.length} required field(s) missing
                                                                </div>
                                                                <ul className="mt-1 space-y-1">
                                                                    {validation.errors.map((error, idx) => (
                                                                        <li key={idx} className="text-red-200 text-xs">• {error}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {validation.warnings.length > 0 && (
                                                    <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-3">
                                                        <div className="flex items-start gap-2">
                                                            <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <div className="text-yellow-300 text-sm font-medium">Recommendations</div>
                                                                <ul className="mt-1 space-y-1">
                                                                    {validation.warnings.map((warning, idx) => (
                                                                        <li key={idx} className="text-yellow-200 text-xs">• {warning}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>

                            {/* Step content always rendered so validation can update */}
                            {renderStepContent()}
                            {/* 3-day schedule preview appended (does not replace step content) */}
                            {(() => {
                                const preview = state?.advanced?.schedulePreview;
                                // 3-day legacy path (weeks array)
                                if (preview?.mode === '3day' && Array.isArray(preview?.weeks) && preview.weeks.length) {
                                    const weeks = toUiDays(preview);
                                    return (
                                        <div className="space-y-6 mt-10">
                                            {weeks.map((w, wi) => (
                                                <div key={wi} className="rounded-2xl border border-gray-700 bg-gray-800/40 p-4">
                                                    <div className="text-lg font-semibold mb-3 text-white">{w.label}</div>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        {w.sessions.map((s, si) => (
                                                            <div key={si} className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-3">
                                                                <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">{s.sessionWeekLabel}</div>
                                                                {s.lifts.map((lift, li) => {
                                                                    const units = state?.units || 'lbs';
                                                                    const tms = Object.fromEntries(Object.entries(state?.lifts || {}).map(([k, v]) => [k, v.tm || 0]));
                                                                    const roundingPref = state?.rounding === 'ceil' ? { lbs: 5, kg: 2.5 } : { lbs: 5, kg: 2.5 };
                                                                    const pack = packRef.current;
                                                                    const warmups = computeWarmupsFromPack({ pack, lift, tms, units, rounding: roundingPref });
                                                                    const main = computeMainFromPack({ pack, lift, weekLabel: s.sessionWeekLabel, tms, units, rounding: roundingPref });
                                                                    const bbb = computeBBBFromConfig({ supplemental: state?.supplemental, lift, tms, units, rounding: roundingPref, pack });
                                                                    return (
                                                                        <div key={li} className={li > 0 ? 'mt-4 pt-4 border-t border-gray-700/40' : ''}>
                                                                            <div className="font-medium capitalize text-gray-200">{lift}</div>
                                                                            <div className="mt-1 text-xs uppercase tracking-wide text-gray-400">Warm-up</div>
                                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                                {warmups.length === 0 && <li className="text-gray-500">—</li>}
                                                                                {warmups.map((r, i) => (
                                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps} → <span className="text-white">{r.weight}</span> {units}</li>
                                                                                ))}
                                                                            </ul>
                                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Main</div>
                                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                                {main.rows.length === 0 && <li className="text-gray-500">—</li>}
                                                                                {main.rows.map((r, i) => (
                                                                                    <li key={i} className="tabular-nums text-gray-300">
                                                                                        {r.pct}% × {r.reps}{r.amrap ? '+' : ''} → <span className="text-white">{r.weight}</span> {units}
                                                                                        {r.amrap && <span className="ml-2 text-[10px] px-1 py-0.5 border border-red-500/40 rounded text-red-300">AMRAP</span>}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                            {bbb && (
                                                                                <div className="mb-2">
                                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Supplemental (BBB)</div>
                                                                                    <div className="text-sm tabular-nums text-gray-300">{bbb.sets}×{bbb.reps} @ {bbb.pct}% TM → <span className="text-white">{bbb.load}</span> {units}</div>
                                                                                </div>
                                                                            )}
                                                                            {Array.isArray(state?.assistance?.items) && state.assistance.items.length > 0 && (
                                                                                <div>
                                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Assistance</div>
                                                                                    <ul className="text-sm space-y-0.5">
                                                                                        {state.assistance.items.map((a, ai) => (
                                                                                            <li key={ai} className="text-gray-300">{a.name || a.id} — {a.sets}×{a.reps}{a.load ? ` @ ${a.load}` : ''}</li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            )}
                                                                            {s.conditioning && (
                                                                                <div className="mt-2">
                                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Conditioning</div>
                                                                                    <div className="text-xs text-gray-300">
                                                                                        {s.conditioning.type} {s.conditioning.minutes ? `${s.conditioning.minutes}m` : ''}{s.conditioning.intensity ? ` · ${s.conditioning.intensity}` : ''}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                // 4-day live preview path (flat days array)
                                if (preview?.mode === '4day_live' && Array.isArray(preview?.days) && preview.days.length === 4) {
                                    return (
                                        <div className="space-y-6 mt-10">
                                            <div className="rounded-2xl border border-gray-700 bg-gray-800/40 p-4">
                                                <div className="text-lg font-semibold mb-3 text-white">Week 1 (Preview)</div>
                                                <div className="grid md:grid-cols-4 gap-4">
                                                    {preview.days.map((d, di) => (
                                                        <div key={di} className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-3">
                                                            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Day {di + 1}</div>
                                                            <div className="font-medium capitalize text-gray-200 mb-2">{d.lift}</div>
                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Warm-up</div>
                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                {d.warmups?.length === 0 && <li className="text-gray-500">—</li>}
                                                                {d.warmups?.map((r, i) => (
                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps} → <span className="text-white">{r.weight}</span> {state?.units || 'lbs'}</li>
                                                                ))}
                                                            </ul>
                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Main</div>
                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                {d.main?.rows?.length === 0 && <li className="text-gray-500">—</li>}
                                                                {d.main?.rows?.map((r, i) => (
                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps}{r.amrap ? '+' : ''} → <span className="text-white">{r.weight}</span> {state?.units || 'lbs'}{r.amrap && <span className="ml-2 text-[10px] px-1 py-0.5 border border-red-500/40 rounded text-red-300">AMRAP</span>}</li>
                                                                ))}
                                                            </ul>
                                                            {d.supplemental && (
                                                                <div className="mb-2">
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Supplemental</div>
                                                                    <div className="text-sm tabular-nums text-gray-300">{d.supplemental.sets}×{d.supplemental.reps} @ {d.supplemental.pct}% TM → <span className="text-white">{d.supplemental.load}</span> {state?.units || 'lbs'}</div>
                                                                </div>
                                                            )}
                                                            {Array.isArray(d.assistance) && d.assistance.length > 0 && (
                                                                <div>
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Assistance</div>
                                                                    <ul className="text-sm space-y-0.5">
                                                                        {d.assistance.map((a, ai) => (
                                                                            <li key={ai} className="text-gray-300">{a.name || a.id} — {a.sets ?? '?'}×{a.reps ?? '?'}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {d.conditioning && (
                                                                <div className="mt-2">
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Conditioning</div>
                                                                    <div className="text-xs text-gray-300">
                                                                        {d.conditioning.type} {d.conditioning.minutes ? `${d.conditioning.minutes}m` : ''}{d.conditioning.intensity ? ` · ${d.conditioning.intensity}` : ''}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                // 2-day live preview
                                if (preview?.mode === '2day_live' && Array.isArray(preview?.days) && preview.days.length === 2) {
                                    return (
                                        <div className="space-y-6 mt-10">
                                            <div className="rounded-2xl border border-gray-700 bg-gray-800/40 p-4">
                                                <div className="text-lg font-semibold mb-3 text-white">Week 1 (2-Day Preview)</div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {preview.days.map((d, di) => (
                                                        <div key={di} className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-3">
                                                            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Day {di + 1}</div>
                                                            <div className="font-medium capitalize text-gray-200 mb-2">{d.lift}</div>
                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Warm-up</div>
                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                {d.warmups?.length === 0 && <li className="text-gray-500">—</li>}
                                                                {d.warmups?.map((r, i) => (
                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps} → <span className="text-white">{r.weight}</span> {state?.units || 'lbs'}</li>
                                                                ))}
                                                            </ul>
                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Main</div>
                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                {d.main?.rows?.length === 0 && <li className="text-gray-500">—</li>}
                                                                {d.main?.rows?.map((r, i) => (
                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps}{r.amrap ? '+' : ''} → <span className="text-white">{r.weight}</span> {state?.units || 'lbs'}{r.amrap && <span className="ml-2 text-[10px] px-1 py-0.5 border border-red-500/40 rounded text-red-300">AMRAP</span>}</li>
                                                                ))}
                                                            </ul>
                                                            {Array.isArray(d.assistance) && d.assistance.length > 0 && (
                                                                <div>
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Assistance</div>
                                                                    <ul className="text-sm space-y-0.5">
                                                                        {d.assistance.map((a, ai) => (
                                                                            <li key={ai} className="text-gray-300">{a.name || a.id} — {a.sets ?? '?'}×{a.reps ?? '?'}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {d.conditioning && (
                                                                <div className="mt-2">
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Conditioning</div>
                                                                    <div className="text-xs text-gray-300">
                                                                        {d.conditioning.type} {d.conditioning.minutes ? `${d.conditioning.minutes}m` : ''}{d.conditioning.intensity ? ` · ${d.conditioning.intensity}` : ''}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                // 1-day live preview (globally disabled unless VITE_SHOW_STEP_PREVIEW is truthy)
                                if (preview?.mode === '1day_live') {
                                    if (!import.meta.env?.VITE_SHOW_STEP_PREVIEW) {
                                        return null; // short-circuits the shared 1-day panel everywhere
                                    }
                                    if (Array.isArray(preview?.days) && preview.days.length === 1) {
                                        const d = preview.days[0];
                                        return (
                                            <div className="space-y-6 mt-10">
                                                <div className="rounded-2xl border border-gray-700 bg-gray-800/40 p-4">
                                                    <div className="text-lg font-semibold mb-3 text-white">Week 1 (1-Day Preview)</div>
                                                    <div className="grid md:grid-cols-1 gap-4">
                                                        <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-3">
                                                            <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Day 1</div>
                                                            <div className="font-medium capitalize text-gray-200 mb-2">{d.lift}</div>
                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Warm-up</div>
                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                {d.warmups?.length === 0 && <li className="text-gray-500">—</li>}
                                                                {d.warmups?.map((r, i) => (
                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps} → <span className="text-white">{r.weight}</span> {state?.units || 'lbs'}</li>
                                                                ))}
                                                            </ul>
                                                            <div className="text-xs uppercase tracking-wide text-gray-400">Main</div>
                                                            <ul className="text-sm mb-2 space-y-0.5">
                                                                {d.main?.rows?.length === 0 && <li className="text-gray-500">—</li>}
                                                                {d.main?.rows?.map((r, i) => (
                                                                    <li key={i} className="tabular-nums text-gray-300">{r.pct}% × {r.reps}{r.amrap ? '+' : ''} → <span className="text-white">{r.weight}</span> {state?.units || 'lbs'}{r.amrap && <span className="ml-2 text-[10px] px-1 py-0.5 border border-red-500/40 rounded text-red-300">AMRAP</span>}</li>
                                                                ))}
                                                            </ul>
                                                            {Array.isArray(d.assistance) && d.assistance.length > 0 && (
                                                                <div>
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Assistance</div>
                                                                    <ul className="text-sm space-y-0.5">
                                                                        {d.assistance.map((a, ai) => (
                                                                            <li key={ai} className="text-gray-300">{a.name || a.id} — {a.sets ?? '?'}×{a.reps ?? '?'}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {d.conditioning && (
                                                                <div className="mt-2">
                                                                    <div className="text-xs uppercase tracking-wide text-gray-400">Conditioning</div>
                                                                    <div className="text-xs text-gray-300">
                                                                        {d.conditioning.type} {d.conditioning.minutes ? `${d.conditioning.minutes}m` : ''}{d.conditioning.intensity ? ` · ${d.conditioning.intensity}` : ''}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })()}
                            {/* NOTE: If a day in schedulePreview has { combineWith }, future UI can render two main lifts in one session for deload. */}

                            {/* Week 3 AMRAP capture + progression trigger */}
                            {stepIndex === 3 && (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_PROGRESS === 'true') && (
                                <div className="mt-10 rounded-2xl border border-gray-700 bg-gray-800/40 p-4">
                                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Week 3 AMRAP Results</h3>
                                            <p className="text-xs text-gray-400 mt-1 max-w-xl">Enter the reps you achieved on the final AMRAP set of Week 3 for each main lift. Leave blank if not performed. Progression will increase TMs only for lifts that met or exceeded the baseline (auto-pass when FORCE_PASS env flag set).</p>
                                        </div>
                                        <div className="text-xs text-gray-500">Cycle: <span className="text-gray-300">{state?.cycle || 1}</span></div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {LIFTS.map(lift => {
                                            const val = state?.amrapWk3?.[lift] ?? '';
                                            return (
                                                <div key={lift} className="flex flex-col">
                                                    <label className="text-xs uppercase tracking-wide text-gray-400 mb-1">{lift}</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={val === null ? '' : val}
                                                        onChange={e => {
                                                            const raw = e.target.value;
                                                            const num = raw === '' ? null : Math.max(0, parseInt(raw, 10) || 0);
                                                            dispatch({ type: 'SET_AMRAP_WK3', payload: { [lift]: num } });
                                                        }}
                                                        className="bg-gray-900/60 border border-gray-700 focus:border-red-500 focus:outline-none rounded px-2 py-1 text-sm text-gray-200"
                                                        placeholder="Reps"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center justify-end mt-6 space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Trigger progression using captured reps
                                                onAdvanceCycle(state?.amrapWk3 || {});
                                                // Persist reps into context (already there) – optionally could clear after
                                            }}
                                            className="px-5 py-2 rounded-lg border font-medium transition-colors border-blue-500 bg-blue-600/10 text-blue-300 hover:bg-blue-600/20"
                                        >
                                            Advance Cycle
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                                <ToggleButton
                                    on={false}
                                    disabled={!canGoBack}
                                    onClick={handleBack}
                                    className={`text-sm px-5 ${!canGoBack ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >← Back</ToggleButton>

                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                    <span>Step {stepIndex + 1} of {STEPS.length}</span>
                                </div>

                                {stepIndex === 0 && (
                                    <div className="flex flex-col items-end gap-2 relative">
                                        <ToggleButton
                                            on={canGoNext}
                                            disabled={!canGoNext}
                                            onClick={handleNext}
                                            className={`flex items-center gap-2 text-sm px-5 ${!canGoNext ? 'opacity-50' : ''}`}
                                        >Next <ChevronRight className="w-4 h-4" /></ToggleButton>
                                        {!canGoNext && step1Error && (
                                            <div className="flex items-start gap-2 text-xs max-w-xs p-2 rounded-md border border-amber-600/40 bg-amber-900/30 text-amber-300 shadow-lg animate-fade-in">
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                <span>{step1Error}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(stepIndex === 1 || stepIndex === 2) && (
                                    <div className="flex flex-col items-end gap-2">
                                        {(() => {
                                            const validation = getStepWarnings(stepIndex);
                                            const canProceed = validation.errors.length === 0;

                                            return (
                                                <ToggleButton
                                                    on={canProceed}
                                                    disabled={!canProceed}
                                                    onClick={handleNext}
                                                    className={`flex items-center gap-2 text-sm px-5 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {stepIndex === 1 ? 'Continue' : 'Review & Export'} <ChevronRight className="w-4 h-4" />
                                                </ToggleButton>
                                            );
                                        })()}
                                    </div>
                                )}
                                {stepIndex === 3 && (
                                    <ToggleButton
                                        on={stepValidation.review}
                                        disabled={!stepValidation.review}
                                        onClick={() => {
                                            setStepIndex(4);
                                            updateStepUrl(4);
                                        }}
                                        className={`flex items-center gap-2 text-sm px-5 ${!stepValidation.review ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >Week 4 Complete → Progress TMs <ChevronRight className="w-4 h-4" /></ToggleButton>
                                )}
                                {stepIndex === 4 && (
                                    <ToggleButton
                                        on={true}
                                        disabled={false}
                                        onClick={handleStartCycle}
                                        className={`flex items-center gap-2 text-sm px-5`}
                                    >Start Next Cycle <ChevronRight className="w-4 h-4" /></ToggleButton>
                                )}
                                {!(stepIndex === 0 || stepIndex === 2 || stepIndex === 3) && <div className="w-[96px]" />}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function ProgramWizard531V2() { return <WizardShell />; }

// Inline lightweight progression step component (kept at bottom to avoid new file churn)
function ProgressionStep({ state, onAdvance }) {
    const [include, setInclude] = useState({ squat: true, bench: true, deadlift: true, press: true });
    const [applied, setApplied] = useState(false);
    const lifts = state?.lifts || {};
    const amrap = state?.amrapWk3 || {};
    const units = state?.units || 'lbs';
    const plannedIncrements = {
        squat: units === 'kg' ? 5 : 10,
        deadlift: units === 'kg' ? 5 : 10,
        bench: units === 'kg' ? 2.5 : 5,
        press: units === 'kg' ? 2.5 : 5
    };
    return (
        <div className="space-y-8">
            <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-white">Advance Training Maxes</h2>
                <p className="text-sm text-gray-400 mt-1">Per Wendler: +{units === 'kg' ? '2.5 kg (upper) / 5 kg (lower)' : '5 lb (upper) / 10 lb (lower)'} to each Training Max after a full 4-week cycle (Weeks 1–3 main sets + Week 4 deload). Uncheck any lift you want to hold this cycle.</p>
                <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(lifts).map(([k, v]) => {
                        const current = v?.tm || 0;
                        const inc = plannedIncrements[k] || 0;
                        const next = current + inc;
                        const passed = amrap[k] == null || amrap[k] >= (state?.amrapMinWk3 || 1);
                        return (
                            <label key={k} className={`flex flex-col rounded-lg border p-3 bg-gray-900/60 cursor-pointer ${include[k] ? 'border-red-500/50' : 'border-gray-700'}`}>\n+                                <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-white capitalize">{k}</span>
                                <input type="checkbox" checked={include[k]} onChange={e => setInclude(prev => ({ ...prev, [k]: e.target.checked }))} />
                            </div>
                                <div className="text-xs text-gray-400 flex flex-col gap-0.5 font-mono">
                                    <span>TM: <span className="text-gray-200">{current || '—'}</span></span>
                                    <span>Inc: +{inc}</span>
                                    <span className="text-gray-500">Next: {include[k] ? next : current}</span>
                                    <span className={`mt-1 ${passed ? 'text-green-400' : 'text-yellow-500'}`}>{passed ? 'AMRAP pass' : 'No data'}</span>
                                </div>
                            </label>
                        );
                    })}
                </div>
                <div className="mt-6 flex items-center gap-3">
                    <button
                        disabled={applied}
                        onClick={() => { if (!applied) { onAdvance(include); setApplied(true); } }}
                        className={`px-5 py-2 rounded-lg border font-medium transition-colors ${applied ? 'border-gray-600 text-gray-500' : 'border-green-500 bg-green-600/10 text-green-300 hover:bg-green-600/20'}`}
                    >{applied ? 'Applied' : 'Apply Progression'}</button>
                    {applied && <span className="text-xs text-gray-400">Progression applied. Start next cycle when ready.</span>}
                </div>
            </div>
            <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 text-xs text-gray-400 leading-relaxed">
                <p><strong className="text-gray-300">Note:</strong> If you stalled on a lift (missed Week 3 top set by a wide margin), you can uncheck it and keep the same TM next cycle. Adjusting only one lift at a time is common.</p>
            </div>
        </div>
    );
}
