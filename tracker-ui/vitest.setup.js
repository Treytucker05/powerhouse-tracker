import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

/* ----- extra browser shims for legacy suites ----- */
if (!global.window) {
  const { JSDOM } = await import('jsdom')
  const { window } = new JSDOM('', { url: 'http://localhost/' })
  global.window   = window
  global.document = window.document
}

global.document ||= global.window?.document
global.React    ||= (await import('react')).default

// Global stubs for DOM APIs and React
globalThis.window = globalThis.window || global;
globalThis.document = globalThis.document || {
  getElementById: () => null,
  createElement: () => ({ appendChild: () => {}, style: {} }),
  body: { appendChild: () => {} }
};
globalThis.navigator = globalThis.navigator || { userAgent: 'test' };
globalThis.React = React;

// ResizeObserver polyfill for Recharts
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver

/* ----- all Supabase keys any test might ask for ----- */
const supaKeys = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]
for (const k of supaKeys)
  process.env[k] ||= 'test-' + k.toLowerCase()

// Import jest-dom matchers
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
