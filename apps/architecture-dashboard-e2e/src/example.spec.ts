import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { mockLandingApi } from './support/mock-landing-api';

test('has title', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  await expect(page.locator('app-landing-page h1')).toContainText('Architecture Intelligence Lab');
});

test('loads capital markets route after selecting a persona', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');

  const alicePersona = page.locator('.landing__persona', { hasText: 'Alice Viewer' }).first();
  await expect(alicePersona).toBeVisible({ timeout: 15000 });

  await alicePersona.click();
  await expect(page.locator('.landing__persona--selected strong')).toContainText('Alice Viewer', {
    timeout: 30000,
  });

  await page.goto('/lab/capital-markets');
  await expect(page).toHaveURL(/.*\/lab\/capital-markets$/, {
    timeout: 15000,
  });

  await expect(page.locator('app-capital-markets-page h1')).toContainText('Security Commitment Grid');
  await expect(page.locator('app-capital-markets-page')).toContainText('Commitment');
});

test('serves the app root from the configured e2e frontend', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');
  await expect(page).toHaveURL(/.*\/$/);
  await expect(page.locator('app-landing-page h1')).toContainText('Architecture Intelligence Lab');
});

test('Nginx config proxies Swagger and OpenAPI routes through /swagger', () => {
  const nginxConfig = readFileSync(
    join(process.cwd(), '..', 'architecture-dashboard', 'nginx', 'default.conf'),
    'utf8',
  );

  expect(nginxConfig).toContain('location /swagger/spring/');
  expect(nginxConfig).toContain('proxy_pass http://spring-api:8080/swagger-ui/index.html;');
  expect(nginxConfig).toContain('rewrite ^/swagger/spring/(.*)$ /swagger-ui/$1 break;');
  expect(nginxConfig).toContain('location = /swagger/spring-json/');
  expect(nginxConfig).toContain('proxy_pass http://spring-api:8080/v3/api-docs;');
  expect(nginxConfig).toContain('location /swagger/nest/');
  expect(nginxConfig).toContain('proxy_pass http://nest-api:3000/swagger/');
  expect(nginxConfig).toContain('location = /swagger/nest-json/');
  expect(nginxConfig).toContain('proxy_pass http://nest-api:3000/swagger-json;');
});
