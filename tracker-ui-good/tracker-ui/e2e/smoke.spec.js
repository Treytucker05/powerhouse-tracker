import { test, expect } from "@playwright/test";

test("navigation & core pages load", async ({ page }) => {
  // Dev-only E2E auth bypass before navigation
  await page.addInitScript(() => {
    try { window.localStorage.setItem('ph.e2e.user', '1'); } catch { }
  });

  // Navigate to the application root (dev server baseURL)
  await page.goto('/');

  // Wait for page to load and check dashboard elements
  await page.waitForLoadState('networkidle');

  // Verify dashboard training status card exists
  await expect(
    page.getByRole("heading", { name: /Current Training Status/i })
  ).toBeVisible();

  // Legacy banner should not exist
  await expect(page.getByText('First-Time Quick-Start Guide')).toHaveCount(0);
});
