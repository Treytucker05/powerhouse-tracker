/**
 * TODO: ProgramContextV2 - Canonical 5/3/1 Program Store V2
 * This is the new dedicated 5/3/1 context that matches the exact specification.
 * Legacy ProgramContext.jsx remains for existing pages compatibility.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { applyTemplate } from '../../../lib/templates/index.js';
import { UNITS } from '../../../lib/units.ts';
import { migrateProgramV2 as migrateTm } from '../../../lib/tm.ts';
// Assistance normalization (used for convert-to-custom action)
import { normalizeAssistance } from '../assistance/index.js';

// --- Template schedule normalization & logging helpers ---
function normalizeTemplateSchedule(rawSchedule) {
    const sched = rawSchedule || {};
    let daysRaw = sched.days || [];
    if (Array.isArray(daysRaw) && daysRaw.length && typeof daysRaw[0] === 'string') {
        daysRaw = daysRaw.map((name, i) => ({ id: `D${i + 1}`, lift: name.toLowerCase() }));
    }
    if (Array.isArray(daysRaw) && daysRaw.length && typeof daysRaw[0] === 'object') {
        daysRaw = daysRaw.map((d, i) => ({ id: d.id || `D${i + 1}`, lift: (d.lift || d.name || '').toLowerCase() }));
    }
    const order = daysRaw.map(d => d.lift);
    return {
        frequency: sched.frequency || (order.length === 3 ? '3day' : order.length === 2 ? '2day' : '4day'),
        days: daysRaw,
        order,
        includeWarmups: sched.includeWarmups !== false,
        warmupScheme: sched.warmupScheme || { percentages: [40, 50, 60], reps: [5, 5, 3] }
    };
}

function logTemplateSync(stage, payload) {
    try {
        if (typeof window !== 'undefined' && window.localStorage?.getItem('debug.531.template') === 'off') return;
        // eslint-disable-next-line no-console
        console.info('[531:TEMPLATE_SYNC]', stage, payload);
    } catch { /* ignore */ }
}

// Local template application helper (dedupes historical dual SET_TEMPLATE branches) with schedule normalization
function applyTemplateLocal(state, template) {
    const next = { ...state };
    next.template = template;
    next.templateKey = template; // keep both aligned
    next.week = 1;
    next.amrapWk3 = {};

    // Attempt to pull preset for schedule normalization dynamically (safe guarded)
    try {
        // Dynamic ESM import (kept inside function, not top-level for optional loading)
        // NOTE: intentionally not awaited to avoid making applyTemplateLocal async; we only sync if resolved quickly
        import('../../../lib/templates/531.presets.v2.js')
            .then(presetModule => {
                if (presetModule?.getTemplatePreset) {
                    const preset = presetModule.getTemplatePreset(template, { state });
                    if (preset?.schedule) {
                        const norm = normalizeTemplateSchedule(preset.schedule);
                        next.schedule = { ...(next.schedule || {}), ...norm };
                        logTemplateSync('applyTemplateLocal.appliedPresetSchedule', { template, order: norm.order });
                    }
                }
            })
            .catch(e => {
                logTemplateSync('applyTemplateLocal.presetLoadFailed', { template, error: e.message });
            });
    } catch (e) {
        logTemplateSync('applyTemplateLocal.presetImportException', { template, error: e.message });
    }

    // Normalize any existing schedule if still not normalized
    if (next.schedule?.days) {
        const normExisting = normalizeTemplateSchedule(next.schedule);
        next.schedule = { ...next.schedule, ...normExisting };
    }

    if (next.advanced?.schedulePreview) {
        next.advanced = { ...next.advanced, schedulePreview: null };
    }
    return next;
}

