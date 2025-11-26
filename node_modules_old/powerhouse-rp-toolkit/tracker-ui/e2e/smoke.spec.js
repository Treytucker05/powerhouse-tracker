import { test, expect } from "@playwright/test";

test("navigation & core pages load", async ({ page }) => {
  // Navigate to the application
  await page.goto("http://localhost:5173");

  // Wait for page to load and check home page elements
  await page.waitForLoadState('networkidle');
  await expect(page.locator("h1:has-text('PowerHouse Tracker')")).toBeVisible();
  await expect(page.locator("text=Weekly Volume")).toBeVisible();
  await expect(page.locator("text=Fatigue Status")).toBeVisible();

  // Test Sessions page
  await page.click("text=Sessions");
  await page.waitForLoadState('networkidle');
  await expect(page.locator("h2", { hasText: "Workout Sessions" })).toBeVisible();
  await expect(page.locator("table")).toBeVisible();

  // Test Intelligence page
  await page.click("text=Intelligence");
  await page.waitForLoadState('networkidle');
  await expect(page.locator("h2", { hasText: "Adaptive RIR" })).toBeVisible();

  // Test Logger page
  await page.click("text=Logger");
  await page.waitForLoadState('networkidle');
  await expect(page.locator("button:has-text('Start Session')")).toBeVisible();
  await expect(page.locator("text=Start New Session")).toBeVisible();

  // Navigate back to home
  await page.click("text=Home");
  await page.waitForLoadState('networkidle');
  await expect(page.locator("h1:has-text('PowerHouse Tracker')")).toBeVisible();
});
