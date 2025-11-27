import { describe, it, expect } from 'vitest';
import { resolveAssistance, resolveSupplemental } from '../renderMap';

const tms = { press: 100, deadlift: 300, bench: 200, squat: 250 } as const;

describe('renderMap assistance & supplemental branches', () => {
    it('assistanceMode minimal produces two targets', () => {
        const res = resolveAssistance({ assistanceMode: 'minimal', templateId: null, conditioningPreset: 'minimal' } as any, 'press');
        expect(res).toHaveLength(2);
    });
    it('assistanceMode template uses template id', () => {
        const res = resolveAssistance({ assistanceMode: 'template', templateId: 'bbb', conditioningPreset: 'standard' } as any, 'press') as any;
        expect((res[0] as any).name).toBe('TEMPLATE_ASSIST');
    });
    it('assistanceMode custom returns empty array', () => {
        const res = resolveAssistance({ assistanceMode: 'custom', templateId: null, conditioningPreset: 'standard' } as any, 'press');
        expect(res).toEqual([]);
    });
    it('supplemental null when no template', () => {
        const week = { sets: [{ pctOfTM: 0.7 }] } as any;
        const sup = resolveSupplemental(null as any, 'press', tms as any, week);
        expect(sup).toBeNull();
    });
});