// Initial program state (serializable only - exact spec)
export const initialProgramV2 = {
    pack: null, // active assistance/template pack key (mirrors templateKey when in template mode)
    units: UNITS.LBS,
    // Rounding stored as mode string (nearest|ceil|floor). Default per spec should be neutral/standard.
    rounding: 'nearest',
    // Training max percent
    // Keep canonical decimal, but default to 0.85 (85%) per requirement.
    tmPct: 0.85, // decimal canonical (0.85-1.00)
    // UI/helper choice for TM percent (85 | 90)
    tmPctChoice: 85,
    // Rounding increment separate from rounding mode; default depends on units
    roundingIncrement: 5, // lb default; 2.5 for kg
    // Global frequency and split controls (do not remove/alter schedule shape)
    frequencyDays: 4, // 2|3|4
    splitStyle: 'one_lift', // 'one_lift' | 'full_body'
    // Phase plan configuration (Leader/Anchor scheme selectors)
    phasePlan: {
        pattern: '2+1', // '2+1' | '3+1'
        leader: { mainSet: '5s_pro' },
        anchor: { mainSet: 'pr_sets' }
    },
    // Flow / template selection additions
    flowMode: 'custom', // 'custom' | 'template'
    templateKey: null,  // one of TEMPLATE_KEYS or null
    templateSpec: null, // enriched descriptor (from TEMPLATE_SPECS)
    assistanceHint: null, // stored assistance guidance from spec (examples/intent)
    loadingOption: 1,   // global loading scheme (1|2)
    lifts: {
        squat: { name: 'squat', oneRM: null, tm: null },
        bench: { name: 'bench', oneRM: null, tm: null },
        deadlift: { name: 'deadlift', oneRM: null, tm: null },
        press: { name: 'press', oneRM: null, tm: null }
    },
    trainingMaxes: {}, // flat per-lift TM map kept in sync via SET_TRAINING_MAX / SET_TM
    // Legacy schedule structure retained (variant + object days) PLUS enhanced design fields
    schedule: {
        variant: '4day',
        days: [
            { id: 1, name: 'Day 1', lift: 'press' },
            { id: 2, name: 'Day 2', lift: 'deadlift' },
            { id: 3, name: 'Day 3', lift: 'bench' },
            { id: 4, name: 'Day 4', lift: 'squat' }
        ],
        // New Step 3 design fields (safe-merge additions)
        frequency: '4day',
        order: ['Press', 'Deadlift', 'Bench', 'Squat'], // canonical default
        includeWarmups: true,
        warmupScheme: { percentages: [40, 50, 60], reps: [5, 5, 3] }
    },
    loading: {
        option: 1,
        increments: { upper: 5, lower: 10 },
        includeDeload: true,
        previewWeek: 3
    },
    warmups: {
        policy: 'standard',
        sets: [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 3 }]
    },
    template: 'custom',
    templateLock: false,
    // Supplemental scheme config (extend, do not remove existing keys)
    supplemental: { strategy: 'none', schemeId: 'fsl' }, // schemeId: 'fsl' | 'bbb' | 'bbs' | 'ssl'
    // Assistance plan and targets
    assistance: {
        1: [], 2: [], 3: [], 4: [],
        mode: 'minimal',
        // Assistance volume targets (percent of session goal, 0-100)
        targets: { push: 75, pull: 75, core: 75 },
        // Explicit selections e.g., ['Dips','Chins'] if user-curated
        selections: []
    },
    // Assistance customization flags
    assistMode: 'template', // 'template' | 'custom'
    assistCustom: null, // when custom: { days: { Press: [...], Deadlift: [...], ... } }
    // User equipment availability (drives assistance selection). Keys align with assistanceCatalog equip tags.
    equipment: ['bw', 'db', 'bb'],
    deadliftRepStyle: 'dead_stop',
    // conditioning: { mode: 'simple', freq: 2, plan: [] },
    advanced: { autoreg: { rpeCap: 9 }, specialization: {}, prTracking: true },
    assistanceLoadMode: 'percentRules', // 'percentRules' | 'off'
    conditioning: {
        sessionsPerWeek: 3, // Wendler recommends 3–4 (minimum 2)
        hiitPerWeek: 2,
        modalities: { hiit: ['Prowler Pushes', 'Hill Sprints'], liss: ['Walking'] },
        note: 'Target 3–4 conditioning sessions (hill sprints / prowler). Keep after lifting or on off days.'
    },
    // Seventh week (deload or TM test)
    seventhWeek: { mode: 'deload', criteria: 'afterLeader' },
    // Progression rules (unit-aware defaults)
    progression: {
        increments: { upper: 5, lower: 10 }, // lb default; 2.5/5 for kg
        rule: 'pass_hold_reset',
        criteria: { minReps: 5 }
    },
    // Logging preferences
    logging: { trackAmrap: true, est1rmFormula: 'wendler', prFlags: true },
    // Automation toggles
    automation: { autoPercentCalc: true, autoFsl: true, autoDeload: true, autoTmUpdate: true },
    // Global include warmups (UI convenience; schedule.includeWarmups remains authoritative for day gen)
    includeWarmups: true,
    amrapWk3: {},
    cycle: 1
};

