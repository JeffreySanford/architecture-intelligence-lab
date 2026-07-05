# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\architecture-dashboard-e2e\src\comparison-and-realtime-api.spec.ts >> MCP Explorer sees only read-only MCP access and cannot open Realtime Lab
- Location: apps\architecture-dashboard-e2e\src\comparison-and-realtime-api.spec.ts:499:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/api/dev-auth/personas/maya-mcp-explorer/select", waiting until "load"

```

# Test source

```ts
  402 |   await expect(page.locator('.phase-five__header-action', { hasText: 'Emit event' })).toBeVisible();
  403 |   await expect(page.locator('[data-testid="realtime-event-row"]', { hasText: 'loan.status.updated' })).toBeVisible();
  404 | 
  405 |   // Placeholder for future live Socket.IO subscription UI updates.
  406 |   // When live socket events are added, this test should assert appended socket event rows appear automatically.
  407 | });
  408 | 
  409 | test('Backend comparison route redirects Contract Admin persona to dashboard', async ({ page }) => {
  410 |   await mockApiForPersona(page, 'fiona-contract-admin');
  411 | 
  412 |   await page.goto('/lab/backend-comparison');
  413 | 
  414 |   await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  415 |   await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  416 | });
  417 | 
  418 | test('Backend Comparison route is protected for Contract Admin but accessible to Realtime Operator', async ({ page }) => {
  419 |   await mockApiForPersona(page, 'fiona-contract-admin');
  420 |   await page.goto('/lab/backend-comparison');
  421 |   await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  422 | 
  423 |   await mockApiForPersona(page, 'grace-realtime-operator');
  424 |   await page.goto('/lab/backend-comparison');
  425 |   await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
  426 |   await expect(page.locator('app-phase-five-page h1', { hasText: 'NestJS Comparison And Realtime API' })).toBeVisible();
  427 | });
  428 | 
  429 | test('Contract Admin can open OpenAPI Contract Lab and see the contract status page', async ({ page }) => {
  430 |   await mockApiForPersona(page, 'fiona-contract-admin');
  431 | 
  432 |   await page.goto('/lab/openapi');
  433 | 
  434 |   await expect(page).toHaveURL(/.*\/lab\/openapi$/, { timeout: 15000 });
  435 |   await expect(page.locator('app-openapi-page h1', { hasText: 'OpenAPI Contract Lab' })).toBeVisible();
  436 |   await expect(page.locator('[data-testid="generated-client-row"]')).toHaveCount(2);
  437 |   await expect(page.locator('app-openapi-page')).toContainText('spring-api-client');
  438 |   await expect(page.locator('app-openapi-page')).toContainText('nest-api-client');
  439 |   await expect(page.locator('app-openapi-page')).toContainText('ComparisonApiService.compareLoans');
  440 |   await expect(page.locator('app-openapi-page')).toContainText('RealtimeEventDto');
  441 |   await expect(page.locator('[data-testid="openapi-drift-status"]')).toContainText('watch');
  442 |   await expect(
  443 |     page.locator('[data-testid="drift-boundary-row"]', {
  444 |       hasText: 'Spring/Nest DTOs to Angular clients',
  445 |     }),
  446 |   ).toContainText('watch');
  447 |   await expect(
  448 |     page.locator('[data-testid="openapi-drift-status"] p', {
  449 |       hasText: 'Generated client contract boundaries are under active watch',
  450 |     }),
  451 |   ).toBeVisible();
  452 | 
  453 |   await page.locator('input[placeholder="Filter drift boundaries"]').fill('watch');
  454 |   await expect(page.locator('[data-testid="drift-boundary-row"]')).toHaveCount(2);
  455 |   await expect(
  456 |     page.locator('[data-testid="drift-boundary-row"]', {
  457 |       hasText: 'Spring/Nest DTOs to Angular clients',
  458 |     }),
  459 |   ).toBeVisible();
  460 | });
  461 | 
  462 | test('Viewer persona cannot open OpenAPI Contract Lab', async ({ page }) => {
  463 |   await mockApiForPersona(page, 'alice-viewer');
  464 | 
  465 |   await page.goto('/lab/openapi');
  466 | 
  467 |   await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  468 |   await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  469 | });
  470 | 
  471 | test('Contract Admin can switch personas and access OpenAPI Contract Lab', async ({ page }) => {
  472 |   await mockApiForPersona(page, 'ethan-diagnostics-admin');
  473 | 
  474 |   await page.goto('/lab/dashboard');
  475 |   await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  476 | 
  477 |   await page.goto('/api/dev-auth/personas/fiona-contract-admin/select');
  478 |   await expect(page.locator('body')).toContainText('Fiona Contract Admin');
  479 | 
  480 |   await page.goto('/lab/openapi');
  481 |   await expect(page).toHaveURL(/.*\/lab\/openapi$/, { timeout: 15000 });
  482 |   await expect(page.locator('app-openapi-page h1', { hasText: 'OpenAPI Contract Lab' })).toBeVisible();
  483 |   await expect(page.locator('app-openapi-page')).toContainText('NestApiFacade');
  484 | });
  485 | 
  486 | test('MCP Explorer persona can open MCP Dashboard and see read-only guidance', async ({ page }) => {
  487 |   await mockApiForPersona(page, 'maya-mcp-explorer');
  488 | 
  489 |   await page.goto('/api/dev-auth/personas/maya-mcp-explorer/select');
  490 |   await expect(page.locator('body')).toContainText('Maya MCP Explorer');
  491 | 
  492 |   await page.goto('/lab/mcp');
  493 |   await expect(page).toHaveURL(/.*\/lab\/mcp$/, { timeout: 15000 });
  494 |   await expect(page.locator('h1', { hasText: 'Angular CLI MCP Guidance' })).toBeVisible();
  495 |   await expect(page.locator('body')).toContainText('Use `.vscode/mcp.json` for Angular CLI MCP configuration');
  496 |   await expect(page.locator('body')).toContainText('It is intentionally read-only and does not execute arbitrary commands from the browser.');
  497 | });
  498 | 
  499 | test('MCP Explorer sees only read-only MCP access and cannot open Realtime Lab', async ({ page }) => {
  500 |   await mockApiForPersona(page, 'maya-mcp-explorer');
  501 | 
> 502 |   await page.goto('/api/dev-auth/personas/maya-mcp-explorer/select');
      |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  503 |   await expect(page.locator('body')).toContainText('Maya MCP Explorer');
  504 | 
  505 |   await page.goto('/lab/dashboard');
  506 |   await expect(page.locator('.app-frame__nav-item', { hasText: 'MCP Dashboard' })).toBeVisible();
  507 |   await expect(page.locator('.app-frame__nav-item', { hasText: 'Realtime Lab' })).toHaveCount(0);
  508 | 
  509 |   await page.goto('/lab/realtime');
  510 |   await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  511 |   await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  512 | 
  513 |   await page.goto('/lab/mcp');
  514 |   await expect(page).toHaveURL(/.*\/lab\/mcp$/, { timeout: 15000 });
  515 |   await expect(page.locator('h1', { hasText: 'Angular CLI MCP Guidance' })).toBeVisible();
  516 | });
  517 | 
  518 | test('Viewer persona cannot open MCP Dashboard', async ({ page }) => {
  519 |   await mockApiForPersona(page, 'alice-viewer');
  520 | 
  521 |   await page.goto('/lab/mcp');
  522 |   await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  523 |   await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  524 | });
  525 | 
  526 | test('Diagnostics persona can select comparison metric rows and highlight the active D3 path', async ({ page }) => {
  527 |   await mockApiForPersona(page, 'ethan-diagnostics-admin');
  528 | 
  529 |   await page.goto('/lab/backend-comparison');
  530 |   await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
  531 | 
  532 |   const targetRow = page.locator('[data-testid="comparison-metric-row"]', { hasText: 'Nest proxy' }).first();
  533 |   await expect(targetRow).toBeVisible();
  534 |   await targetRow.click();
  535 | 
  536 |   await expect(targetRow).toHaveClass(/phase-five__active-row/);
  537 |   await expect(page.locator('svg[aria-label*="Phase 5 graph"]')).toBeVisible();
  538 | });
  539 | 
  540 | test('Realtime Operator can use the dedicated Realtime Lab dashboard', async ({ page }) => {
  541 |   await mockApiForPersona(page, 'grace-realtime-operator');
  542 | 
  543 |   await page.goto('/lab/realtime');
  544 | 
  545 |   await expect(page).toHaveURL(/.*\/lab\/realtime$/, { timeout: 15000 });
  546 |   await expect(page.locator('app-realtime-lab-page h1', { hasText: 'Realtime Redis Lab' })).toBeVisible();
  547 |   await expect(page.locator('[data-testid="realtime-lab-event-row"]')).toHaveCount(1);
  548 |   await expect(page.locator('.realtime-lab__chart', { hasText: 'In Review' })).toBeVisible();
  549 |   await expect(page.locator('.realtime-lab__cache-list', { hasText: 'socket:events:last' })).toBeVisible();
  550 |   await expect(page.locator('.realtime-lab__metric', { hasText: 'In-process adapter fallback' })).toBeVisible();
  551 | 
  552 |   await page.locator('button:has-text("Emit one event")').click();
  553 |   await expect(page.locator('[data-testid="realtime-lab-event-row"]')).toHaveCount(2);
  554 |   await expect(page.locator('[data-testid="realtime-lab-event-row"]', { hasText: 'event-001' })).toBeVisible();
  555 | 
  556 |   await page.locator('button:has-text("Emit burst")').click();
  557 |   await expect(page.locator('[data-testid="realtime-lab-event-row"]')).toHaveCount(5);
  558 |   await expect(page.locator('.realtime-lab__chart', { hasText: 'Clear To Close' })).toBeVisible();
  559 | });
  560 | 
  561 | test('Viewer persona is redirected from Realtime Lab without realtime:view permission', async ({ page }) => {
  562 |   await mockApiForPersona(page, 'alice-viewer');
  563 | 
  564 |   await page.goto('/lab/realtime');
  565 | 
  566 |   await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  567 |   await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
  568 | });
  569 | 
```