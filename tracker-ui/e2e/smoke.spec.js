import { test, expect } from "@playwright/test";

test("navigation & core pages load", async ({ page }) => {
  // Navigate to the application
  await page.goto("http://localhost:5173");

  // Wait for page to load and check home page elements
  await page.waitForLoadState('networkidle');
  
  // Title still visible
  await expect(page.getByRole("heading", { name: /PowerHouseATX/i })).toBeVisible();
  
  // New card heading on dashboard
  await expect(
    page.getByRole("heading", { name: /Current Training Status/i })
  ).toBeVisible();
  
  // Banner should NOT exist (legacy artifact)
  await expect(page.getByText('First-Time Quick-Start Guide')).toHaveCount(0);

  // Switch to Progress page via nav (current React navbar uses <button>)
  await Promise.all([
    page.waitForURL('**/tracking', { timeout: 10_000 }),
    page.getByRole("button", { name: "Progress" }).click()
  ]);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole("heading", { name: /PowerHouseATX/i })).toBeVisible();

  // Navigate back to dashboard
  await Promise.all([
    page.waitForURL('/', { timeout: 10_000 }),
    page.getByRole("button", { name: "Dashboard" }).click()
  ]);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole("heading", { name: /PowerHouseATX/i })).toBeVisible();

  // Verify we're back on dashboard with the training status heading
  await expect(
    page.getByRole("heading", { name: /Current Training Status/i })
  ).toBeVisible();
});
