import React, { lazy } from 'react';
import { DEFAULT_CONDITIONING_OPTIONS } from '../../../../lib/fiveThreeOne/conditioningLibrary.js';
import {
    validateFundamentals,
    validateTemplate,
    validateScheduleWarmup,
    validateCycleLoading,
    validateAssistance,
    validateConditioning,
    validateAdvanced
} from '../../../../lib/fiveThreeOne/validation.js';

/**
 * 5/3/1 Wizard — 7-step flow + validation + status badges
 * Order:
 * 1) Program Fundamentals
 * 2) Template Selection
 * 3) Schedule & Warm-up Overview
 * 4) Cycle Structure & Loading (incl. deload, progression, reset)
 * 5) Assistance (BBB or Builder or skipped for Jack Shit)
 * 6) Conditioning & Recovery
 * 7) Advanced Customization (optional)
 * 8) Review & Export (view only)
 *
 * Each step includes validation and completion status.
 */

export const STEP_IDS = {
    PROGRAM_FUNDAMENTALS: 'PROGRAM_FUNDAMENTALS',
    TEMPLATE_GALLERY: 'TEMPLATE_GALLERY',
    SCHEDULE_WARMUP: 'SCHEDULE_WARMUP',
    CYCLE_AND_PROGRESSION: 'CYCLE_AND_PROGRESSION',
    ASSISTANCE_ROUTER: 'ASSISTANCE_ROUTER',
    CONDITIONING_RECOVERY: 'CONDITIONING_RECOVERY',
    ADVANCED_CUSTOMIZATION: 'ADVANCED_CUSTOMIZATION',
    ADVANCED_OPTIONS: 'ADVANCED_OPTIONS',
    REVIEW_EXPORT: 'REVIEW_EXPORT',
    FINAL_REVIEW: 'FINAL_REVIEW'
};

export const DEFAULT_WIZARD_STATE = {
    units: 'lb',
    rounding: { increment: 5, mode: 'nearest' },
    tmPercent: 90,
    lifts: { squat: {}, bench: {}, deadlift: {}, press: {} },
    coreLiftsEnabled: { squat: true, bench: true, deadlift: true, press: true },
    template: null,
    templateConfig: { bbbPair: 'same', bbbPercent: 60, bwTarget: 75 },
    loading: { option: 1, previewWeek: 1 },
    increments: { upper: 5, lower: 10 },
    prs: {
        squat: { bestE1RM: null },
        bench: { bestE1RM: null },
        deadlift: { bestE1RM: null },
        press: { bestE1RM: null },
    },
    schedule: {
        frequency: '4day',
        days: [
            { id: 'D1', lift: 'press' },
            { id: 'D2', lift: 'deadlift' },
            { id: 'D3', lift: 'bench' },
            { id: 'D4', lift: 'squat' }
        ],
        threeDayRolling: true,
    },
    warmup: {
        policy: 'standard', // 'standard' | 'minimal' | 'custom'
        custom: [{ pct: 40, reps: 5 }, { pct: 50, reps: 5 }, { pct: 60, reps: 3 }],
        deadliftRepStyle: 'touch', // 'touch' | 'deadstop'
    },
    loadingOption: 1,
    assistancePlan: { byDay: {} },
    // Prompt 8 additions
    assistance: {
        options: {
            bbb: { percent: 50, pairMode: 'same' },
            bodyweight: { minRepsPerExercise: 75 }
        },
        perDay: {
            press: [],
            deadlift: [],
            bench: [],
            squat: []
        }
    },
    caps: {
        maxAssistanceSetsPerDay: 15,
        superset: true
    },
    // Prompt 9 additions
    conditioning: {
        options: { ...DEFAULT_CONDITIONING_OPTIONS },
        weeklyPlan: []
    },
    // Prompt 10 additions
    advanced: {
        autoreg: {},
        specialization: { focus: [], volumeBiasPct: 15 },
        history: { bench: [], press: [], squat: [], deadlift: [] }
    }
};

