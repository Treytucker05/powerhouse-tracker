import { test, expect } from "@playwright/test";

test("macrocycle wizard generates timeline", async ({ page }) => {
  await page.goto("/design/macrocycle");

  // 🟢 Step 1 – basic profile
  await page.getByLabel(/training age/i).selectOption("Intermediate");
  await page.getByRole("button", { name: /next/i }).click();

  // 🟢 Step 2 – volumes (accept defaults)
  await page.getByRole("button", { name: /next/i }).click();

  // 🟢 Step 3 – periodization (accept defaults)
  await page.getByRole("button", { name: /next/i }).click();

  // 🟢 Step 4 – specialization (skip for intermediate)
  await page.getByRole("button", { name: /next/i }).click();

  // 🟢 Step 5 – review → generate
  await page.getByRole("button", { name: /generate plan/i }).click();

  // ✅ Expect timeline cards rendered
  await expect(page.locator("h3")).toHaveCount(6); // Expecting at least 6 weeks in timeline
});
