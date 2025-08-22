import { test, expect } from '@playwright/test';

// End-to-end: build 5/3/1 via Steps 1→5, then Finish to start an active program and navigate to the active view.

test('5/3/1 builder: finish flow starts active program', async ({ page }) => {
    // Dev-only E2E auth bypass
    await page.addInitScript(() => {
        try { window.localStorage.setItem('ph.e2e.user', '1'); } catch { }
    });

    // Open app and go to Step 1
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => { window.location.hash = '#/build/step1'; });
    await page.waitForTimeout(300);
    await expect(page.getByTestId('step1-next')).toBeVisible({ timeout: 15000 });

    // Enter Direct TM for all lifts (100)
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

    // Next to Step 2
    await page.getByTestId('step1-next').click();
    await page.waitForURL('**/build/step2');

    // Pick BBB template and continue (selection happens via details panel button)
    await page.getByTestId('template-bbb').click();
    // Click "Use This Template" if the action is available
    const useBtn = page.getByRole('button', { name: /Use This Template/i });
    if (await useBtn.count()) {
        await useBtn.first().click();
    }
    await page.getByTestId('step2-next').click();
    await page.waitForURL('**/build/step3');

    // Proceed to Step 4 (scheme can be defaulted)
    await page.getByRole('button', { name: /^Next$/i }).click();
    await page.waitForURL('**/build/step4');

    // Sanity check preview
    await expect(page.getByTestId('week-tabs')).toBeVisible();
    await expect(page.getByTestId('week-tab-1')).toBeVisible();

    // Go to Step 5
    await page.getByTestId('next-step5').click();
    await page.waitForURL('**/build/step5');

    // Finish & Start Program
    await page.getByTestId('finish-start-program').click();
    await page.waitForURL('**/program/531/active');

    // Verify active program present in localStorage
    const raw = await page.evaluate(() => window.localStorage.getItem('ph531.activeProgram.v2'));
    expect(raw).toBeTruthy();
    const payload = JSON.parse(raw!);
    expect(payload?.meta?.units).toBeTruthy();
    expect(Array.isArray(payload?.weeks)).toBeTruthy();

    // Verify Active page renders
    await expect(page.getByRole('heading', { name: /Active 5\/3\/1 Program/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Week 1/i })).toBeVisible();
});