const steps = [
    // 1) Program Fundamentals (combines 1RM/TM + Core Lifts)
    {
        id: STEP_IDS.PROGRAM_FUNDAMENTALS,
        title: 'Program Fundamentals',
        description: 'Enter 1RMs → set Training Max (85–90%) → choose core lifts & units.',
        component: lazy(() => import('../Step1ProgramFundamentals.jsx')),
        visibleIf: () => true,
        group: 'Basics',
        validate: validateFundamentals
    },

    // 2) Template Selection (early branching)
    {
        id: STEP_IDS.TEMPLATE_GALLERY,
        title: 'Template Selection',
        description: 'Pick BBB, Triumvirate, Periodization Bible, Bodyweight, Jack Shit, or Custom.',
        component: lazy(() => import('../Step2TemplateGallery.jsx')),
        visibleIf: (state) => validateFundamentals(state).isValid,
        group: 'Template',
        validate: validateTemplate
    },

    // 3) Schedule & Warm-up (policy-level)
    {
        id: STEP_IDS.SCHEDULE_WARMUP,
        title: 'Schedule & Warm‑up Overview',
        description: 'Choose 4/3/2/1‑day split & lift order; set global warm‑up policy.',
        component: lazy(() => import('../Step3ScheduleWarmup.jsx')),
        visibleIf: (state) => {
            const t = state || {};
            return !!(t?.templateChoice?.id || t?.template?.id || t?.template);
        },
        group: 'Basics',
        validate: validateScheduleWarmup
    },

    // 4) Cycle Structure & Loading (incl. deload + progression + reset)
    {
        id: STEP_IDS.CYCLE_AND_PROGRESSION,
        title: 'Cycle Structure & Loading',
        description: 'Pick loading option; confirm deload, progression, and reset rules.',
        component: lazy(() => import('../Step4CycleAndProgression.jsx')),
        visibleIf: (state) => !!state?.schedule,
        group: 'Execution',
        validate: validateCycleLoading
    },

    // 5) Assistance (BBB page OR builder, or skipped for Jack Shit)
    {
        id: STEP_IDS.ASSISTANCE_ROUTER,
        title: 'Assistance',
        description: 'Configure BBB or build assistance by template/pattern — or skip for Jack Shit.',
        component: lazy(() => import('../Step5AssistanceRouter.jsx')),
        visibleIf: (s) => validateTemplate(s).isValid,
        group: 'Template',
        validate: validateAssistance
    },

    // 6) Conditioning & Recovery
    {
        id: STEP_IDS.CONDITIONING_RECOVERY,
        title: 'Conditioning & Recovery',
        description: 'Prowler/hill sprints frequency; mobility, soft tissue, and sleep targets.',
        component: lazy(() => import('../Step6ConditioningRecovery.jsx')),
        visibleIf: () => true,
        group: 'Support',
        validate: validateConditioning
    },

    // 7) Advanced Customization (optional)
    {
        id: STEP_IDS.ADVANCED_CUSTOMIZATION,
        title: 'Advanced Customization',
        description: 'Auto‑regulation, specialization, PR tracking, printable week.',
        component: lazy(() => import('../Step7AdvancedCustomization.jsx')),
        visibleIf: () => true,
        group: 'Advanced',
        validate: validateAdvanced
    },

    // 8) Review & Export
    {
        id: STEP_IDS.REVIEW_EXPORT,
        title: 'Review & Export',
        description: 'Preview full plan; print/export sheets; save to Supabase.',
        component: lazy(() => import('../ProgramPreview531.jsx')),
        visibleIf: () => true,
        group: 'Review',
        validate: () => ({ isValid: true }) // Always valid for review
    }
    ,
    // 9) Final Review & Start (persist active cycle)
    {
        id: STEP_IDS.FINAL_REVIEW,
        title: 'Review & Start',
        description: 'Confirm settings, export JSON, and start this cycle (local save).',
        component: lazy(() => import('../Step8ReviewAndStart.jsx')),
        visibleIf: () => true,
        group: 'Review',
        validate: () => ({ isValid: true })
    }
];

export function getOrderedSteps(state) {
    const s = state || {};
    return steps.filter(st => (typeof st.visibleIf === 'function' ? st.visibleIf(s) : true));
}

export function getStepById(id) {
    return steps.find(s => s.id === id) || null;
}

export function getFirstStepId(state) {
    return getOrderedSteps(state)[0]?.id || null;
}

export function getNextStepId(currentId, state) {
    const list = getOrderedSteps(state);
    const i = list.findIndex(s => s.id === currentId);
    return i >= 0 && i < list.length - 1 ? list[i + 1].id : null;
}

export function getPrevStepId(currentId, state) {
    const list = getOrderedSteps(state);
    const i = list.findIndex(s => s.id === currentId);
    return i > 0 ? list[i - 1].id : null;
}

export function shouldSkipAssistance(state) {
    return state?.templateChoice?.id === 'jackShit';
}

// New validation utilities
export function validateStep(stepId, state) {
    const step = getStepById(stepId);
    if (!step || !step.validate) {
        return { isValid: true };
    }
    return step.validate(state);
}

