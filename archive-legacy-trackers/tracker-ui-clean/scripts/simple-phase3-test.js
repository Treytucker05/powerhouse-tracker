// Simplified debug script to test Phase-3 handlers
// Run with: node scripts/simple-phase3-test.js

console.log("Testing Phase-3 handler implementations...\n");

async function testHandlers() {
  try {
    // Mock the basic window environment
    global.window = {
      dispatchEvent: () => {},
      btnNextWeek: null,
      btnProcessWeeklyAdjustments: null,
      btnWeeklyIntelligenceReport: null,
      btnPredictDeloadTiming: null,
      btnPlateauAnalysis: null
    };
    
    // Mock localStorage
    global.localStorage = {
      getItem: () => '{}',
      setItem: () => {}
    };
    
    // Import the handlers module
    const handlers = await import('../js/ui/buttonHandlers.js');
    
    const phase3Functions = [
      'nextWeek',
      'processWeeklyAdjustments', 
      'weeklyIntelligenceReport',
      'predictDeloadTiming',
      'plateauAnalysis'
    ];
    
    let passCount = 0;
    
    console.log("Checking Phase-3 handler implementations:\n");
    
    for (const funcName of phase3Functions) {
      const func = handlers[funcName];
      const isFunction = typeof func === 'function';
      
      console.log(`${funcName}: ${isFunction ? '✅ EXPORTED' : '❌ NOT FOUND'}`);
      
      if (isFunction) {
        passCount++;
        // Test the handler can be called
        try {
          func();
          console.log(`  → Function executed successfully`);
        } catch (error) {
          console.log(`  → Function execution error: ${error.message}`);
        }
      }
    }
    
    // Check window exposure
    console.log("\nChecking window object exposure:\n");
    const windowHandlers = [
      'btnNextWeek',
      'btnProcessWeeklyAdjustments',
      'btnWeeklyIntelligenceReport', 
      'btnPredictDeloadTiming',
      'btnPlateauAnalysis'
    ];
    
    let windowPassCount = 0;
    for (const handlerName of windowHandlers) {
      const handler = window[handlerName];
      const isFunction = typeof handler === 'function';
      
      console.log(`window.${handlerName}: ${isFunction ? '✅ FUNCTION' : '❌ ' + typeof handler}`);
      
      if (isFunction) {
        windowPassCount++;
      }
    }
    
    console.log(`\n📊 Export Coverage: ${passCount}/${phase3Functions.length} (${Math.round(passCount/phase3Functions.length*100)}%)`);
    console.log(`📊 Window Coverage: ${windowPassCount}/${windowHandlers.length} (${Math.round(windowPassCount/windowHandlers.length*100)}%)`);
    
    if (passCount === phase3Functions.length && windowPassCount === windowHandlers.length) {
      console.log("🎉 All Phase-3 handlers properly implemented and exposed!");
    } else {
      console.log("⚠️  Some Phase-3 handlers missing or not properly exposed");
    }
    
  } catch (error) {
    console.error("Error testing handlers:", error.message);
    console.error(error.stack);
  }
}

testHandlers();