const ProgramContextV2 = createContext();

// Core structural migration (pre tm.ts canonicalization). Ensures trainingMax alias present & basic tmPct normalization.
function migrateProgramCore(p) {
    if (!p || typeof p !== 'object') return p;
    const next = { ...p };
    if (next.tmPercent != null && (next.tmPct == null || next.tmPct > 1)) {
        const num = Number(next.tmPercent);
        if (Number.isFinite(num) && num > 1) next.tmPct = num / 100;
    }
    if (typeof next.tmPct === 'number' && next.tmPct > 1) next.tmPct = next.tmPct / 100;
    if (typeof next.tmPct !== 'number' || !(next.tmPct > 0.5 && next.tmPct <= 1.05)) next.tmPct = 0.85;
    // Ensure tmPctChoice aligns to tmPct (85 or 90)
    if (next.tmPctChoice == null) next.tmPctChoice = (Math.round((next.tmPct || 0.9) * 100) <= 86 ? 85 : 90);
    // Rounding increment default by units
    if (next.roundingIncrement == null) next.roundingIncrement = (next.units === UNITS.KGS || next.units === 'kg' || next.units === 'kgs') ? 2.5 : 5;
    // frequencyDays default
    if (next.frequencyDays == null) next.frequencyDays = 4;
    if (!next.splitStyle) next.splitStyle = 'one_lift';
    if (!next.phasePlan) next.phasePlan = { pattern: '2+1', leader: { mainSet: '5s_pro' }, anchor: { mainSet: 'pr_sets' } };
    // Supplemental schemeId
    next.supplemental = { ...(next.supplemental || {}), schemeId: next?.supplemental?.schemeId || 'fsl' };
    // Assistance targets and selections
    next.assistance = {
        ...(next.assistance || { 1: [], 2: [], 3: [], 4: [], mode: 'minimal' }),
        targets: next?.assistance?.targets || { push: 75, pull: 75, core: 75 },
        selections: Array.isArray(next?.assistance?.selections) ? next.assistance.selections : []
    };
    // Seventh week
    if (!next.seventhWeek) next.seventhWeek = { mode: 'deload', criteria: 'afterLeader' };
    // Progression defaults
    if (!next.progression) {
        const isKg = (next.units === UNITS.KGS || next.units === 'kg' || next.units === 'kgs');
        next.progression = {
            increments: isKg ? { upper: 2.5, lower: 5 } : { upper: 5, lower: 10 },
            rule: 'pass_hold_reset',
            criteria: { minReps: next.tmPctChoice === 85 ? 5 : 3 }
        };
    } else {
        if (!next.progression.increments) {
            const isKg = (next.units === UNITS.KGS || next.units === 'kg' || next.units === 'kgs');
            next.progression.increments = isKg ? { upper: 2.5, lower: 5 } : { upper: 5, lower: 10 };
        }
        if (!next.progression.rule) next.progression.rule = 'pass_hold_reset';
        if (!next.progression.criteria) next.progression.criteria = { minReps: next.tmPctChoice === 85 ? 5 : 3 };
        if (next.progression.criteria.minReps == null) next.progression.criteria.minReps = (next.tmPctChoice === 85 ? 5 : 3);
    }
    // Logging
    if (!next.logging) next.logging = { trackAmrap: true, est1rmFormula: 'wendler', prFlags: true };
    // Automation
    if (!next.automation) next.automation = { autoPercentCalc: true, autoFsl: true, autoDeload: true, autoTmUpdate: true };
    // Global includeWarmups flag
    if (next.includeWarmups == null) next.includeWarmups = (next.schedule?.includeWarmups !== false);
    delete next.tmPercent;
    if (next.lifts) {
        const lifts = { ...next.lifts };
        Object.keys(lifts).forEach(k => {
            const rec = { ...lifts[k] };
            if (rec.tm != null && rec.trainingMax == null) rec.trainingMax = rec.tm;
            lifts[k] = rec;
        });
        next.lifts = lifts;
    }
    return next;
}

