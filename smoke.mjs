// --- headless-Node smoke test for powerhouse-rp-toolkit -----------------
import { JSDOM }        from 'jsdom';
import { LocalStorage } from 'node-localstorage';

// 1) spin up a minimal DOM
const { window } = new JSDOM(
  '<!doctype html><html><body></body></html>',
  { url: 'https://localhost/' }          // gives us window.location
);

// 2) expose the globals the toolkit expects
global.window            = window;
global.document          = window.document;
global.MutationObserver  = window.MutationObserver;
global.location          = window.location;
global.navigator         = window.navigator;
global.Event             = window.Event;
global.CustomEvent       = window.CustomEvent;
global.localStorage      = new LocalStorage('./.pwr-rp-data');

// 3) dynamically import the toolkit
import('powerhouse-rp-toolkit')
  .then(() => console.log('Toolkit loads correctly 👍'))
  .catch(err => { console.error('Toolkit failed to load ❌'); console.error(err); });
