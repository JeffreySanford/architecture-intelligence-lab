import { test, expect } from '@playwright/test';
import { mockLandingApi } from './support/mock-landing-api';

test('landing page loads personas and enters dashboard with selected persona', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  await expect(page.locator('text=Loaded')).toContainText('Loaded');
  await expect(page.locator('button:has-text("Enter As")')).toBeVisible({ timeout: 15000 });

  await page.click('button:has-text("Enter As")');

  await expect(page).toHaveURL(/.*\/lab\/dashboard(\?.*)?/, { timeout: 30000 });
  await expect(page.locator('app-dashboard-page').getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
