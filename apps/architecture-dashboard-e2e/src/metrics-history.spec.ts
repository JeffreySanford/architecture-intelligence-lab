import { test, expect } from '@playwright/test';
import { mockPhaseFiveApi } from './support/mock-phase-five-api';

test('Metrics history route renders rolling comparison metrics for diagnostics persona', async ({ page }) => {
  await mockPhaseFiveApi(page, 'ethan-diagnostics-admin');

  await page.goto('/lab/metrics-history');

  await expect(page).toHaveURL(/.*\/lab\/metrics-history$/, { timeout: 15000 });
  await expect(page.locator('app-metrics-history-page h1')).toContainText('Backend Metrics History');
  await expect(page.locator('app-metrics-history-page')).toContainText('Spring direct');
  await expect(page.locator('app-metrics-history-page')).toContainText('Nest proxy');
  await expect(page.locator('app-metrics-history-page')).toContainText('Samples retained');
});
