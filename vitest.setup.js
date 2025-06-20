// Global test setup for Vitest (root)
import { expect } from 'vitest';
globalThis.expect = expect;
import('@testing-library/jest-dom');
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
}
