import { describe, it, expect } from 'vitest';
import { roundToIncrement, roundUpToIncrement, roundDownToIncrement } from '../rounding.ts';

describe('rounding boundary tests', () => {
    it('nearest tie stays same (182.5 @ 2.5)', () => {
        expect(roundToIncrement(182.5, 2.5)).toBe(182.5);
    });
    // For midpoint boundary exactly on an increment (182.5 / 2.5 = 73.0) floor & ceiling both return 182.5
    it('floor boundary (182.5 stays 182.5)', () => {
        expect(roundDownToIncrement(182.5, 2.5)).toBe(182.5);
    });
    it('ceiling boundary (177.5 stays 177.5)', () => {
        expect(roundUpToIncrement(177.5, 2.5)).toBe(177.5);
    });
    it('increment guard returns Math.round fallback (0 inc)', () => {
        expect(roundToIncrement(123.4, 0)).toBe(Math.round(123.4));
    });
});
