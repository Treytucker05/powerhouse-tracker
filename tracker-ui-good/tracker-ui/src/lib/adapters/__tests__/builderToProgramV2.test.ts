import { describe, it, expect } from 'vitest';
import { makeV2FromBuilder } from '../builderToProgramV2';

describe('builderToProgramV2 adapter', () => {
    it('maps step1–3 into a minimal v2 snapshot', () => {
        const step1 = { units: 'lb' as const, rounding: 5, tmPct: 0.9, tmTable: { press: 150, deadlift: 400, bench: 225, squat: 315 } };
        const step2 = { schemeId: 'scheme_531' };
        const step3 = { scheduleFrequency: 4 as const, liftOrder: ['press', 'deadlift', 'bench', 'squat'], warmupsEnabled: true, warmupScheme: 'standard', mainSetOption: 1 as const, deload: true, supplemental: 'bbb', assistanceMode: 'balanced' };
        const v2 = makeV2FromBuilder(step1, step2, step3);
        expect(v2.units).toBe('lb');
        expect(v2.trainingMaxes.press).toBe(150);
        expect(v2.schedule.frequency).toBe('4day');
        expect(v2.schedule.includeWarmups).toBe(true);
        expect(v2.loading.option).toBe(1);
        expect(v2.supplemental.strategy).toBe('bbb');
        expect(v2.assistance.mode).toBe('balanced');
    });
});
