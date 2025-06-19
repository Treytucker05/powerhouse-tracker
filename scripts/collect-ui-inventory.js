import { chromium } from "playwright";
import fs from "fs/promises";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:1234");
  await page
    .waitForFunction(() => window.Chart || false, { timeout: 5000 })
    .catch(() => {});

  const data = await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('button[id^="btn"]')].map(btn => {
    const section =
      btn.closest("details")?.querySelector("summary")?.innerText
        .replace(/\s+/g, " ")
        .trim() || "(no section)";
    const parentForm = btn.closest("form")?.id || "(no form)";
    const relatedInputs = btn.closest("form")?.querySelectorAll("input, select")
      ?.length || 0;
    return {
      id: btn.id,
      label: btn.innerText.trim() || "(no label)",
      section,
      parentForm,
      relatedInputs,
      hasHandler:
        (typeof window[btn.id] === "function" &&
          !/TODO|stub/i.test(window[btn.id]?.toString() || "")) ||
        typeof btn.onclick === "function",
      handlerName: window[btn.id]?.name || btn.onclick?.name || "(none)",
      category: btn.id.includes("calc")
        ? "calculator"
        : btn.id.includes("save")
        ? "storage"
        : btn.id.includes("show")
        ? "display"
        : "other",
    };
  });

  const inputs = [
    ...document.querySelectorAll(
      'input[type="number"], input[type="text"], select'
    ),
  ].map(i => ({
    id: i.id,
    type: i.type || "select",
    section:
      i.closest("details")?.querySelector("summary")?.innerText.trim() ||
      "(no section)",
    placeholder: i.placeholder || "(none)",
  }));

  const algorithms = Object.keys(window).filter(
    k => k.includes("calculate") || k.includes("compute")
  );
  return { buttons, inputs, algorithms };
  });

  await fs.writeFile("buttons.json", JSON.stringify(data, null, 2));
  console.log(
    `inventory collected (${data.buttons.length} buttons) → buttons.json`
  );
  await browser.close();
})();
