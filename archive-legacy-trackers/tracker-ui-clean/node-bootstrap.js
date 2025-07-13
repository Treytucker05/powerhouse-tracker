// node-bootstrap.js — Node.js environment polyfills for browser globals
import { JSDOM } from 'jsdom';

let ready = false;

export function bootstrapNodeEnv() {
  if (ready || typeof window !== 'undefined') return;
  
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
  });

  // Core browser globals
  global.window           = dom.window;
  global.document         = dom.window.document;
  global.navigator        = dom.window.navigator;
  global.location         = dom.window.location;
  global.localStorage     = dom.window.localStorage;
  global.sessionStorage   = dom.window.sessionStorage;
  global.MutationObserver = dom.window.MutationObserver;

  // Event system with proper prototype chains
  class NodeEvent extends dom.window.Event {
    constructor(type, init = {}) {
      super(type, init);
      Object.setPrototypeOf(this, NodeEvent.prototype);
    }
  }

  class NodeCustomEvent extends dom.window.CustomEvent {
    constructor(type, init = {}) {
      super(type, init);
      Object.setPrototypeOf(this, NodeCustomEvent.prototype);
    }
  }

  Object.setPrototypeOf(NodeEvent.prototype, dom.window.Event.prototype);
  Object.setPrototypeOf(NodeCustomEvent.prototype, dom.window.CustomEvent.prototype);

  global.Event       = NodeEvent;
  global.CustomEvent = NodeCustomEvent;
  global.EventTarget = dom.window.EventTarget;
  global.HTMLElement = dom.window.HTMLElement;
  global.Element     = dom.window.Element;
  global.Node        = dom.window.Node;

  ready = true;
}

// Auto-bootstrap on import
bootstrapNodeEnv();

export default bootstrapNodeEnv;