// Public migration: compose legacy structural migration with tm.ts canonical decimal migration
export function migrateProgramV2(p) {
    return migrateTm(migrateProgramCore(p));
}

function reducerV2(state, action) {
    switch (action.type) {
        case 'SET_TM_PCT_CHOICE': {
            const tmPctChoice = action.value === 90 ? 90 : 85;
            const tmPct = tmPctChoice / 100;
            // Also update progression criteria minReps based on choice
            const progression = {
                ...(state.progression || {}),
                criteria: { ...(state.progression?.criteria || {}), minReps: tmPctChoice === 85 ? 5 : 3 }
            };
            return { ...state, tmPctChoice, tmPct, progression };
        }
        case 'SET_ASSISTANCE_LOAD_MODE':
            return { ...state, assistanceLoadMode: action.payload };
        case 'SET_CONDITIONING':
            return { ...state, conditioning: { ...state.conditioning, ...action.payload } };
        case 'SET_UNITS': return { ...state, units: action.units };
        case 'SET_ROUNDING': return { ...state, rounding: action.rounding };
        case 'SET_ROUNDING_INCREMENT': return { ...state, roundingIncrement: Number(action.value) };
        case 'SET_TM_PCT': return { ...state, tmPct: action.tmPct };
        // Removed SET_TM_PERCENT - tmPct is canonical
        case 'SET_FREQUENCY_DAYS': return { ...state, frequencyDays: Number(action.value) };
        case 'SET_SPLIT_STYLE': return { ...state, splitStyle: action.value };
        case 'SET_PHASE_PLAN': return { ...state, phasePlan: { ...state.phasePlan, ...(action.value || action.payload || {}) } };
        case 'SET_FLOW_MODE': return { ...state, flowMode: action.payload };
        case 'SET_TEMPLATE_KEY': return { ...state, templateKey: action.payload };
        case 'SET_TEMPLATE_SPEC': return { ...state, templateSpec: action.payload };
        case 'SET_ASSISTANCE_HINT': return { ...state, assistanceHint: action.payload };
        case 'SET_LOADING_OPTION': return { ...state, loadingOption: action.payload };
        case 'SET_ONE_RM': return {
            ...state,
            lifts: { ...state.lifts, [action.lift]: { ...state.lifts[action.lift], oneRM: action.oneRM } }
        };
        case 'SET_TRAINING_MAX': { // unified TM writer (lifts + flat map + alias)
            const { lift, tm } = action;
            return {
                ...state,
                lifts: { ...state.lifts, [lift]: { ...state.lifts[lift], tm, trainingMax: tm } },
                trainingMaxes: { ...(state.trainingMaxes || {}), [lift]: tm }
            };
        }
        case 'SET_TM': {
            // Hard delegate to single writer to maintain one source of truth.
            return reducerV2(state, { type: 'SET_TRAINING_MAX', lift: action.lift, tm: action.tm });
        }
        case 'SET_DAYS_PER_WEEK': return { ...state, daysPerWeek: Number(action.payload) };
        case 'BULK_SET_LIFTS': return { ...state, lifts: { ...state.lifts, ...action.lifts } };
        case 'SET_TEMPLATE': { // unified template application + assistance reset
            const next = applyTemplateLocal(state, action.template);
            next.pack = action.template;
            next.assistMode = 'template';
            next.assistCustom = null;
            return next;
        }
        case 'CONVERT_ASSIST_TO_CUSTOM': { // derive per-day assistance arrays from current template normalization
            const templateKey = action.templateKey || state.templateKey || state.pack || 'triumvirate';
            // Order of days (display names). Prefer explicit provided order -> schedule.order -> fallback canonical
            const order = action.order || state.schedule?.order || ['Press', 'Deadlift', 'Bench', 'Squat'];
            const assistCustom = {};
            order.forEach((displayLift, idx) => {
                try {
                    const items = normalizeAssistance(templateKey, displayLift, state) || [];
                    assistCustom[idx + 1] = items.map(it => ({
                        id: it.id || it.name,
                        name: it.name,
                        sets: it.sets,
                        reps: it.reps,
                        block: it.block
                    }));
                } catch { /* noop */ }
            });
            return { ...state, assistMode: 'custom', assistCustom };
        }
        case 'SET_TEMPLATE_LOCK': return { ...state, templateLock: !!action.lock };
        case 'SET_TEMPLATE_AND_RESET_ASSIST': {
            const next = applyTemplateLocal(state, action.template);
            next.assistMode = 'template';
            next.assistCustom = null;
            return next;
        }
        case 'SET_SCHEDULE': return { ...state, schedule: { ...state.schedule, ...(action.schedule || action.payload || {}) } };
        case 'SET_WARMUP_SCHEME': return { ...state, schedule: { ...state.schedule, warmupScheme: { ...action.payload } } };
        case 'SET_INCLUDE_WARMUPS': return { ...state, schedule: { ...state.schedule, includeWarmups: !!action.payload } };
        case 'SET_DEADLIFT_REP_STYLE': return { ...state, deadliftRepStyle: action.payload };
        case 'SET_LOADING': return { ...state, loading: { ...state.loading, ...action.loading } };
        case 'SET_WARMUPS': return { ...state, warmups: { ...state.warmups, ...action.warmups } };
        case 'SET_SUPPLEMENTAL': return { ...state, supplemental: { ...state.supplemental, ...(action.supplemental || action.payload || {}) } };
    case 'SET_ASSISTANCE': return { ...state, assistance: { ...state.assistance, ...(action.assistance || action.payload || {}) } };
    case 'SET_ASSISTANCE_TARGETS': return { ...state, assistance: { ...state.assistance, targets: { ...state.assistance?.targets, ...(action.value || action.payload || {}) } } };
    case 'SET_ASSISTANCE_SELECTIONS': return { ...state, assistance: { ...state.assistance, selections: Array.isArray(action.value) ? action.value : [] } };
        case 'SET_EQUIPMENT': return { ...state, equipment: Array.isArray(action.payload) ? action.payload : state.equipment };
        case 'SET_ASSIST_MODE': return { ...state, assistMode: action.payload };
        case 'SET_ASSIST_CUSTOM': {
            // Overloaded: full replace or day-level patch when dayId provided
            if (action.dayId != null) {
                const dayId = action.dayId;
                const items = Array.isArray(action.items) ? action.items : [];
                const next = { ...(state.assistCustom || {}) }; // ensure object
                next[dayId] = items;
                return { ...state, assistCustom: next };
            }
            return { ...state, assistCustom: action.payload };
        }
        case 'RESET_ASSIST_DAY': {
            // Expect payload: { dayId, items }
            if (action.dayId == null) return state;
            const next = { ...(state.assistCustom || {}) };
            next[action.dayId] = Array.isArray(action.items) ? action.items : [];
            return { ...state, assistCustom: next };
        }
        case 'SET_ADVANCED': return { ...state, advanced: { ...state.advanced, ...action.advanced } };
        case 'SET_AMRAP_WK3': return { ...state, amrapWk3: { ...(state.amrapWk3 || {}), ...(action.payload || {}) } };
        case 'SET_CYCLE': return { ...state, cycle: action.payload };
        case 'SET_WEEK': return { ...state, week: action.payload };
    case 'SET_SEVENTH_WEEK': return { ...state, seventhWeek: { ...state.seventhWeek, ...(action.value || action.payload || {}) } };
    case 'SET_PROGRESSION': return { ...state, progression: { ...state.progression, ...(action.value || action.payload || {}) } };
    case 'SET_LOGGING': return { ...state, logging: { ...state.logging, ...(action.value || action.payload || {}) } };
    case 'SET_AUTOMATION': return { ...state, automation: { ...state.automation, ...(action.value || action.payload || {}) } };
    case 'SET_INCLUDE_WARMUPS_GLOBAL': return { ...state, includeWarmups: !!action.value };
        case 'SET_HISTORY': return { ...state, history: action.history };
        case 'APPLY_TEMPLATE':
            return applyTemplate(state, action.key);
        case 'APPLY_TEMPLATE_CONFIG': {
            const payload = action.payload || {};
            const { schedule, supplemental, assistance, loadingOption, assistanceLoadMode, conditioning } = payload;
            return {
                ...state,
                schedule: schedule ? { ...state.schedule, ...schedule } : state.schedule,
                supplemental: supplemental !== undefined ? supplemental : state.supplemental,
                assistance: assistance ? { ...state.assistance, ...assistance } : state.assistance,
                loadingOption: loadingOption || state.loadingOption,
                assistanceLoadMode: assistanceLoadMode ?? state.assistanceLoadMode,
                conditioning: conditioning ? { ...conditioning } : state.conditioning
            };
        }
        case 'HYDRATE_FROM_STORAGE': return { ...state, ...action.state };
        case 'RESET_PROGRAM': return { ...initialProgramV2 };
        case 'RESET_FUNDAMENTALS': {
            return {
                ...state,
                units: null,
                rounding: null,
                tmPct: null,
                lifts: {},
                tms: {}
            };
        }
        default: return state;
    }
}

