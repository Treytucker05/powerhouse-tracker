import { describe, it, expect } from 'vitest';
import { getVolumeStatus } from '@/components/charts/helpers/volumeStatus';

describe('getVolumeStatus', () => {
    it('handles unknown inputs', () => {
        expect(getVolumeStatus({})).toMatchObject({ status: 'unknown' });
    });
    it('below MEV', () => {
        expect(getVolumeStatus({ volume: 8, mev: 10, mrv: 20 }).status).toBe('below_mev');
    });
    it('within range', () => {
        expect(getVolumeStatus({ volume: 12, mev: 10, mrv: 20 }).status).toBe('within');
    });
    it('above MRV', () => {
        expect(getVolumeStatus({ volume: 24, mev: 10, mrv: 20 }).status).toBe('above_mrv');
    });
});
