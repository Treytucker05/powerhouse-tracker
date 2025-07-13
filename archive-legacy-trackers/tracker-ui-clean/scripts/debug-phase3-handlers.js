// Debug script to test Phase-3 handler exposure
// Run with: node scripts/debug-phase3-handlers.js

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { JSDOM } = require('jsdom');

// Set up JSDOM environment
const dom = new JSDOM(`<!DOCTYPE html>
<html>
<head><title>Debug Phase-3 Handlers</title></head>
<body>
  <button id="btnNextWeek">Next Week</button>
  <button id="btnProcessWeeklyAdjustments">Process Weekly Adjustments</button>
  <button id="btnWeeklyIntelligenceReport">Weekly Intelligence Report</button>
  <button id="btnPredictDeloadTiming">Predict Deload Timing</button>
  <button id="btnPlateauAnalysis">Plateau Analysis</button>
</body>
</html>`, {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;
global.location = dom.window.location;
global.navigator = dom.window.navigator;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};
global.MutationObserver = class MutationObserver {
  constructor() {}
  observe() {}
  disconnect() {}
};
global.console = console;

// Mock required modules
global.Chart = { Chart: () => {} };

console.log("Testing Phase-3 handler exposure...\n");

async function testHandlers() {
  try {
    // Import the globals module which should expose all handlers
    await import('../js/ui/globals.js');
    
    const phase3Handlers = [
      'btnNextWeek',
      'btnProcessWeeklyAdjustments', 
      'btnWeeklyIntelligenceReport',
      'btnPredictDeloadTiming',
      'btnPlateauAnalysis'
    ];
    
    let passCount = 0;
    
    console.log("Checking Phase-3 handler exposure on window object:\n");
    
    for (const handlerName of phase3Handlers) {
      const handler = window[handlerName];
      const isFunction = typeof handler === 'function';
      
      console.log(`${handlerName}: ${isFunction ? '✅ FUNCTION' : '❌ ' + typeof handler}`);
      
      if (isFunction) {
        passCount++;
        // Test the handler can be called
        try {
          handler();
          console.log(`  → Handler executed successfully`);
        } catch (error) {
          console.log(`  → Handler execution error: ${error.message}`);
        }
      }
    }
    
    console.log(`\n📊 Phase-3 Handler Coverage: ${passCount}/${phase3Handlers.length} (${Math.round(passCount/phase3Handlers.length*100)}%)`);
    
    if (passCount === phase3Handlers.length) {
      console.log("🎉 All Phase-3 handlers properly exposed!");
    } else {
      console.log("⚠️  Some Phase-3 handlers missing or not functions");
    }
    
  } catch (error) {
    console.error("Error testing handlers:", error.message);
  }
}

testHandlers();
