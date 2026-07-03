import { test, expect } from '@playwright/test';
import { mockPhaseFiveApi } from './support/mock-phase-five-api';

const phaseFiveRoute = '/lab/backend-comparison';

test.describe('Phase 5 core route', () => {
  test('should render the core Phase 5 route with comparison metrics, live reads, and realtime history', async ({ page }) => {
    await mockPhaseFiveApi(page, 'ethan-diagnostics-admin');

    await page.goto(phaseFiveRoute);

    await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
    await expect(page.locator('app-phase-five-page h1', { hasText: 'NestJS Comparison And Realtime API' })).toBeVisible();
    await expect(page.locator('.phase-five__card-title', { hasText: 'Comparison Metrics' })).toBeVisible();
    await expect(page.locator('[data-testid="comparison-metric-row"]')).toHaveCount(3);
    await expect(page.locator('.phase-five__card-title', { hasText: 'Live Gateway Loan Reads' })).toBeVisible();
    await expect(page.locator('[data-testid="loan-read-row"]')).toHaveCount(2);
    await expect(page.locator('.phase-five__card-title', { hasText: 'Realtime Event History' })).toBeVisible();
    await expect(page.locator('[data-testid="realtime-event-row"]')).toHaveCount(1);
    await expect(page.locator('.phase-five__status-label')).toHaveText(
      'Nest Swagger UI access is restricted for your persona.',
    );
  });
});
