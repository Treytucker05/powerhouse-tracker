// vitest.setup.js  – polyfill for Recharts in Vitest
import { vi } from 'vitest';
import React from 'react';

// Global stubs for DOM APIs and React
globalThis.window = globalThis.window || global;
globalThis.document = globalThis.document || {
  getElementById: () => null,
  createElement: () => ({ appendChild: () => {}, style: {} }),
  body: { appendChild: () => {} }
};
globalThis.navigator = globalThis.navigator || { userAgent: 'test' };
globalThis.React = React;

// ResizeObserver polyfill for Recharts - simple stub
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
if (typeof window !== 'undefined') {
  window.ResizeObserver = ResizeObserver;
}

// Supabase environment variables
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-key'

/* ----- extra browser shims for legacy suites ----- */
if (!global.window) {
  const { JSDOM } = await import('jsdom')
  const { window } = new JSDOM('', { url: 'http://localhost/' })
  global.window   = window
  global.document = window.document
}

global.document ||= global.window?.document
global.React    ||= (await import('react')).default

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