export function getStepStatus(stepId, state) {
    const validation = validateStep(stepId, state);
    if (validation.isValid) return 'complete';
    if (validation.errors?.length > 0) return 'error';
    return 'incomplete';
}

export function getAllStepStatuses(state) {
    const statuses = {};
    steps.forEach(step => {
        if (step.id !== STEP_IDS.REVIEW_EXPORT) {
            statuses[step.id] = getStepStatus(step.id, state);
        }
    });
    return statuses;
}

// Alias for UI components
export const getStepStatuses = getAllStepStatuses;

// Rough requirement extractor: returns errors array from validation, else []
export function getStepRequirements(stepId, state) {
    // Prompt 5 strengthened requirements
    const req = [];
    const st = state || {};
    const enabled = st.coreLiftsEnabled || {};
    const lifts = st.lifts || {};
    function liftReady(k) {
        const L = lifts[k] || {};
        return !!(L.tm || L.oneRM || (L.testWeight && L.testReps));
    }

    if (stepId === STEP_IDS.PROGRAM_FUNDAMENTALS) {
        for (const k of ['press', 'deadlift', 'bench', 'squat']) {
            if ((enabled[k] ?? true) && !liftReady(k)) req.push(`Enter 1RM or rep test for ${k}`);
        }
    }

    if (stepId === STEP_IDS.TEMPLATE_GALLERY) {
        if (!st.template && !st?.templateChoice?.id) req.push('Select a template');
        if ((st.template === 'bbb' || st?.templateChoice?.id === 'bbb')) {
            const cfg = st.templateConfig || st?.template?.bbb || {};
            if (!cfg.bbbPercent) req.push('Choose BBB percent');
        }
    }

    if (stepId === STEP_IDS.SCHEDULE_WARMUP) {
        if (!Array.isArray(st?.schedule?.days) || st.schedule.days.length < 1) {
            req.push('Define at least one training day');
        }
        const bad = (st?.schedule?.days || []).find(d => !d.lift);
        if (bad) req.push('Each day must have a main lift');
        const pol = st?.warmup?.policy;
        if (!pol) req.push('Choose a warm-up policy');
        if (pol === 'custom') {
            const arr = st?.warmup?.custom || [];
            if (!arr.length) req.push('Custom warm-up must have at least one row');
            const invalid = arr.find(r => !(Number(r?.pct) > 0 && Number(r?.reps) > 0));
            if (invalid) req.push('Custom warm-up rows need positive % and reps');
        }
    }

    if (stepId === STEP_IDS.CYCLE_AND_PROGRESSION) {
        if (![1, 2].includes(Number(st?.loading?.option))) req.push('Choose a loading option (1 or 2)');
        const pw = Number(st?.loading?.previewWeek);
        if (!(pw >= 1 && pw <= 4)) req.push('Pick a preview week 1–4');
        if (!(Number(st?.rounding?.increment) > 0)) req.push('Rounding increment must be > 0');
        const up = Number(st?.increments?.upper), lo = Number(st?.increments?.lower);
        if (!(up > 0 && lo > 0)) req.push('Set valid TM increments for upper/lower lifts');
    }

    if (stepId === STEP_IDS.ASSISTANCE_ROUTER) {
        // Prompt 8: only require a template selection; Jack Shit is valid (no assistance required)
        const chosen = st?.template?.id || st?.templateChoice?.id || st?.template;
        if (!chosen) req.push('Choose a template in Step 2');
    }

    if (stepId === STEP_IDS.CONDITIONING_RECOVERY) {
        // Recommendation, not a hard fail
        if ((st?.conditioning?.options?.frequency ?? 0) < 2) {
            req.push('Wendler recommends ≥ 2 conditioning sessions/week');
        }
    }

    if (stepId === STEP_IDS.ADVANCED_CUSTOMIZATION) {
        if ((st?.advanced?.specialization?.volumeBiasPct ?? 15) > 20) {
            req.push('Specialization bias >20% may hinder recovery.');
        }
    }

    // Fallback to existing validators for other steps if needed
    if (req.length === 0) {
        const v = validateStep(stepId, state);
        return Array.isArray(v?.errors) ? v.errors : [];
    }
    return req;
}

export function canAdvanceToStep(stepId, state) {
    const step = getStepById(stepId);
    if (!step) return false;

    // Check if prerequisite steps are complete
    const allSteps = getOrderedSteps(state);
    const targetIndex = allSteps.findIndex(s => s.id === stepId);

    for (let i = 0; i < targetIndex; i++) {
        const prereqStep = allSteps[i];
        const status = getStepStatus(prereqStep.id, state);
        if (status === 'error' || status === 'incomplete') {
            return false;
        }
    }

    return true;
}
