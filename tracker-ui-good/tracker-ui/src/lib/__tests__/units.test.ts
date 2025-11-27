import { test, expect } from 'vitest';
import { incrementFor, UNITS, normalizeUnits, isKg, isLbs, formatWeight, DEFAULT_TM_PCT } from '../units';

test('incrementFor kg', () => {
    expect(incrementFor(UNITS.KG)).toBe(2.5);
    expect(incrementFor('kg')).toBe(2.5);
});

test('incrementFor lbs', () => {
    expect(incrementFor(UNITS.LBS)).toBe(5);
    expect(incrementFor('lbs')).toBe(5);
});

test('normalizeUnits', () => {
    expect(normalizeUnits('kg')).toBe('kg');
    expect(normalizeUnits('kgs')).toBe('kg');
    expect(normalizeUnits('kilograms')).toBe('kg');
    expect(normalizeUnits('lb')).toBe('lbs');
    expect(normalizeUnits('pounds')).toBe('lbs');
    expect(normalizeUnits(undefined)).toBe('lbs');
});

test('isKg / isLbs', () => {
    expect(isKg('kg')).toBe(true);
    expect(isKg('lbs')).toBe(false);
    expect(isLbs('lbs')).toBe(true);
    expect(isLbs('kg')).toBe(false);
    expect(isLbs(undefined)).toBe(true);
});

test('formatWeight', () => {
    expect(formatWeight(135, 'lbs')).toBe('135lbs');
    expect(formatWeight(60, 'kg')).toBe('60kg');
    expect(formatWeight('200', 'lbs')).toBe('200lbs');
    expect(formatWeight('not-a-number', 'lbs')).toBe('not-a-number');
});

test('DEFAULT_TM_PCT', () => {
    expect(DEFAULT_TM_PCT).toBe(0.90);
});
