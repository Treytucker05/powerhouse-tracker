import { describe, it, expect } from 'vitest';
import {
    STEP_IDS,
    getOrderedSteps,
    getStepById,
    getFirstStepId,
    getNextStepId,
    getPrevStepId,
    shouldSkipAssistance,
    validateStep,
    getStepStatus,
    getAllStepStatuses,
    getStepRequirements,
    canAdvanceToStep,
    DEFAULT_WIZARD_STATE
} from '../stepRegistry.js';

function makeState(overrides = {}) { return { ...DEFAULT_WIZARD_STATE, ...overrides }; }

describe('stepRegistry full coverage', () => {
    it('retrieves steps and navigation helpers (with valid fundamentals to include template step)', () => {
        const validFundamentals = makeState({ lifts: { press: { tm: 100 }, deadlift: { tm: 300 }, bench: { tm: 200 }, squat: { tm: 250 } } });
        const steps = getOrderedSteps(validFundamentals);
        expect(steps.length).toBeGreaterThan(0);
        const firstId = getFirstStepId(validFundamentals);
        expect(firstId).toBe(STEP_IDS.PROGRAM_FUNDAMENTALS);
        const next = getNextStepId(firstId, validFundamentals);
        expect(next).toBe(STEP_IDS.TEMPLATE_GALLERY);
        const prevNull = getPrevStepId(firstId, validFundamentals);
        expect(prevNull).toBeNull();
    });

    it('shouldSkipAssistance returns true for jackShit', () => {
        expect(shouldSkipAssistance({ templateChoice: { id: 'jackShit' } })).toBe(true);
    });

    it('validateStep and status logic for fundamentals incomplete vs complete', () => {
        const base = makeState({ lifts: { press: {}, deadlift: {}, bench: {}, squat: {} } });
        const statusIncomplete = getStepStatus(STEP_IDS.PROGRAM_FUNDAMENTALS, base);
        expect(statusIncomplete).toBe('error');
        const ready = makeState({ lifts: { press: { tm: 100 }, deadlift: { tm: 300 }, bench: { tm: 200 }, squat: { tm: 250 } } });
        const statusComplete = getStepStatus(STEP_IDS.PROGRAM_FUNDAMENTALS, ready);
        expect(statusComplete).toBe('complete');
    });

    it('getAllStepStatuses omits REVIEW_EXPORT and uses validateStep', () => {
        const statuses = getAllStepStatuses(makeState());
        expect(statuses[STEP_IDS.REVIEW_EXPORT]).toBeUndefined();
        expect(Object.keys(statuses).length).toBeGreaterThan(3);
    });

    it('getStepRequirements covers branches for each step', () => {
        const s = makeState({
            lifts: { press: {}, deadlift: {}, bench: {}, squat: {} },
            template: null,
            warmup: { policy: 'custom', custom: [] },
            schedule: { frequency: '4day', days: [] },
            loading: { option: 3, previewWeek: 9 },
            rounding: { increment: 0 },
            increments: { upper: 0, lower: 0 },
            conditioning: { options: { frequency: 1 } },
            advanced: { specialization: { volumeBiasPct: 25 } }
        });
        const reqFund = getStepRequirements(STEP_IDS.PROGRAM_FUNDAMENTALS, s);
        expect(reqFund.length).toBeGreaterThan(0);
        const reqTemplate = getStepRequirements(STEP_IDS.TEMPLATE_GALLERY, s);
        expect(reqTemplate).toContain('Select a template');
        const reqSchedule = getStepRequirements(STEP_IDS.SCHEDULE_WARMUP, s);
        expect(reqSchedule).toContain('Define at least one training day');
        const reqCycle = getStepRequirements(STEP_IDS.CYCLE_AND_PROGRESSION, s);
        expect(reqCycle).toContain('Choose a loading option (1 or 2)');
        const reqAssist = getStepRequirements(STEP_IDS.ASSISTANCE_ROUTER, s);
        expect(reqAssist).toContain('Choose a template in Step 2');
        const reqCond = getStepRequirements(STEP_IDS.CONDITIONING_RECOVERY, s);
        expect(reqCond.some(x => x.includes('Wendler recommends'))).toBe(true);
        const reqAdv = getStepRequirements(STEP_IDS.ADVANCED_CUSTOMIZATION, s);
        expect(reqAdv.some(x => x.includes('Specialization bias'))).toBe(true);
    });

    it('canAdvanceToStep respects filtered steps (template hidden when fundamentals invalid)', () => {
        const invalid = makeState({ lifts: { press: {}, deadlift: {}, bench: {}, squat: {} } });
        // Template step not visible => cannot advance to cycle until fundamentals fixed
        expect(canAdvanceToStep(STEP_IDS.CYCLE_AND_PROGRESSION, invalid)).toBe(false);
        const valid = makeState({ lifts: { press: { tm: 100 }, deadlift: { tm: 300 }, bench: { tm: 200 }, squat: { tm: 250 } } });
        expect(canAdvanceToStep(STEP_IDS.TEMPLATE_GALLERY, valid)).toBe(true);
    });

    it('getStepById returns null for unknown', () => {
        expect(getStepById('nope')).toBeNull();
    });
});
