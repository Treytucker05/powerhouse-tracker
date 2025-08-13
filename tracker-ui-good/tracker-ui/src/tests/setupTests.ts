import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
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
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

afterEach(() => {
  vi.clearAllTimers();
  vi.restoreAllMocks();
});
