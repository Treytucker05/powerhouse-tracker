import { describe, it, expect } from 'vitest';
import { roundToIncrement, roundUpToIncrement, roundDownToIncrement } from '../lib/math/rounding.ts';

// Focused test suite for centralized rounding utilities, including alias modes.

describe('rounding utilities', () => {
    it('roundToIncrement nearest basic', () => {
        expect(roundToIncrement(182.5, 2.5)).toBe(182.5);
        expect(roundToIncrement(183.6, 2.5)).toBe(182.5); // 73.44 -> rounds down
        expect(roundToIncrement(184, 2.5)).toBe(185);     // 73.6 -> rounds up
    });

    it('round up/down helpers', () => {
        expect(roundUpToIncrement(177.5, 2.5)).toBe(177.5);
        expect(roundUpToIncrement(177.6, 2.5)).toBe(180);
        expect(roundDownToIncrement(182.5, 2.5)).toBe(182.5);
        expect(roundDownToIncrement(182.6, 2.5)).toBe(182.5);
    });

    it('handles alias modes', () => {
        // 177.2 / 2.5 = 70.88 -> ceiling = 71 * 2.5 = 177.5; floor = 70 * 2.5 = 175
        expect(roundToIncrement(177.2, 2.5, 'ceil')).toBe(177.5);
        expect(roundToIncrement(177.2, 2.5, 'up')).toBe(177.5);
        expect(roundToIncrement(177.2, 2.5, 'down')).toBe(175);
    });

    it('invalid increment falls back to Math.round(value)', () => {
        expect(roundToIncrement(177.2, 0)).toBe(Math.round(177.2));
        expect(roundToIncrement(177.2, -5)).toBe(Math.round(177.2));
        expect(roundToIncrement(177.2, NaN as any)).toBe(Math.round(177.2));
    });

    it('non-finite value returns 0', () => {
        expect(roundToIncrement(Number.NaN, 5)).toBe(0);
        expect(roundToIncrement(Infinity, 5)).toBe(0);
    });
});
