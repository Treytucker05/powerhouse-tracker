import { describe, it, expect } from 'vitest';
import { migrateProgramV2, getTmPct } from './tm.ts';

describe('tm migration utilities', () => {
    it('migrates legacy tmPercent -> tmPct and deletes tmPercent', () => {
        const legacy: any = { tmPercent: 90 };
        const migrated = migrateProgramV2(legacy);
        expect(migrated.tmPct).toBeCloseTo(0.90, 5);
        expect('tmPercent' in migrated).toBe(false);
        expect(getTmPct(migrated)).toBeCloseTo(0.90, 5);
    });

    it('defaults to 0.90 when no tm provided', () => {
        const migrated = migrateProgramV2({});
        expect(migrated.tmPct).toBeCloseTo(0.90, 5);
    });
});
