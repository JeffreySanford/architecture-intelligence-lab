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

test('selecting Adhan Designer does not leave stale loading personas state', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  await expect(page.locator('text=Loaded')).toContainText('Loaded');
  await expect(page.locator('text=Loading personas...')).not.toBeVisible();

  const selectResponsePromise = page.waitForResponse((response) => response.url().includes('/api/dev-auth/personas/adhan-designer/select') && response.status() === 200);
  await page.click('text=Adhan Designer');

  await expect(selectResponsePromise).resolves.toBeTruthy();
  await expect(page.locator('text=Loading personas...')).not.toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Selecting persona...')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Selecting persona...')).not.toBeVisible({ timeout: 15000 });
  await expect(page.locator('button:has-text("Enter As Adhan Designer")')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.landing__persona--selected strong')).toContainText('Adhan Designer');
});

test('selecting Alice Viewer does not leave stale loading personas state', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  await expect(page.locator('text=Loaded')).toContainText('Loaded');
  await expect(page.locator('text=Loading personas...')).not.toBeVisible();

  const selectResponsePromise = page.waitForResponse((response) => response.url().includes('/api/dev-auth/personas/alice-viewer/select') && response.status() === 200);
  const meResponse = page.waitForResponse((response) => response.url().endsWith('/api/me') && response.status() === 200);

  await page.click('text=Alice Viewer');

  await expect(selectResponsePromise).resolves.toBeTruthy();
  await expect(meResponse).resolves.toBeTruthy();
  await expect(page.locator('text=Loading personas...')).not.toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Selecting persona...')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('text=Selecting persona...')).not.toBeVisible({ timeout: 15000 });
  await expect(page.locator('button:has-text("Enter As Alice Viewer")')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.landing__persona--selected strong')).toContainText('Alice Viewer');
});
