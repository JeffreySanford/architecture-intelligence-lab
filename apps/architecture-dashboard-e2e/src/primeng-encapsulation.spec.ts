import { test, expect } from '@playwright/test';
import { mockLandingApi } from './support/mock-landing-api';

test.describe('PrimeNG Encapsulation Lab', () => {
  test('token recovery tab is available and shows the shared suite', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await expect(page.locator('text=Loaded')).toContainText('Loaded');

    await page.click('button:has-text("Enter As")');
    await expect(page).toHaveURL(/.*\/lab\/dashboard(\?.*)?/, { timeout: 30000 });

    await page.goto('/lab/primeng-encapsulation');
    await expect(page.locator('h3', { hasText: 'Normal PrimeNG' })).toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Encapsulation.None Token Recovery")');
    await expect(page.locator('h2', { hasText: 'Encapsulation.None → Token-Based Recovery' })).toBeVisible({ timeout: 15000 });

    await expect(page.locator('.token-recovery-demo')).toBeVisible();
    await expect(page.locator('.prime-demo__page-sample')).toBeVisible();
    await expect(page.locator('app-primeng-encapsulation-shared')).toBeVisible();
    await expect(page.locator('.token-recovery-demo__token')).toHaveCount(4);
    await expect(page.locator('text=Token Source Map')).toBeVisible();
  });
});
