import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:1234");
await page.waitForFunction(() => window.Chart || false, { timeout: 5000 }).catch(() => {});

const debug = await page.evaluate(() => {
  const btn = document.getElementById("btnBeginnerPreset");
  if (!btn) return { error: "Button not found" };
  
  const handler = window["btnBeginnerPreset"];
  if (!handler) return { error: "Handler not found on window" };
  
  return {
    handlerType: typeof handler,
    handlerName: handler.name,
    handlerSource: handler.toString(),
    hasStubText: /TODO|stub/i.test(handler.toString()),
    buttonExists: !!btn,
    buttonInnerText: btn.innerText,
    windowKeys: Object.keys(window).filter(k => k.includes("btn")).slice(0, 10)
  };
});

console.log("🔍 Debug Info:", JSON.stringify(debug, null, 2));
await browser.close();
