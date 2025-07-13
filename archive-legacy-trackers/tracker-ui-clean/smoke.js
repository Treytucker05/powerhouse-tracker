// smoke.js — headless-browser shims + toolkit load check
import { JSDOM }        from 'jsdom';
import { LocalStorage } from 'node-localstorage';

// ── minimal "browser" environment ───────────────────────────────
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window           = window;
global.document         = window.document;
global.MutationObserver = window.MutationObserver;
global.location         = window.location;
global.navigator        = window.navigator;
global.localStorage     = new LocalStorage('./.pwr-rp-data');

// ── load the toolkit ─────────────────────────────────────────────
await import('powerhouse-rp-toolkit');

console.log('Toolkit loads correctly 👍');
