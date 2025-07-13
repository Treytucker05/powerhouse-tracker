import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:1234");
await page.waitForFunction(() => window.Chart || false, { timeout: 5000 }).catch(() => {});

const debug = await page.evaluate(() => {
  const btn = document.getElementById("btnSaveVolumeLandmarks");
  const handler = window["btnSaveVolumeLandmarks"];
  
  return {
    buttonExists: !!btn,
    handlerExists: !!handler,
    handlerType: typeof handler,
    handlerName: handler?.name,
    handlerSource: handler?.toString(),
    hasStubText: /TODO|stub/i.test(handler?.toString() || ""),
    hasValidImplementation: !!handler && typeof handler === 'function' && !/TODO.*apply|stub/i.test(handler.toString())
  };
});

console.log("🔍 btnSaveVolumeLandmarks Debug:", JSON.stringify(debug, null, 2));
await browser.close();
