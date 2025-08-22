import { test, expect } from '@playwright/test';

// Drives Steps 1→4 and verifies export persisted locally. Uses dev-only E2E auth bypass.

test('5/3/1 builder: start to finish export', async ({ page }) => {
    // Enable E2E auth bypass before navigation
    await page.addInitScript(() => {
        try { window.localStorage.setItem('ph.e2e.user', '1'); } catch { }
    });

    // Go to app root; ProtectRoute should allow through due to bypass
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to builder step1 via hash change to stay in the same SPA
    await page.evaluate(() => { window.location.hash = '#/build/step1'; });
    await page.waitForTimeout(300); // allow route switch
    await expect(page.getByTestId('step1-next')).toBeVisible({ timeout: 15000 });

    // Wait for method selector buttons to render
    await expect(page.getByRole('button', { name: /Direct TM/i }).first()).toBeVisible({ timeout: 15000 });
    const directButtons = page.getByRole('button', { name: /Direct TM/i });
    const count = await directButtons.count();
    for (let i = 0; i < count; i++) {
        const btn = directButtons.nth(i);
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        const card = btn.locator('xpath=ancestor::div[contains(@class, "p-4")][1]');
        const input = card.locator('input[type="number"]').first();
        await input.fill('100');
    }

    // Proceed to Step 2
    await page.getByTestId('step1-next').click();
    await page.waitForURL('**/build/step2');

    // Choose a template (pick BBB)
    await page.getByTestId('template-bbb').click();
    // Open details panel if needed and click Use This Template, otherwise selection via compare is enough
    const detailsPanel = page.getByTestId('template-details-panel');
    if (await detailsPanel.isVisible()) {
        const useBtn = detailsPanel.getByRole('button', { name: /Use This Template/i });
        if (await useBtn.count()) {
            await useBtn.click();
        }
    }

    // Next to Step 3
    await page.getByTestId('step2-next').click();
    await page.waitForURL('**/build/step3');

    // In Step 3, ensure a scheme is selected if required; default main set option is fine
    // Navigate Next to Step 4
    await page.getByRole('button', { name: /^Next$/i }).click();
    await page.waitForURL('**/build/step4');

    // Verify preview renders Week tabs and Day cards
    await expect(page.getByTestId('week-tabs')).toBeVisible();
    await expect(page.getByTestId('week-tab-1')).toBeVisible();
    await expect(page.getByTestId('week-content')).toBeVisible();

    // Export Program and verify localStorage updated
    await page.getByTestId('export-json').click();
    const exported = await page.evaluate(() => {
        return window.localStorage.getItem('currentProgram');
    });
    expect(exported).toBeTruthy();

    // Optionally assert shape
    const payload = JSON.parse(exported!);
    expect(payload?.methodology).toBe('531');
    expect(Array.isArray(payload?.generated?.weeks)).toBeTruthy();
});
