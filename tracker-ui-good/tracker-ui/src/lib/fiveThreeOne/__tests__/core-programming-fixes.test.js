// Test to verify our core programming fixes
import { describe, it, expect } from 'vitest';
import { calcMainSets, buildProgram } from '../compute531.js';

describe('Core Programming Fixes Verification', () => {
    const sampleTM = 200;
    const rounding = { increment: 5, mode: 'nearest' };

    it('5s PRO correctly disables AMRAP and forces 5 reps', () => {
        // Test 5s PRO programming
        const fivesPro = calcMainSets(sampleTM, {
            week: 3, // Week 3 normally has 1+ AMRAP
            option: 1,
            increment: 5,
            mode: 'nearest',
            programmingApproach: 'basic',
            supplementalType: '5spro'
        });

        fivesPro.forEach(set => {
            expect(set.reps).toBe(5); // All sets should be 5 reps
            expect(set.amrap).toBe(false); // No AMRAP sets
        });
    });

    it('Leader phase correctly disables AMRAP but keeps original reps', () => {
        // Test Leader/Anchor programming
        const leader = calcMainSets(sampleTM, {
            week: 1, // Week 1 normally has 5+ AMRAP
            option: 1,
            increment: 5,
            mode: 'nearest',
            programmingApproach: 'leaderAnchor',
            cyclePhase: 'leader'
        });

        // Should maintain week 1 rep scheme (5/5/5) but no AMRAP
        expect(leader).toHaveLength(3);
        expect(leader[0].reps).toBe(5);
        expect(leader[1].reps).toBe(5);
        expect(leader[2].reps).toBe(5);
        expect(leader[2].amrap).toBe(false); // Last set should not be AMRAP
    });

    it('Standard programming maintains AMRAP on last sets', () => {
        // Test standard programming maintains AMRAP
        const standard = calcMainSets(sampleTM, {
            week: 1,
            option: 1,
            increment: 5,
            mode: 'nearest',
            programmingApproach: 'basic',
            supplementalType: null
        });

        expect(standard[2].amrap).toBe(true); // Last set should be AMRAP
    });

    it('Deload week (week 4) never has AMRAP regardless of programming', () => {
        // Test that week 4 never has AMRAP
        const deload = calcMainSets(sampleTM, {
            week: 4,
            option: 1,
            increment: 5,
            mode: 'nearest',
            programmingApproach: 'basic',
            supplementalType: null
        });

        deload.forEach(set => {
            expect(set.amrap).toBe(false); // No AMRAP on deload
        });
    });

    it('Programming approach affects main set generation correctly', () => {
        // Verify that different programming approaches produce different results
        const basic = calcMainSets(sampleTM, 1, 1, rounding);
        const fivesPro = calcMainSets(sampleTM, 1, 1, rounding, {
            programmingApproach: 'basic',
            supplementalType: '5spro'
        });

        // Should be same weights but different rep schemes
        expect(basic[0].weight).toBe(fivesPro[0].weight);
        expect(basic[2].amrap).toBe(true);
        expect(fivesPro[2].amrap).toBe(false);
        expect(fivesPro[2].reps).toBe(5);
    });
});
