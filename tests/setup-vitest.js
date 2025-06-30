// tests/setup-vitest.js
import ResizeObserver from 'resize-observer-polyfill';

// Recharts looks for the ctor on window; JSDOM puts one object behind the other
if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver;
}
global.ResizeObserver = ResizeObserver;
