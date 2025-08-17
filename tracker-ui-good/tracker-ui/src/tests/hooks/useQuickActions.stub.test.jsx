import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuickActions } from '@/hooks/useQuickActions';

describe('useQuickActions stub', () => {
    it('returns action data bundle', () => {
        const { result } = renderHook(() => useQuickActions());
        expect(result.current.data).toBeTruthy();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });
});
