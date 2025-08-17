import { describe, it, expect } from 'vitest';
import { buildChartData } from '@/components/charts/helpers/buildChartData';

describe('buildChartData', () => {
    it('decorates items with status and color for all MEV/MRV cases', () => {
        const input = [
            { week: 'W1', total: 8, mev: 10, mrv: 20 },  // below MEV
            { week: 'W2', total: 12, mev: 10, mrv: 20 },  // within
            { week: 'W3', total: 24, mev: 10, mrv: 20 },  // above MRV
            { week: 'W4', total: null, mev: 10, mrv: 20 } // unknown
        ];
        const out = buildChartData(input);
        expect(out).toHaveLength(4);
        expect(out[0].__status).toBe('below_mev');
        expect(out[1].__status).toBe('within');
        expect(out[2].__status).toBe('above_mrv');
        expect(out[3].__status).toBe('unknown');
        expect(out.every(i => typeof i.__color === 'string' && i.__color.length > 0)).toBe(true);
    });

    it('supports legacy volume key fallback', () => {
        const input = [{ volume: 5, mev: 10, mrv: 20 }];
        const out = buildChartData(input);
        expect(out[0].__status).toBe('below_mev');
    });

    it('handles empty input safely', () => {
        expect(buildChartData([])).toEqual([]);
    });
});
