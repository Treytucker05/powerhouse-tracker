import '@testing-library/jest-dom/vitest';
import { afterEach, afterAll, vi } from 'vitest';
import { beforeEach } from 'vitest';
import * as ReactNamespace from 'react';
// Provide global React for older test patterns that assume it (avoid per-file import churn)
// @ts-ignore
globalThis.React = ReactNamespace;

// Provide a minimal localStorage shim for jsdom if missing
if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map<string, string>();
    // @ts-ignore
    globalThis.localStorage = {
        getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
        setItem: (k: string, v: string) => { store.set(k, String(v)); },
        removeItem: (k: string) => { store.delete(k); },
        clear: () => { store.clear(); },
        key: (i: number) => Array.from(store.keys())[i] ?? null,
        get length() { return store.size; },
    };
}

// Polyfill ResizeObserver (needed by recharts / responsive containers in jsdom)
if (typeof globalThis.ResizeObserver === 'undefined') {
    // @ts-ignore
    globalThis.ResizeObserver = class {
        observe() { /* noop */ }
        unobserve() { /* noop */ }
        disconnect() { /* noop */ }
    };
}

// Polyfill matchMedia if components use it for responsive logic
if (typeof globalThis.matchMedia === 'undefined') {
    // @ts-ignore
    globalThis.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { }, // deprecated
        removeListener: () => { }, // deprecated
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    });
}

afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
});

// Optional heartbeat to detect apparent stalls. Enable by running with VITEST_HEARTBEAT_MS (e.g. 5000)
// @ts-ignore augment global for heartbeat handle
if (typeof process !== 'undefined' && process.env?.VITEST_HEARTBEAT_MS && !globalThis.__vitestHeartbeat) {
    const ms = Number(process.env.VITEST_HEARTBEAT_MS) || 5000;
    // @ts-ignore store handle
    globalThis.__vitestHeartbeat = setInterval(() => {
        // Use a simple prefix so it is easy to grep/filter
        // Intentionally lightweight to avoid flooding output if ms is small
        // eslint-disable-next-line no-console
        console.log(`[vitest-heartbeat] still running at ${new Date().toISOString()}`);
    }, ms);
}

// Per-test timing & watchdog instrumentation (opt-in via env flags)
if (typeof process !== 'undefined') {
    const enableTiming = !!process.env.VITEST_PER_TEST_TIMING;
    const watchdogMs = Number(process.env.VITEST_WATCHDOG_MS || 0) || 0; // separate from heartbeat
    let currentStart = 0;
    let lastActivity = Date.now();
    let currentTestName = '';

    if (enableTiming) {
        beforeEach((ctx) => {
            currentStart = Date.now();
            // @ts-ignore attempt multiple property paths for name
            currentTestName = ctx?.task?.name || ctx?.meta?.name || 'unknown';
            lastActivity = currentStart;
            // eslint-disable-next-line no-console
            console.log(`[test-start] ${currentTestName}`);
        });
        afterEach((ctx) => {
            const end = Date.now();
            lastActivity = end;
            // @ts-ignore
            const name = ctx?.task?.name || ctx?.meta?.name || currentTestName || 'unknown';
            const dur = end - currentStart;
            // eslint-disable-next-line no-console
            console.log(`[test-end] ${name} (${dur}ms)`);
        });
    }

    // @ts-ignore non-standard global caretaker property
    if (watchdogMs > 0 && !globalThis.__vitestWatchdog) {
        // @ts-ignore store handle
        globalThis.__vitestWatchdog = setInterval(() => {
            const now = Date.now();
            const idle = now - lastActivity;
            if (idle >= watchdogMs) {
                // eslint-disable-next-line no-console
                console.log(`[vitest-watchdog] No test activity for ${idle}ms. Last test: ${currentTestName || 'n/a'}`);
                lastActivity = now; // avoid spamming every tick
            }
        }, Math.min(watchdogMs, 10000));
    }
}

// Ensure any instrumentation intervals are cleared so test run can exit cleanly
afterAll(() => {
    try { vi.useRealTimers(); } catch { /* ignore */ }
    // @ts-ignore
    if (globalThis.__vitestHeartbeat) {
        // @ts-ignore
        clearInterval(globalThis.__vitestHeartbeat);
        // @ts-ignore
        delete globalThis.__vitestHeartbeat;
    }
    // @ts-ignore
    if (globalThis.__vitestWatchdog) {
        // @ts-ignore
        clearInterval(globalThis.__vitestWatchdog);
        // @ts-ignore
        delete globalThis.__vitestWatchdog;
    }
});
