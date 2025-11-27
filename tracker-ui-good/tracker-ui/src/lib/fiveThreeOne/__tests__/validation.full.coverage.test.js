import { describe, it, expect } from 'vitest';
import {
    validateFundamentals,
    validateTemplate,
    validateScheduleWarmup,
    validateCycleLoading,
    validateAssistance,
    validateConditioning,
    validateAdvanced
} from '../validation.js';

const base = { lifts: { press: {}, deadlift: {}, bench: {}, squat: {} } };

describe('validation full coverage', () => {
    it('validateFundamentals various error paths and success', () => {
        const err = validateFundamentals(base);
        expect(err.isValid).toBe(false);
        const good = validateFundamentals({
            lifts: { press: { tm: 100 }, deadlift: { tm: 300 }, bench: { tm: 200 }, squat: { tm: 250 } },
            tmPct: 0.9,
            rounding: { increment: 5 }
        });
        expect(good.isValid).toBe(true);
    });

    it('validateTemplate errors and success including bad bbb pct', () => {
        expect(validateTemplate({}).isValid).toBe(false);
        expect(validateTemplate({ template: 'bbb', assistance: { options: { bbb: { percent: 55 } } } }).isValid).toBe(false);
        expect(validateTemplate({ template: 'bbb', assistance: { options: { bbb: { percent: 50 } } } }).isValid).toBe(true);
    });

    it('validateScheduleWarmup errors for missing frequency/days and custom warmup invalid row', () => {
        const a = validateScheduleWarmup({ schedule: {}, warmup: { policy: 'custom', custom: [{ pct: 0, reps: 5 }] } });
        expect(a.isValid).toBe(false);
        const b = validateScheduleWarmup({ schedule: { frequency: '4day', days: [{ lift: 'press' }] }, warmup: { policy: 'standard' }, programmingApproach: 'basic' });
        expect(b.isValid).toBe(true);
    });

    it('validateCycleLoading errors and success', () => {
        const bad = validateCycleLoading({ loading: { option: 3, previewWeek: 9 }, rounding: { increment: 0 }, increments: { upper: 0, lower: 0 } });
        expect(bad.isValid).toBe(false);
        const good = validateCycleLoading({ loading: { option: 1, previewWeek: 2 }, rounding: { increment: 5 }, increments: { upper: 5, lower: 10 } });
        expect(good.isValid).toBe(true);
    });

    it('validateAssistance missing template and success', () => {
        expect(validateAssistance({}).isValid).toBe(false);
        expect(validateAssistance({ template: 'jackShit' }).isValid).toBe(true);
    });

    it('validateConditioning session count and methods', () => {
        const a = validateConditioning({ conditioning: { sessionsPerWeek: 8 } });
        expect(a.isValid).toBe(false);
        const b = validateConditioning({ conditioning: { sessionsPerWeek: 3, methods: ['prowler'] } });
        expect(b.isValid).toBe(true);
    });

    it('validateAdvanced RPE cutoff bounds and success', () => {
        const a = validateAdvanced({ advanced: { amrapRPECutoff: 6 } });
        expect(a.isValid).toBe(false);
        const b = validateAdvanced({ advanced: { amrapRPECutoff: 8 } });
        expect(b.isValid).toBe(true);
    });
});
