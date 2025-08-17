import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogSet } from '@/hooks/useLogSet';

describe('useLogSet stub', () => {
    it('provides logSet API and state flags', async () => {
        const { result } = renderHook(() => useLogSet());
        expect(typeof result.current.logSet).toBe('function');
        expect(result.current.isLogging).toBe(false);
        expect(result.current.error).toBe(null);
        await act(async () => { await result.current.logSet({ exercise: 'Bench', reps: 5, weight: 100 }); });
    });
});
