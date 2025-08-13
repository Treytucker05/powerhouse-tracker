import { describe, it, expect, vi, beforeEach } from 'vitest';
import { set, get, remove, saveMacrocycle, loadMacrocycle, loadAllMacrocycles, deleteMacrocycle } from '../lib/storage';

// localStorage is provided by setupTests shim. Ensure clean slate.
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('storage primitives', () => {
  it('set/get/remove round trip', () => {
    set('k1', { a: 1 });
    expect(get('k1')).toEqual({ a: 1 });
    remove('k1');
    expect(get('k1')).toBeNull();
  });
});

describe('macrocycle persistence (local fallback)', () => {
  it('saveMacrocycle creates id and persists record', async () => {
    const id = await saveMacrocycle({ name: 'Test', blocks: [] });
    const loaded = await loadMacrocycle(id);
    expect(loaded).toBeTruthy();
    expect(loaded.name).toBe('Test');
    expect(loaded.id).toBe(id);
  });

  it('loadAllMacrocycles returns sorted list', async () => {
    const id1 = await saveMacrocycle({ name: 'A', blocks: [] });
    // simulate later update by waiting a tick
    await new Promise(r => setTimeout(r, 5));
    const id2 = await saveMacrocycle({ name: 'B', blocks: [] });
    const all = await loadAllMacrocycles();
    expect(all.map(m => m.id)).toEqual([id2, id1]);
  });

  it('deleteMacrocycle removes item', async () => {
    const id = await saveMacrocycle({ name: 'Del', blocks: [] });
    const ok = await deleteMacrocycle(id);
    expect(ok).toBe(true);
    expect(await loadMacrocycle(id)).toBeNull();
  });
});
