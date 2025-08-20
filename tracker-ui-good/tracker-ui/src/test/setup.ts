import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { supabaseMock } from './mocks/supabase';

// Make React available for legacy JSX tests without explicit import
// @ts-expect-error – global assign for tests
globalThis.React = React;

// ---- Test polyfills for chart/layout libs ----
if (typeof (globalThis as any).ResizeObserver === 'undefined') {
    (globalThis as any).ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}

if (typeof (globalThis as any).IntersectionObserver === 'undefined') {
    (globalThis as any).IntersectionObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
        takeRecords() { return []; }
        root = null; rootMargin = ''; thresholds = [];
    };
}

// --- Hard cleanup for dangling handles (timers, intervals, RAFs) --- //
const _timeouts: any[] = [];
const _intervals: any[] = [];
const _rafs: any[] = [];

const _origSetTimeout = globalThis.setTimeout.bind(globalThis);
const _origClearTimeout = globalThis.clearTimeout.bind(globalThis);
const _origSetInterval = globalThis.setInterval.bind(globalThis);
const _origClearInterval = globalThis.clearInterval.bind(globalThis);
const _origRAF = (globalThis.requestAnimationFrame || ((cb: FrameRequestCallback) => _origSetTimeout(() => cb(performance.now()), 16))) as any;
const _origCAF = (globalThis.cancelAnimationFrame || ((id: number) => _origClearTimeout(id as any))) as any;

globalThis.setTimeout = ((fn: TimerHandler, t?: number, ...args: any[]) => {
    const id = _origSetTimeout(fn as any, t as any, ...args) as unknown as any;
    _timeouts.push(id);
    return id as any;
}) as any;
globalThis.clearTimeout = ((id: any) => { _origClearTimeout(id); }) as any;

globalThis.setInterval = ((fn: TimerHandler, t?: number, ...args: any[]) => {
    const id = _origSetInterval(fn as any, t as any, ...args) as unknown as any;
    _intervals.push(id);
    return id as any;
}) as any;
globalThis.clearInterval = ((id: any) => { _origClearInterval(id); }) as any;

globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    const id = _origRAF(cb) as unknown as any;
    _rafs.push(id);
    return id as any;
}) as any;
globalThis.cancelAnimationFrame = ((id: any) => { _origCAF(id); }) as any;

// (Optional future enhancement) If polyfills tracked instances via __instances Set, we could disconnect all here.
const roSet = (globalThis as any).ResizeObserver?.__instances as Set<any> | undefined;
const ioSet = (globalThis as any).IntersectionObserver?.__instances as Set<any> | undefined;

// Silence noisy console during tests (opt-in: comment out to debug)
const origError = console.error;
const origWarn = console.warn;
beforeAll(() => {
    console.error = (...args: any[]) => {
        const msg = String(args[0] ?? '');
        if (msg.includes('act(...)') || msg.includes('Warning:')) return;
        origError(...args);
    };
    console.warn = (...args: any[]) => {
        const msg = String(args[0] ?? '');
        if (msg.includes('Deprecated') || msg.includes('non-serializable')) return;
        origWarn(...args);
    };
});

// Provide stub Supabase env used by hooks in tests
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'http://test.local';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? 'test-key';

// Global mock handle (if your code reads it)
(globalThis as any).__SUPABASE__ = supabaseMock;

// Mock supabase client creation
vi.mock('@supabase/supabase-js', () => ({ createClient: () => supabaseMock }));

afterEach(() => {
    // Clear timers & rafs
    while (_timeouts.length) _origClearTimeout(_timeouts.pop());
    while (_intervals.length) _origClearInterval(_intervals.pop());
    while (_rafs.length) _origCAF(_rafs.pop());

    // Disconnect any tracked observers if sets available
    if (roSet && roSet.size) roSet.forEach((o: any) => o.disconnect?.());
    if (ioSet && ioSet.size) ioSet.forEach((o: any) => o.disconnect?.());

    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.resetModules();
});

afterAll(() => {
    console.error = origError;
    console.warn = origWarn;
    while (_timeouts.length) _origClearTimeout(_timeouts.pop());
    while (_intervals.length) _origClearInterval(_intervals.pop());
    while (_rafs.length) _origCAF(_rafs.pop());
});

export { }; // module scope
