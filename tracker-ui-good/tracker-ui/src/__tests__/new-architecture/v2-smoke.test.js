/**
 * v2-smoke.test.js - Quick smoke test for V2 architecture
 * Tests basic functionality of the new 5/3/1 context and engine
 */

import { describe, test, expect } from 'vitest';
import { initialProgramV2 } from '../../methods/531/contexts/ProgramContextV2.jsx';
import { generateCycle, getWeekScheme, roundToIncrement, calcSetWeight } from '../../methods/531';

describe('5/3/1 V2 Architecture Smoke Test', () => {
    test('initialProgramV2 has correct structure', () => {
        expect(initialProgramV2.units).toBe('lb');
        expect(initialProgramV2.rounding).toBe('ceil');
        expect(initialProgramV2.tmPct).toBe(0.90);
        expect(initialProgramV2.lifts.squat.name).toBe('squat');
        expect(initialProgramV2.schedule.variant).toBe('4day');
        expect(initialProgramV2.loading.option).toBe(1);
    });

    test('roundToIncrement works correctly', () => {
        expect(roundToIncrement(267, 'lb', 'ceil')).toBe(270); // rounds up to nearest 5
        expect(roundToIncrement(267, 'kg', 'ceil')).toBe(267.5); // rounds up to nearest 2.5
        expect(roundToIncrement(267, 'lb', 'nearest')).toBe(265); // rounds to nearest 5
    });

    test('getWeekScheme returns correct percentages', () => {
        const week1Option1 = getWeekScheme(1, 0);
        expect(week1Option1).toHaveLength(3);
        expect(week1Option1[0].pct).toBe(65);
        expect(week1Option1[2].amrap).toBe(true);

        const week4 = getWeekScheme(1, 3); // deload week
        expect(week4[0].pct).toBe(40);
        expect(week4[2].amrap).toBe(false); // no amrap on deload
    });

    test('calcSetWeight calculates correctly', () => {
        const tm = 300;
        const weight85pct = calcSetWeight(tm, 85, 'lb', 'ceil');
        expect(weight85pct).toBe(255); // 300 * 0.85 = 255, rounds to 255
    });

    test('generateCycle creates 4-week program', () => {
        const testProgram = {
            ...initialProgramV2,
            lifts: {
                squat: { name: 'squat', oneRM: 400, tm: 300 },
                bench: { name: 'bench', oneRM: 250, tm: 200 },
                deadlift: { name: 'deadlift', oneRM: 500, tm: 400 },
                press: { name: 'press', oneRM: 175, tm: 135 }
            }
        };

        const cycle = generateCycle(testProgram);

        expect(cycle.weeks).toHaveLength(4);
        expect(cycle.weeks[0].index).toBe(1);
        expect(cycle.weeks[3].index).toBe(4); // week 4 exists

        // Check week 4 (deload) has no amrap
        const week4Day1 = cycle.weeks[3].days[0];
        expect(week4Day1.mainSets[2].amrap).toBe(false);

        // Check week 1 has amrap on last set
        const week1Day1 = cycle.weeks[0].days[0];
        expect(week1Day1.mainSets[2].amrap).toBe(true);
    });

    test('program with BBB supplemental generates correctly', () => {
        const bbbProgram = {
            ...initialProgramV2,
            template: 'bbb',
            supplemental: {
                type: 'BBB',
                pairing: 'same',
                pct: 50,
                sets: 5,
                reps: 10
            },
            lifts: {
                squat: { name: 'squat', oneRM: 400, tm: 300 },
                bench: { name: 'bench', oneRM: 250, tm: 200 },
                deadlift: { name: 'deadlift', oneRM: 500, tm: 400 },
                press: { name: 'press', oneRM: 175, tm: 135 }
            }
        };

        const cycle = generateCycle(bbbProgram);
        const day1 = cycle.weeks[0].days[0]; // Press day

        expect(day1.supplemental).toBeTruthy();
        expect(day1.supplemental.lift).toBe('press'); // same pairing
        expect(day1.supplemental.sets).toBe(5);
        expect(day1.supplemental.reps).toBe(10);
        expect(day1.supplemental.pct).toBe(50);
    });
});
