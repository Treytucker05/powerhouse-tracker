/**
 * TODO: ProgramContextV2 - Canonical 5/3/1 Program Store V2
 * This is the new dedicated 5/3/1 context that matches the exact specification.
 * Legacy ProgramContext.jsx remains for existing pages compatibility.
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { applyTemplate } from '../../../lib/templates/index.js';
// Assistance normalization (used for convert-to-custom action)
import { normalizeAssistance } from '../assistance/index.js';

// Local template application helper (dedupes historical dual SET_TEMPLATE branches)
function applyTemplateLocal(state, template) {
    const next = { ...state };
    next.template = template;
    next.templateKey = template; // keep both aligned
    // Reset progression-volatile fields
    next.week = 1;
    next.amrapWk3 = {};
    // Clear any cached preview so UI rebuilds with new template context
    if (next.advanced?.schedulePreview) {
        next.advanced = { ...next.advanced, schedulePreview: null };
    }
    return next;
}

// Initial program state (serializable only - exact spec)
export const initialProgramV2 = {
    pack: null, // active assistance/template pack key (mirrors templateKey when in template mode)
    units: 'lb',
    rounding: 'ceil',
    tmPct: 0.90,
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
    supplemental: { strategy: 'none' },
    assistance: { 1: [], 2: [], 3: [], 4: [], mode: 'minimal' },
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
    amrapWk3: {},
    cycle: 1
};

const ProgramContextV2 = createContext();

function reducerV2(state, action) {
    switch (action.type) {
        case 'SET_ASSISTANCE_LOAD_MODE':
            return { ...state, assistanceLoadMode: action.payload };
        case 'SET_CONDITIONING':
            return { ...state, conditioning: { ...state.conditioning, ...action.payload } };
        case 'SET_UNITS': return { ...state, units: action.units };
        case 'SET_ROUNDING': return { ...state, rounding: action.rounding };
        case 'SET_TM_PCT': return { ...state, tmPct: action.tmPct };
        case 'SET_FLOW_MODE': return { ...state, flowMode: action.payload };
        case 'SET_TEMPLATE_KEY': return { ...state, templateKey: action.payload };
        case 'SET_TEMPLATE_SPEC': return { ...state, templateSpec: action.payload };
        case 'SET_ASSISTANCE_HINT': return { ...state, assistanceHint: action.payload };
        case 'SET_LOADING_OPTION': return { ...state, loadingOption: action.payload };
        case 'SET_ONE_RM': return {
            ...state,
            lifts: { ...state.lifts, [action.lift]: { ...state.lifts[action.lift], oneRM: action.oneRM } }
        };
        case 'SET_TM': return {
            ...state,
            lifts: { ...state.lifts, [action.lift]: { ...state.lifts[action.lift], tm: action.tm } }
        };
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
        default: return state;
    }
}

function useProgramReducerV2() {
    const [state, dispatch] = useReducer(reducerV2, initialProgramV2, (init) => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const raw = window.localStorage.getItem('ph_program_v2');
                return raw ? { ...init, ...JSON.parse(raw) } : init;
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
