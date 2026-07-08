import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { mockLandingApi } from './support/mock-landing-api';

const screenshotDir = 'apps/architecture-dashboard-e2e/screenshots';

function screenshotPath(name: string) {
  mkdirSync(screenshotDir, { recursive: true });
  return `${screenshotDir}/${name}`;
}

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

  test('captures snapshots for all PrimeNG encapsulation views', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await expect(page.locator('text=Loaded')).toContainText('Loaded');

    await page.click('button:has-text("Enter As")');
    await expect(page).toHaveURL(/.*\/lab\/dashboard(\?.*)?/, { timeout: 30000 });

    await page.goto('/lab/primeng-encapsulation');
    await expect(page.locator('section.encapsulation-lab')).toBeVisible({ timeout: 15000 });

    const container = page.locator('section.encapsulation-lab');

    await expect(page.locator('button:has-text("Normal PrimeNG")')).toBeVisible();
    await container.screenshot({ path: screenshotPath('primeng-encapsulation-normal.png') });

    await page.click('button:has-text("Encapsulation.None Impact")');
    await expect(page.locator('section.encapsulation-lab--impact')).toBeVisible({ timeout: 15000 });
    await container.screenshot({ path: screenshotPath('primeng-encapsulation-impact.png') });

    await page.click('button:has-text("Fixed / Contained")');
    await expect(page.locator('section.encapsulation-lab--fixed')).toBeVisible({ timeout: 15000 });
    await container.screenshot({ path: screenshotPath('primeng-encapsulation-fixed.png') });

    await page.click('button:has-text("Encapsulation.None Token Recovery")');
    await expect(page.locator('section.encapsulation-lab--tokens')).toBeVisible({ timeout: 15000 });
    await container.screenshot({ path: screenshotPath('primeng-encapsulation-tokens.png') });
  });
});
