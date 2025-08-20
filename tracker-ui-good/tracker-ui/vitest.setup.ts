// Global Vitest cleanup helpers to prevent hanging test run.
import { afterAll, afterEach, vi } from 'vitest';

// Ensure we always revert to real timers and flush pending timers.
afterEach(() => {
    try { vi.runOnlyPendingTimers(); } catch { }
    try { vi.useRealTimers(); } catch { }
});

// Final cleanup: abort any active intervals/timeouts we might have monkey-patched.
afterAll(() => {
    try { vi.useRealTimers(); } catch { }
});
