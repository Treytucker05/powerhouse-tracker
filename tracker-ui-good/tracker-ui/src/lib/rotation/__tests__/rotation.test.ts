import { describe, it, expect } from 'vitest';
import { normalizeRotation, validateRotation } from '../index';

describe('normalizeRotation', () => {
    it('returns empty rotation for 4-day schedule', () => {
        const result = normalizeRotation(undefined, 4);
        expect(result.scheduleFrequency).toBe(4);
        expect(result.normalizedRotation).toEqual([]);
    });

    it('creates default 2-day rotation when none provided', () => {
        const result = normalizeRotation(undefined, 2);
        expect(result.scheduleFrequency).toBe(2);
        expect(result.normalizedRotation).toEqual([
            ['squat', 'bench'],
            ['deadlift', 'press']
        ]);
    });

    it('creates default 3-day rotation when none provided', () => {
        const result = normalizeRotation(undefined, 3);
        expect(result.scheduleFrequency).toBe(3);
        expect(result.normalizedRotation).toEqual([
            ['squat', 'bench', 'deadlift'],
            ['press', 'squat', 'bench'],
            ['deadlift', 'press', 'squat'],
            ['bench', 'deadlift', 'press']
        ]);
    });

    it('preserves valid rotation patterns', () => {
        const validRotation = [
            ['squat', 'bench'],
            ['deadlift', 'press']
        ];
        const result = normalizeRotation(validRotation, 2);
        expect(result.normalizedRotation).toEqual(validRotation);
    });

    it('trims cycles that are too long', () => {
        const longRotation = [
            ['squat', 'bench', 'deadlift'] // 3 lifts for 2-day schedule
        ];
        const result = normalizeRotation(longRotation, 2);
        expect(result.normalizedRotation).toEqual([
            ['squat', 'bench'] // trimmed to 2
        ]);
    });

    it('pads cycles that are too short', () => {
        const shortRotation = [
            ['squat'] // 1 lift for 2-day schedule
        ];
        const result = normalizeRotation(shortRotation, 2);
        expect(result.normalizedRotation[0]).toHaveLength(2);
        expect(result.normalizedRotation[0][0]).toBe('squat');
        expect(result.normalizedRotation[0][1]).toBe('bench'); // padded with next fallback
    });

    it('uses custom fallback lifts when provided', () => {
        const customFallbacks = ['overhead_press', 'back_squat', 'conventional_deadlift', 'bench_press'];
        const result = normalizeRotation(undefined, 2, customFallbacks);
        expect(result.normalizedRotation).toEqual([
            ['overhead_press', 'back_squat'],
            ['conventional_deadlift', 'bench_press']
        ]);
    });
});

describe('validateRotation', () => {
    it('validates 4-day schedules as always valid', () => {
        const result = validateRotation([], 4);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('rejects empty rotation for 2-day schedule', () => {
        const result = validateRotation([], 2);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Rotation cannot be empty for 2-day or 3-day schedules');
    });

    it('rejects cycles with wrong length', () => {
        const badRotation = [
            ['squat', 'bench', 'deadlift'] // 3 lifts for 2-day schedule
        ];
        const result = validateRotation(badRotation, 2);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Cycle 1 has 3 lifts, expected 2');
    });

    it('rejects cycles with duplicate lifts', () => {
        const duplicateRotation = [
            ['squat', 'squat'] // duplicate
        ];
        const result = validateRotation(duplicateRotation, 2);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Cycle 1 contains duplicate lifts');
    });

    it('validates correct rotation patterns', () => {
        const validRotation = [
            ['squat', 'bench'],
            ['deadlift', 'press']
        ];
        const result = validateRotation(validRotation, 2);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('validates 3-day patterns correctly', () => {
        const valid3Day = [
            ['squat', 'bench', 'deadlift'],
            ['press', 'squat', 'bench']
        ];
        const result = validateRotation(valid3Day, 3);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });
});
