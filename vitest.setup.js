import { vi } from 'vitest';
import 'fake-indexeddb/auto';         // jsdom <-- storage/mock polyfills

// Provide "jest" global so legacy tests (`@jest/globals`) keep working
globalThis.jest = vi;

// Ensure ts-node / esm parity for lifecycle fns
globalThis.afterAll = afterAll;
globalThis.afterEach = afterEach;
globalThis.beforeAll = beforeAll;
globalThis.beforeEach = beforeEach;

import { beforeAll } from 'vitest';

beforeAll(() => {
  // ── canvas stub for chart-export tests ──────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id    = 'weeklyChart';
  
  // Only append if document.body exists
  if (document.body) {
    document.body.appendChild(canvas);
  }

  HTMLCanvasElement.prototype.getContext = () => ({ measureText: () => ({ width: 100 }) });
  HTMLCanvasElement.prototype.toDataURL  = () => '';

  // ── minimal FileReader mock for importData tests ────────────────────
  global.FileReader = class {
    constructor () { this.result = null; this.onload = null; this.onerror = null; }
    readAsText (f) {
      if (typeof f === 'string') { this.result = f; this.onload?.({ target: this }); }
      else                       { this.onerror?.(new Error('mock FileReader expects string')); }
    }
  };
});

