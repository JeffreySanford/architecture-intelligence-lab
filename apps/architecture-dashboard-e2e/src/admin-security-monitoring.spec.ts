import { test, expect } from '@playwright/test';
import { mockLandingApi } from './support/mock-landing-api';

const adminRoute = '/lab/admin';

test.describe('Admin security monitoring', () => {
  test('should allow admin persona to open the security monitoring dashboard', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await expect(page.locator('text=Loaded')).toBeVisible({ timeout: 15000 });

    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page).toHaveURL(/.*\/lab\/dashboard(\?.*)?$/, { timeout: 30000 });

    await page.goto(adminRoute);
    await expect(page).toHaveURL(/.*\/lab\/admin(\?.*)?$/, { timeout: 15000 });
    await expect(page.locator('app-admin-page h1', { hasText: 'Admin Security Monitoring' })).toBeVisible();
    await expect(page.locator('[data-testid="security-item-row"]')).toHaveCount(5);
    await expect(page.locator('tr[data-testid="security-item-row"] .p-tag', { hasText: 'issue' }).first()).toBeVisible();
    await expect(page.locator('tr[data-testid="security-item-row"] .p-tag', { hasText: 'watch' }).first()).toBeVisible();
  });

  test('should block non-admin persona from opening the admin route', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await expect(page.locator('text=Loaded')).toBeVisible({ timeout: 15000 });

    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Alice Viewer' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page.locator('a', { hasText: 'Admin Security Monitoring' })).toHaveCount(0);

    await page.goto(adminRoute);

    await expect(page).not.toHaveURL(/.*\/lab\/admin$/);
    await expect(page).toHaveURL(/.*\/lab\/dashboard(\?.*)?$/);
    await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  });
});
