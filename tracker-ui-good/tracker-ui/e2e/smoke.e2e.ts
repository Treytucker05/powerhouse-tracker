import { test, expect } from '@playwright/test';
// Renamed to .e2e.ts to be excluded from Vitest. Run with: npx playwright test e2e/smoke.e2e.ts

test('navigation & core pages load', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /PowerHouseATX/i })).toBeVisible();
});
