import { describe, it, expect } from 'vitest';
import { generate531Program } from '../fiveThreeOneGenerator';

// Basic snapshot-ish validation for variants propagation & mainSetOption delta

describe('generate531Program variants & options', () => {
    const baseParams = {
        tms: { press: 110, deadlift: 300, bench: 200, squat: 250 },
        scheduleFrequency: 4 as 4,
        includeDeload: false,
        rounding: 5,
        supplemental: 'bbb',
        assistanceMode: 'balanced',
        liftOrder: ['press', 'deadlift', 'bench', 'squat'] as string[],
        mainSetOption: 1 as 1,
        variants: { press: 'overhead_press', deadlift: 'conventional_deadlift', bench: 'incline_bench', squat: 'back_squat' }
    };

    it('produces different pct pattern when mainSetOption changes', () => {
        const prog1 = generate531Program(baseParams);
        const prog2 = generate531Program({ ...baseParams, mainSetOption: 2 });
        const wk1Day1Pcts1 = prog1.weeks[0].days[0].main?.sets.map(s => s.pct);
        const wk1Day1Pcts2 = prog2.weeks[0].days[0].main?.sets.map(s => s.pct);
        expect(wk1Day1Pcts1).toEqual([65, 75, 85]);
        expect(wk1Day1Pcts2).toEqual([75, 80, 85]);
    });

    it('carries variant codes through meta params', () => {
        const prog = generate531Program(baseParams);
        expect(prog.params.variants?.bench).toBe('incline_bench');
        expect(prog.meta.variantLabels?.bench).toBe('incline_bench');
    });
});
