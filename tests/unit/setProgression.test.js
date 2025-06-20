import { describe, it, expect, beforeEach } from 'vitest';
import { SetProgression } from '../../lib/setProgression.js';

describe('SetProgression', () => {
  let sp;
  beforeEach(() => {
    sp = new SetProgression();
  });
  it('deloads when total ≥5', () => {
    expect(sp.evaluateWeeklyProgression(3, 2).action).toBe('initiate_deload');
  });
  it('deloads when performance ≥4', () => {
    expect(sp.evaluateWeeklyProgression(0, 4).action).toBe('initiate_deload');
  });
  it('adds 2-3 sets when under-stimulated', () => {
    const a = sp.evaluateWeeklyProgression(0, 1);
    expect(['add_2_3_sets'].includes(a.action)).toBeTruthy();
  });
  it('maintains when performance 3', () => {
    expect(sp.evaluateWeeklyProgression(0, 3).action).toBe('maintain_sets');
  });
  it('detects 3-day crash', () => {
    expect(sp.detectPerformanceCrash([3, 4, 3])).toBe(true);
  });
  it('no crash with varied scores', () => {
    expect(sp.detectPerformanceCrash([1, 2, 3])).toBe(false);
  });
  it('adds 1 set normally', () => {
    const res = sp.evaluateWeeklyProgression(0, 2);
    expect(res.action).toBe('add_1_set');
  });
});