function useProgramReducerV2() {
    const [state, dispatch] = useReducer(reducerV2, initialProgramV2, (init) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem('ph_program_v2');
                return raw ? migrateProgramV2({ ...init, ...JSON.parse(raw) }) : init;
            }
            return init;
        } catch { return init; }
    });

    // Throttled localStorage persistence
    useEffect(() => {
        const id = setTimeout(() => {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem('ph_program_v2', JSON.stringify(state));
                    // Mirror canonical trainingMaxes to compatibility key expected by some legacy utilities
                    if (state?.trainingMaxes) {
                        window.localStorage.setItem('trainingMaxes', JSON.stringify(state.trainingMaxes));
                    }
                }
            } catch { /* ignore persistence errors in test/jsdom */ }
        }, 250);
        return () => clearTimeout(id);
    }, [state]);

    return [state, dispatch];
}

export function ProgramProviderV2({ children }) {
    const [state, dispatch] = useProgramReducerV2();
    return (
        <ProgramContextV2.Provider value={{ state, dispatch }}>
            {children}
        </ProgramContextV2.Provider>
    );
}

// Alias export (spec convenience)
export const ProgramV2Provider = ProgramProviderV2;

export function useProgramV2() {
    const ctx = useContext(ProgramContextV2);
    if (!ctx) throw new Error('useProgramV2 must be used within ProgramProviderV2');
    return ctx;
}

