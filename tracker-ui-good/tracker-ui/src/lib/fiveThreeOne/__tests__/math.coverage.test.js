import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { e1RM, percentOfTM, getUnit, setUnit, getIncrementForUnit, toDisplayWeight } from '../math.js';
import { roundToIncrement } from '../../math/rounding.ts';

// JSDOM provides localStorage; safety shim for non-browser envs
const hasLocal = typeof localStorage !== 'undefined';

function resetUnit() {
    if (hasLocal) localStorage.removeItem('unit');
}

describe('fiveThreeOne math helpers (coverage)', () => {
    beforeEach(() => resetUnit());
    afterEach(() => resetUnit());

    it('e1RM returns 0 for missing inputs and computes expected value', () => {
        expect(e1RM(0, 5)).toBe(0);
        expect(e1RM(200, 0)).toBe(0);
        // 200 * 5 * 0.0333 + 200 = 233.3 (1 decimal)
        expect(e1RM(200, 5)).toBe(233.3);
    });

    it('percentOfTM delegates rounding and supports alias rounding modes', () => {
        // nearest (default)
        expect(percentOfTM(200, 85, 5, 'nearest')).toBe(170); // 170 exact
        // up -> ceiling alias
        // 202 * .85 = 171.7 -> ceiling to 175
        expect(percentOfTM(202, 85, 5, 'up')).toBe(175);
        // down -> floor alias
        // 202 * .85 = 171.7 -> floor to 170
        expect(percentOfTM(202, 85, 5, 'down')).toBe(170);
    });

    it('unit getters/setters default to lb and switch to kg correctly', () => {
        expect(getUnit()).toBe('lb');
        setUnit('KG');
        expect(getUnit()).toBe('kg');
        expect(getIncrementForUnit()).toBe(2.5);
        setUnit('lb');
        expect(getIncrementForUnit()).toBe(5);
    });

    it('toDisplayWeight rounds according to current unit increment', () => {
        setUnit('kg');
        // 173 nearest 2.5 -> 172.5
        expect(toDisplayWeight(173)).toBe(roundToIncrement(173, 2.5, 'nearest'));
        setUnit('lb');
        // 173 nearest 5 -> 175
        expect(toDisplayWeight(173)).toBe(175);
    });
});
