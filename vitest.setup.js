import { vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import React from 'react';
import 'fake-indexeddb/auto';         // jsdom <-- storage/mock polyfills

// Polyfill for ResizeObserver to support Recharts
import ResizeObserver from 'resize-observer-polyfill';

// Global stubs for DOM APIs and React
globalThis.window = globalThis.window || global;
globalThis.document = globalThis.document || {
  getElementById: () => null,
  createElement: () => ({ appendChild: () => {}, style: {} }),
  body: { appendChild: () => {} }
};
globalThis.navigator = globalThis.navigator || { userAgent: 'test' };
globalThis.React = React;

// Provide "jest" global so legacy tests (`@jest/globals`) keep working
globalThis.jest = vi;

// Ensure ts-node / esm parity for lifecycle fns
globalThis.afterAll = afterAll;
globalThis.afterEach = afterEach;
globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;

// Polyfill ResizeObserver in test environment
if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserver;
}

// Supabase environment variables
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-key'

// Canvas stub for chart.js in JSDOM
if (!global.HTMLCanvasElement) {
  class HTMLCanvasElement extends global.HTMLElement {}
  global.HTMLCanvasElement = HTMLCanvasElement;
  const _create = document.createElement.bind(document);
  document.createElement = (t)=> t==='canvas'
    ? new HTMLCanvasElement()
    : _create(t);
}

beforeAll(() => {
  // ── canvas stub for chart-export tests ──────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id    = 'weeklyChart';
    // Only append if document.body exists
  if (document.body) {
    try {
      document.body.appendChild(canvas);
    } catch (e) {
      // Ignore appendChild errors in test environment
    }
  }

  HTMLCanvasElement.prototype.getContext = () => ({ measureText: () => ({ width: 100 }) });
  HTMLCanvasElement.prototype.toDataURL  = () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  // ── minimal FileReader mock for importData tests ────────────────────
  global.FileReader = class {
    constructor () { this.result = null; this.onload = null; this.onerror = null; }
    readAsText (f) {
      if (typeof f === 'string') { this.result = f; this.onload?.({ target: this }); }
      else                       { this.onerror?.(new Error('mock FileReader expects string')); }
    }
  };
});