// Helper for template application
export function applyTemplateKeyV2(dispatch, key) {
    dispatch({ type: 'APPLY_TEMPLATE', key });
}

// Higher level helper for new presets flow
export function applyTemplatePresetV2(dispatch, preset) {
    if (!preset) return;
    dispatch({ type: 'SET_TEMPLATE_KEY', payload: preset.key });
    dispatch({ type: 'APPLY_TEMPLATE_CONFIG', payload: preset });
    dispatch({ type: 'SET_FLOW_MODE', payload: 'template' });
}

// Light action helpers for Step 3 UI
export const setSchedule = (dispatch, patch) => dispatch({ type: 'SET_SCHEDULE', payload: patch });
export const setSupplemental = (dispatch, patch) => dispatch({ type: 'SET_SUPPLEMENTAL', payload: patch });
export const setAssistance = (dispatch, patch) => dispatch({ type: 'SET_ASSISTANCE', payload: patch });
export const setAssistanceLoadMode = (dispatch, mode) =>
    dispatch({ type: 'SET_ASSISTANCE_LOAD_MODE', payload: mode });
export const setConditioning = (dispatch, payload) =>
    dispatch({ type: 'SET_CONDITIONING', payload });

// --- Custom assistance day-level helpers ---
export const setAssistCustomDay = (dispatch, dayId, items) =>
    dispatch({ type: 'SET_ASSIST_CUSTOM', dayId, items });
