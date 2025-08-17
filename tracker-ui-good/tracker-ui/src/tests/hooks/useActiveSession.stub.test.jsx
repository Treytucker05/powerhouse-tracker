import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useActiveSession } from '@/hooks/useActiveSession';

describe('useActiveSession stub', () => {
    it('exposes default session shape', () => {
        const { result } = renderHook(() => useActiveSession());
        expect(result.current.activeSession).toBeTruthy();
        expect(result.current.activeSession).toHaveProperty('id');
        expect(Array.isArray(result.current.activeSession.planned_sets) || result.current.activeSession.planned_sets === null).toBe(true);
    });
});
