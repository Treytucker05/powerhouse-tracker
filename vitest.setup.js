// vitest.setup.js  – polyfill for Recharts in Vitest
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;
if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver;
}