export const resetAssistDay = (dispatch, dayId, items) =>
    dispatch({ type: 'RESET_ASSIST_DAY', dayId, items });

// --- New selectors & setters (typed via JSDoc) ---

/** @returns {85|90} */
export const selectTmPctChoice = (state) => state.tmPctChoice;
export const setTmPctChoice = (dispatch, value /* 85|90 */) =>
    dispatch({ type: 'SET_TM_PCT_CHOICE', value });

/** @returns {number} */
export const selectRoundingIncrement = (state) => state.roundingIncrement;
export const setRoundingIncrement = (dispatch, value /* number */) =>
    dispatch({ type: 'SET_ROUNDING_INCREMENT', value });

/** @returns {2|3|4} */
export const selectFrequencyDays = (state) => state.frequencyDays;
export const setFrequencyDays = (dispatch, value /* 2|3|4 */) =>
    dispatch({ type: 'SET_FREQUENCY_DAYS', value });

/** @returns {'one_lift'|'full_body'} */
export const selectSplitStyle = (state) => state.splitStyle;
export const setSplitStyle = (dispatch, value /* 'one_lift'|'full_body' */) =>
    dispatch({ type: 'SET_SPLIT_STYLE', value });

/** @returns {{pattern:'2+1'|'3+1',leader:{mainSet:string},anchor:{mainSet:string}}} */
export const selectPhasePlan = (state) => state.phasePlan;
export const setPhasePlan = (dispatch, patch /* partial */) =>
    dispatch({ type: 'SET_PHASE_PLAN', value: patch });

/** @returns {'fsl'|'bbb'|'bbs'|'ssl'} */
export const selectSupplementalSchemeId = (state) => state?.supplemental?.schemeId;
export const setSupplementalSchemeId = (dispatch, schemeId) =>
    dispatch({ type: 'SET_SUPPLEMENTAL', supplemental: { schemeId } });

/** @returns {{push:number,pull:number,core:number}} */
export const selectAssistanceTargets = (state) => state?.assistance?.targets || { push: 75, pull: 75, core: 75 };
export const setAssistanceTargets = (dispatch, patch) =>
    dispatch({ type: 'SET_ASSISTANCE_TARGETS', value: patch });

/** @returns {string[]} */
export const selectAssistanceSelections = (state) => state?.assistance?.selections || [];
export const setAssistanceSelections = (dispatch, selections /* string[] */) =>
    dispatch({ type: 'SET_ASSISTANCE_SELECTIONS', value: selections });

/** @returns {{mode:'deload'|'tm_test',criteria:'afterLeader'|'every7th'}} */
export const selectSeventhWeek = (state) => state.seventhWeek;
export const setSeventhWeek = (dispatch, patch) =>
    dispatch({ type: 'SET_SEVENTH_WEEK', value: patch });

/** @returns {{increments:{upper:number,lower:number},rule:string,criteria:{minReps:number}}} */
export const selectProgression = (state) => state.progression;
export const setProgression = (dispatch, patch) =>
    dispatch({ type: 'SET_PROGRESSION', value: patch });

/** @returns {{trackAmrap:boolean,est1rmFormula:string,prFlags:boolean}} */
export const selectLogging = (state) => state.logging;
export const setLogging = (dispatch, patch) =>
    dispatch({ type: 'SET_LOGGING', value: patch });

/** @returns {{autoPercentCalc:boolean,autoFsl:boolean,autoDeload:boolean,autoTmUpdate:boolean}} */
export const selectAutomation = (state) => state.automation;
export const setAutomation = (dispatch, patch) =>
    dispatch({ type: 'SET_AUTOMATION', value: patch });

/** @returns {boolean} */
export const selectIncludeWarmupsGlobal = (state) => !!state.includeWarmups;
export const setIncludeWarmupsGlobal = (dispatch, value /* boolean */) =>
    dispatch({ type: 'SET_INCLUDE_WARMUPS_GLOBAL', value });
