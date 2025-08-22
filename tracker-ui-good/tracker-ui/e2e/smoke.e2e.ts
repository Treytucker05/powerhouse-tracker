import { test, expect } from '@playwright/test';
// Dev-only auth bypass for local E2E.

test('navigation & core pages load', async ({ page }) => {
    await page.addInitScript(() => {
        try { window.localStorage.setItem('ph.e2e.user', '1'); } catch { }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /Current Training Status/i })).toBeVisible();
});
