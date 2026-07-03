import { test, expect } from '@playwright/test';
import { mockLandingApi } from './support/mock-landing-api';

test('has title', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  await expect(page.locator('app-landing-page h1')).toContainText('Architecture Intelligence Lab');
});

test('loads capital markets route after selecting a persona', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  const enterButton = page.locator('button:has-text("Enter As")');
  await expect(enterButton).toBeVisible({ timeout: 15000 });
  await enterButton.click();

  await expect(page).toHaveURL(/.*\/lab\/dashboard(\?.*)?/, {
    timeout: 30000,
  });

  await page.goto('/lab/capital-markets');
  await expect(page).toHaveURL(/.*\/lab\/capital-markets$/, {
    timeout: 15000,
  });

  await expect(page.locator('app-capital-markets-page h1')).toContainText('Security Commitment Grid');
  await expect(page.locator('app-capital-markets-page')).toContainText('Commitment');
});
