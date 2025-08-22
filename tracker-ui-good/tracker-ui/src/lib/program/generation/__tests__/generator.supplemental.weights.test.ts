import { describe, it, expect } from 'vitest';
import { generate531Program } from '../fiveThreeOneGenerator';

describe('fiveThreeOneGenerator supplemental weights', () => {
    it('FSL uses first-set weight and pct in supplemental text', () => {
        const program = generate531Program({
            tms: { press: 200, deadlift: 0, bench: 0, squat: 0 },
            scheduleFrequency: 4,
            includeDeload: false,
            rounding: 5,
            schemeId: 'scheme_531',
            supplemental: 'fsl',
            assistanceMode: 'minimal',
            variants: undefined
        });
        const w1d1 = program.weeks[0].days[0];
        // First set in wk1 opt1 is 65% of TM => 130 with rounding 5
        expect(w1d1.supplemental).toContain('FSL');
        expect(w1d1.supplemental).toContain('65%');
        expect(w1d1.supplemental).toContain('(130)');
    });

    it('SSL uses second-set weight and pct in supplemental text', () => {
        const program = generate531Program({
            tms: { press: 200, deadlift: 0, bench: 0, squat: 0 },
            scheduleFrequency: 4,
            includeDeload: false,
            rounding: 5,
            schemeId: 'scheme_531',
            supplemental: 'ssl',
            assistanceMode: 'minimal',
            variants: undefined
        });
        const w1d1 = program.weeks[0].days[0];
        // Second set in wk1 opt1 is 75% of TM => 150 with rounding 5
        expect(w1d1.supplemental).toContain('SSL');
        expect(w1d1.supplemental).toContain('75%');
        expect(w1d1.supplemental).toContain('(150)');
    });
});
