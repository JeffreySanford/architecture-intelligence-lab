import { test, expect, type Page } from '@playwright/test';
import { mockLandingApi } from './support/mock-landing-api';

const reducedMotionTransitionPattern = /none|0s|0\.00001s|1e-05s/;

const navItem = (page: Page, label: string) =>
  page.locator('.app-frame__nav-item', {
    has: page.locator('.app-frame__nav-label', { hasText: label }),
  });

test.describe('Visual smoke - Phase 9', () => {
  test('route transition wrapper is present and navigates through native animation routes', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    const transitionWrapper = page.locator('.route-transition');
    await expect(transitionWrapper).toBeVisible();

    await page.click('button:has-text("Enter As")');
    await expect(page).toHaveURL(/.*\/lab\/dashboard/);
    await expect(transitionWrapper).toBeVisible();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Dashboard');
  });

  test('permission-driven nav updates and protected lab page content smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page).toHaveURL(/.*\/lab\/dashboard/);
    await expect(page.locator('.app-frame__nav-item', { hasText: 'Admin' })).toBeVisible();
    await expect(page.locator('.app-frame__nav-item', { hasText: 'Realtime Lab' })).toHaveCount(0);

    await page.locator('.app-frame__nav-item', { hasText: 'Security Search' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Security Search');
    await expect(page.locator('.app-frame__content-header span')).toContainText('PrimeNG lazy table');
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('backend comparison route transition and protected content smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page).toHaveURL(/.*\/lab\/dashboard/);
    await expect(page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' })).toBeVisible();
    await expect(page.locator('.app-frame__nav-item', { hasText: 'OpenAPI' })).toHaveCount(0);

    await page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Backend Comparison');
    await expect(page.locator('.app-frame__content-header span')).toContainText('Compare Spring direct');
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('app brand shows the PrimeNG chart icon and animation-ready header', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await expect(page.locator('.app-frame__brand-icon.pi.pi-chart-line')).toBeVisible();
    await expect(page.locator('.app-frame__content-header')).toBeVisible();
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('Architecture Flow smoke covers request path graph and route transition', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await page.locator('.app-frame__nav-item', { hasText: 'Architecture Flow' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Architecture Flow');
    await expect(page.locator('svg[aria-label="Architecture flow graph"]')).toBeVisible();
    await expect(page.locator('.route-transition')).toBeVisible();

    await page.locator('.architecture-flow__path-button', { hasText: 'Spring direct' }).click();
    await expect(page.locator('.architecture-flow__link--active')).toBeVisible();
  });

  test('Map Inspector smoke covers bucket diagram and index state', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await page.locator('.app-frame__nav-item', { hasText: 'Map Inspector' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Map Inspector');
    await expect(page.locator('svg[aria-label="Map bucket diagram"]')).toBeVisible();
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('SignalStore Inspector smoke covers the signal-store graph', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await page.locator('.app-frame__nav-item', { hasText: 'SignalStore Inspector' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('SignalStore Inspector');
    await expect(page.locator('svg[aria-label="SignalStore dependency graph"]')).toBeVisible();
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('OpenAPI contract tree smoke proves the D3 contract tree is rendered', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await navItem(page, 'OpenAPI').click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('OpenAPI Contract Lab');
    await expect(page.locator('svg[aria-label="OpenAPI contract tree"]')).toBeVisible();
    await expect(page.locator('.openapi__tree-node-label', { hasText: 'OpenAPI Contract Tree' })).toBeVisible();
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('OpenAPI route transition and reduced-motion smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(navItem(page, 'OpenAPI')).toBeVisible();
    await navItem(page, 'OpenAPI').click();

    await expect(page.locator('.app-frame__content-header h2')).toHaveText('OpenAPI Contract Lab');
    await expect(page.locator('.app-frame__content-header span')).toContainText('generated client status');
    await expect(page.locator('.route-transition')).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.locator('.route-transition')).toBeVisible();
    const transitionValue = await page.locator('.route-transition').evaluate((element) =>
      window.getComputedStyle(element).transition,
    );
    expect(transitionValue).toMatch(reducedMotionTransitionPattern);
  });

  test('Phase 6.5 security artifact pages are accessible to admin personas', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await page.goto('/lab/security-risk-map');
    await expect(page.locator('app-security-risk-map-page h1')).toHaveText('Phase 6.5 Security Risk Map');
    await expect(page.locator('a[href="/planning/phase-6-5-security-risk-map.md"]')).toBeVisible();

    await page.goto('/lab/security-threat-model');
    await expect(page.locator('app-security-threat-model-page h1')).toHaveText('Phase 6.5 Threat Model');
    await expect(page.locator('app-security-threat-model-page a')).toContainText('Open Phase 6.5 security risk map');
  });

  test('Map Inspector native card enter/leave animation smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await page.locator('.app-frame__nav-item', { hasText: 'Map Inspector' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Map Inspector');
    const diagramCard = page.locator('.map-inspector__diagram-card');
    await expect(diagramCard).toBeVisible();
    await expect(page.locator('svg[aria-label="Map bucket diagram"]')).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(diagramCard).toBeVisible();
    const diagramTransition = await diagramCard.evaluate((element) =>
      window.getComputedStyle(element).transition,
    );
    expect(diagramTransition).toMatch(reducedMotionTransitionPattern);
  });

  test('OpenAPI contract tree card enter/leave animation smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await navItem(page, 'OpenAPI').click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('OpenAPI Contract Lab');
    const treeCard = page.locator('.openapi__tree-card');
    await expect(treeCard).toBeVisible();
    await expect(page.locator('svg[aria-label="OpenAPI contract tree"]')).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(treeCard).toBeVisible();
    const treeTransition = await treeCard.evaluate((element) =>
      window.getComputedStyle(element).transition,
    );
    expect(treeTransition).toMatch(reducedMotionTransitionPattern);
  });

  test('security search details overlay and table interaction smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Alice Viewer' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page.locator('.app-frame__nav-item', { hasText: 'Security Search' })).toBeVisible();
    await page.locator('.app-frame__nav-item', { hasText: 'Security Search' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Security Search');

    await page.locator('button:has-text("Details")').first().click();
    await expect(page.locator('.p-dialog .p-dialog-title')).toContainText('Security Detail');
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('Infrastructure route transition and reduced-motion smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.setViewportSize({ width: 480, height: 960 });
    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page.locator('.app-frame__nav-item', { hasText: 'Infrastructure' })).toBeVisible();
    await page.locator('.app-frame__nav-item', { hasText: 'Infrastructure' }).click();

    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Infrastructure Status');
    await expect(page.locator('.app-frame__content-header span')).toContainText('Review Spring health');
    await expect(page.locator('.route-transition')).toBeVisible();

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await expect(page.locator('.route-transition')).toBeVisible();
    const infraTransitionValue = await page.locator('.route-transition').evaluate((element) =>
      window.getComputedStyle(element).transition,
    );
    expect(infraTransitionValue).toMatch(reducedMotionTransitionPattern);
  });

  test('dashboard chart reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Alice Viewer' }).click();
    await page.click('button:has-text("Enter As")');

    await expect(page).toHaveURL(/.*\/lab\/dashboard/);
    const datasetPrefersReducedMotion = await page.locator('canvas[aria-label="Dashboard loan amount bar chart"]').evaluate((element) =>
      element.getAttribute('data-prefers-reduced-motion'),
    );
    expect(datasetPrefersReducedMotion).toBe('true');
  });

  test('Phase 5 graph reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' }).click();

    const graphPrefersReducedMotion = await page.locator('svg[aria-label*="Phase 5 graph"]').evaluate((element) =>
      element.getAttribute('data-prefers-reduced-motion'),
    );
    expect(graphPrefersReducedMotion).toBe('true');
  });

  test('Phase 5 chart legend reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' }).click();

    const chartSvg = page.locator('svg[aria-label*="Grouped bar chart"]');
    await expect(chartSvg).toHaveAttribute('data-prefers-reduced-motion', 'true');
    await expect(chartSvg.locator('text', { hasText: 'Latency ms' })).toBeVisible();
    await expect(chartSvg.locator('text', { hasText: 'Payload bytes' })).toBeVisible();
    await expect(chartSvg.locator('text', { hasText: 'Records' })).toBeVisible();
  });

  test('Phase 5 flow graph reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' }).click();

    const flowSvg = page.locator('svg[aria-label*="Phase 5 graph"]');
    await expect(flowSvg).toHaveAttribute('data-prefers-reduced-motion', 'true');
    await expect(flowSvg.locator('tspan', { hasText: 'Angular' })).toBeVisible();
    await expect(flowSvg.locator('tspan', { hasText: 'View' })).toBeVisible();
    await expect(flowSvg.locator('text', { hasText: 'Socket.IO Gateway' })).toBeVisible();
  });

  test('OpenAPI card hover reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');
    await navItem(page, 'OpenAPI').click();

    const card = page.locator('.openapi__link').first();
    await expect(card).toBeVisible();
    const transitionValue = await card.evaluate((element) => getComputedStyle(element).transition);
    expect(transitionValue).toMatch(reducedMotionTransitionPattern);
  });

  test('Infrastructure card hover reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Grace Admin' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Infrastructure' }).click();

    const healthCard = page.locator('.infrastructure__health-card');
    await expect(healthCard).toBeVisible();
    const transitionValue = await healthCard.evaluate((element) => getComputedStyle(element).transition);
    expect(transitionValue).toMatch(reducedMotionTransitionPattern);
  });

  test('Phase 5 D3 selection smoke updates chart highlights', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' }).click();

    const firstRow = page.locator('tr[data-testid="comparison-metric-row"]').first();
    await firstRow.click();
    await expect(firstRow).toHaveClass(/phase-five__active-row/);

    const selectedBarCount = await page.locator('svg[aria-label*="Grouped bar chart"]').locator('rect[opacity="1"]').count();
    expect(selectedBarCount).toBeGreaterThan(0);
  });

  test('Security Search row/filter reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Alice Viewer' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Security Search' }).click();

    const transitionValue = await page.locator('.security-search__filters').evaluate((element) =>
      window.getComputedStyle(element).transition,
    );
    expect(transitionValue).toMatch(reducedMotionTransitionPattern);

    const initialRowCount = await page.locator('.security-search__table-card tbody tr').count();
    await page.locator('input[placeholder="CUSIP, security, pool, disclosure"]').fill('a');
    await expect(page.locator('input[placeholder="CUSIP, security, pool, disclosure"]')).toHaveValue('a');

    const filteredRowCount = await page.locator('.security-search__table-card tbody tr').count();
    expect(filteredRowCount).toBeLessThanOrEqual(initialRowCount);
    await expect(page.locator('.security-search__table-card')).toBeVisible();
  });

  test('Security Search empty state and export action smoke', async ({ page }) => {
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Alice Viewer' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Security Search' }).click();

    await page.locator('input[placeholder="CUSIP, security, pool, disclosure"]').fill('not-a-security');
    await expect(page.locator('.security-search__table-card')).toHaveAttribute('data-table-state', 'empty');
    await expect(page.locator('.security-search__empty-row')).toContainText('No securities match');

    await page.locator('button:has-text("Reset")').click();
    await expect(page.locator('.security-search__table-card')).toHaveAttribute('data-table-state', 'results');
    await page.locator('button:has-text("Export")').first().click();
    await expect(page.locator('.security-search__message')).toContainText('Queued export');
  });

  test('Security Search overlay reduced-motion smoke', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Alice Viewer' }).click();
    await page.click('button:has-text("Enter As")');
    await page.locator('.app-frame__nav-item', { hasText: 'Security Search' }).click();

    await page.locator('button:has-text("Details")').first().click();
    await expect(page.locator('.p-dialog')).toBeVisible();

    const dialogTransition = await page.locator('.p-dialog').evaluate((element) =>
      getComputedStyle(element).transition,
    );
    expect(dialogTransition).toMatch(reducedMotionTransitionPattern);
  });

  test('mobile sidebar nav adapts and continues protected route transitions', async ({ page }) => {
    await mockLandingApi(page);

    await page.setViewportSize({ width: 480, height: 900 });
    await page.goto('/');

    await page.locator('p-select[inputid="persona-select"]').click();
    await page.locator('.p-select-option', { hasText: 'Ethan Diagnostics Admin' }).click();
    await page.click('button:has-text("Enter As")');

    const navSection = page.locator('.app-frame__nav-section');
    await expect(navSection).toBeVisible();
    await expect(navSection.evaluate((element) => getComputedStyle(element).flexDirection)).resolves.toBe('row');

    await page.locator('.app-frame__nav-item', { hasText: 'Backend Comparison' }).click();
    await expect(page.locator('.app-frame__content-header h2')).toHaveText('Backend Comparison');
    await expect(page.locator('.route-transition')).toBeVisible();
  });

  test('reduced-motion media query disables route transition animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await mockLandingApi(page);

    await page.goto('/');
    const transitionWrapper = page.locator('.route-transition');
    await expect(transitionWrapper).toBeVisible();

    const transitionValue = await transitionWrapper.evaluate((element) =>
      window.getComputedStyle(element).transition,
    );

    expect(transitionValue).toMatch(reducedMotionTransitionPattern);
  });
});
