import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:1234");
await page.waitForFunction(() => window.Chart || false, { timeout: 5000 }).catch(() => {});

const phase2Handlers = await page.evaluate(() => {
  const handlers = [
    'btnSetupMesocycle',
    'btnShowRIRSchedule', 
    'btnGenerateWeeklyProgram',
    'btnSmartExerciseSelection',
    'btnRiskAssessment'
  ];
  
  return handlers.map(handlerId => {
    const handler = window[handlerId];
    const button = document.getElementById(handlerId);
    
    return {
      id: handlerId,
      handlerExists: !!handler,
      handlerType: typeof handler,
      handlerName: handler?.name,
      buttonExists: !!button,
      hasStubText: handler ? /TODO|stub/i.test(handler.toString()) : false
    };
  });
});

console.log("🔍 Phase-2 Mesocycle Planning Handlers:");
phase2Handlers.forEach(h => {
  const status = h.handlerExists && !h.hasStubText ? "✅ WORKING" : "❌ MISSING/STUB";
  console.log(`${status} ${h.id}: handler=${h.handlerType}, button=${h.buttonExists}`);
});

await browser.close();
