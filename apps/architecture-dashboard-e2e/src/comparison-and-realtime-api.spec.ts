import { test, expect, Page } from '@playwright/test';

type TestPersona = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

const personas: Record<string, TestPersona> = {
  'alice-viewer': {
    id: 'alice-viewer',
    name: 'Alice Viewer',
    role: 'Viewer',
    permissions: ['dashboard:view', 'loans:view'],
  },
  'ethan-diagnostics-admin': {
    id: 'ethan-diagnostics-admin',
    name: 'Ethan Diagnostics Admin',
    role: 'Diagnostics Admin',
    permissions: ['backend-comparison:view', 'dashboard:view', 'diagnostics:view'],
  },
  'fiona-contract-admin': {
    id: 'fiona-contract-admin',
    name: 'Fiona Contract Admin',
    role: 'Contract Admin',
    permissions: ['contracts:view', 'dashboard:view'],
  },
  'grace-realtime-operator': {
    id: 'grace-realtime-operator',
    name: 'Grace Realtime Operator',
    role: 'Realtime Operator',
    permissions: ['dashboard:view', 'realtime:emit', 'realtime:view'],
  },
};

async function mockApiForPersona(page: Page, personaId: keyof typeof personas) {
  const persona = personas[personaId];
  const currentUser = {
    persona,
    roles: [persona.role],
    permissions: persona.permissions,
  };

  await page.route('**/api/personas', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(Object.values(personas)),
    });
  });

  await page.route('**/api/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentUser),
    });
  });

  await page.route('**/api/dev-auth/personas/**/select', async (route) => {
    const requestUrl = route.request().url();
    const match = requestUrl.match(/\/api\/dev-auth\/personas\/([^/]+)\/select$/);
    const selectedPersonaId = match?.[1] as keyof typeof personas | undefined;
    const selectedPersona = selectedPersonaId ? personas[selectedPersonaId] : persona;

    if (selectedPersona) {
      currentUser.persona = selectedPersona;
      currentUser.roles = [selectedPersona.role];
      currentUser.permissions = selectedPersona.permissions;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'set-cookie': `access_token=${selectedPersonaId ?? personaId}; Path=/; HttpOnly; SameSite=Lax`,
      },
      body: JSON.stringify(currentUser),
    });
  });

  await page.route('**/api/dashboard/snapshot**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        dataset: 'small',
        borrowers: [
          { id: 'borrower-001', name: 'Maya Chen', creditScore: 742, riskBand: 'Low' },
        ],
        loans: [
          {
            id: 'loan-001',
            borrowerId: 'borrower-001',
            loanNumber: 'TL-1001',
            amount: 325000,
            statusCode: 'submitted',
          },
        ],
        documents: [
          {
            id: 'doc-001',
            loanId: 'loan-001',
            type: 'Income Verification',
            status: 'received',
          },
        ],
        statusCodes: [{ code: 'submitted', label: 'Submitted', sortOrder: 1 }],
      }),
    });
  });

  await page.route('**/gateway/comparison/loans', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mode: 'mock',
        subject: 'loans',
        observedAt: '2026-07-03T00:00:00.000Z',
        paths: [
          {
            pathId: 'spring-direct',
            label: 'Spring direct',
            latencyMs: 42,
            payloadBytes: 768,
            recordCount: 2,
            status: 'ok',
            observedAt: '2026-07-03T00:00:00.000Z',
          },
          {
            pathId: 'nest-direct',
            label: 'Nest direct',
            latencyMs: 27,
            payloadBytes: 742,
            recordCount: 2,
            status: 'ok',
            observedAt: '2026-07-03T00:00:00.000Z',
          },
          {
            pathId: 'nest-proxy',
            label: 'Nest proxy',
            latencyMs: 58,
            payloadBytes: 790,
            recordCount: 2,
            status: 'ok',
            observedAt: '2026-07-03T00:00:00.000Z',
          },
        ],
      }),
    });
  });

  const loanRead = {
    mode: 'live',
    recordCount: 2,
    records: [
      {
        id: 'loan-001',
        loanNumber: 'TL-1001',
        borrowerName: 'Maya Chen',
        amount: 325000,
        status: 'Submitted',
      },
      {
        id: 'loan-002',
        loanNumber: 'TL-1002',
        borrowerName: 'Noah Patel',
        amount: 418500,
        status: 'In Review',
      },
    ],
    observedAt: '2026-07-03T00:00:00.000Z',
  };

  await page.route('**/gateway/loans/direct', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...loanRead, pathId: 'nest-direct' }),
    });
  });

  await page.route('**/gateway/loans/proxy', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...loanRead, pathId: 'nest-proxy' }),
    });
  });

  await page.route('**/gateway/realtime/events', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mode: 'mock',
        namespace: '/gateway/realtime',
        eventName: 'loan.status.updated',
        observedAt: '2026-07-03T00:00:00.000Z',
        events: [
          {
            eventId: 'event-seed-001',
            type: 'loan.status.updated',
            loanId: 'loan-001',
            loanNumber: 'TL-1001',
            previousStatus: 'Submitted',
            nextStatus: 'In Review',
            source: 'mock-http',
            observedAt: '2026-07-03T00:00:00.000Z',
          },
        ],
      }),
    });
  });

  await page.route('**/gateway/realtime/loan-status**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        eventId: 'event-001',
        type: 'loan.status.updated',
        loanId: 'loan-001',
        loanNumber: 'TL-1001',
        previousStatus: 'In Review',
        nextStatus: 'Approved',
        source: 'mock-http',
        observedAt: '2026-07-03T00:01:00.000Z',
      }),
    });
  });
}

test('Comparison And Realtime API page is accessible for diagnostics persona', async ({ page }) => {
  await mockApiForPersona(page, 'ethan-diagnostics-admin');

  await page.goto('/lab/backend-comparison');

  await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
  await expect(page.locator('app-phase-five-page h1', { hasText: 'NestJS Comparison And Realtime API' })).toBeVisible();
  await expect(page.locator('[data-testid="phase-five-deliverable-row"]')).toHaveCount(3);
  await expect(page.locator('.phase-five__card-title', { hasText: 'Comparison Metrics' })).toBeVisible();
  await expect(page.locator('.phase-five__card-title', { hasText: 'Measured Metrics Visualization' })).toBeVisible();
  await expect(
    page.locator('svg[aria-label*="Grouped bar chart comparing latency, payload bytes, and record count"]'),
  ).toBeVisible();
  await expect(page.locator('[data-testid="comparison-metric-row"]')).toHaveCount(3);
  await expect(page.locator('[data-testid="comparison-metric-row"]', { hasText: 'Spring direct' })).toBeVisible();
  await expect(page.locator('[data-testid="comparison-metric-row"]', { hasText: 'Nest direct' })).toBeVisible();
  await expect(page.locator('[data-testid="comparison-metric-row"]', { hasText: 'Nest proxy' })).toBeVisible();
  await expect(page.locator('.phase-five__card-title', { hasText: 'Realtime Event History' })).toBeVisible();
  await expect(page.locator('[data-testid="realtime-event-row"]', { hasText: 'loan.status.updated' })).toBeVisible();
  await expect(page.locator('[data-testid="realtime-event-row"]', { hasText: 'TL-1001' })).toBeVisible();
  await expect(page.locator('[data-testid="realtime-event-row"]', { hasText: 'In Review' })).toBeVisible();
  await expect(
    page.locator('td', {
      hasText:
        'Spring direct, Nest direct, and Nest proxy can be compared in the same topology view.',
    }),
  ).toBeVisible();
  await expect(page.locator('.phase-five__card-title', { hasText: 'Acceptance Criteria' })).toBeVisible();
  await expect(page.locator('svg[aria-label*="Phase 5 graph"]').first()).toBeVisible();
});

test('Diagnostics Admin sees the Phase 5 live gateway loan reads table and Swagger fallback message', async ({ page }) => {
  await mockApiForPersona(page, 'ethan-diagnostics-admin');

  await page.goto('/lab/backend-comparison');

  await expect(page.locator('.phase-five__card-title', { hasText: 'Live Gateway Loan Reads' })).toBeVisible();
  await expect(page.locator('[data-testid="loan-read-row"]')).toHaveCount(2);
  await expect(page.locator('.phase-five__status-label')).toHaveText(
    'Nest Swagger UI access is restricted for your persona.',
  );
});

test('Landing route shows only public sidebar navigation', async ({ page }) => {
  await mockApiForPersona(page, 'alice-viewer');

  await page.goto('/');

  const sidebar = page.locator('aside[aria-label="Primary navigation"]');
  await expect(sidebar.getByText('Persona Setup')).toBeVisible();
  await expect(sidebar.getByText('Dashboard')).toHaveCount(0);
  await expect(sidebar.getByText('Security Search')).toHaveCount(0);
  await expect(sidebar.getByText('Backend Comparison')).toHaveCount(0);
  await expect(sidebar.getByText('OpenAPI')).toHaveCount(0);
  await expect(sidebar.getByText('Admin')).toHaveCount(0);
});

test('Viewer persona sidebar hides protected links without matching permissions', async ({ page }) => {
  await mockApiForPersona(page, 'alice-viewer');

  await page.goto('/lab/dashboard');

  const sidebar = page.locator('aside[aria-label="Primary navigation"]');
  await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  await expect(sidebar.getByText('Dashboard')).toBeVisible();
  await expect(sidebar.getByText('Security Search')).toBeVisible();
  await expect(sidebar.getByText('Capital Markets')).toBeVisible();
  await expect(sidebar.getByText('Map Inspector')).toBeVisible();
  await expect(sidebar.getByText('Backend Comparison')).toHaveCount(0);
  await expect(sidebar.getByText('Realtime Lab')).toHaveCount(0);
  await expect(sidebar.getByText('OpenAPI')).toHaveCount(0);
  await expect(sidebar.getByText('Admin')).toHaveCount(0);
});

test('Backend comparison page shows Diagnostics Admin identity and runtime summary cards', async ({ page }) => {
  await mockApiForPersona(page, 'ethan-diagnostics-admin');

  await page.goto('/lab/backend-comparison');

  await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
  await expect(page.locator('.phase-five__identity span', { hasText: 'Ethan Diagnostics Admin' })).toBeVisible();
  await expect(page.locator('.phase-five__identity strong', { hasText: 'Diagnostics Admin' })).toBeVisible();
  await expect(page.locator('.phase-five__summary')).toBeVisible();
  await expect(page.locator('.phase-five__summary p-card')).toHaveCount(4);
  await expect(page.locator('.phase-five__summary', { hasText: 'Backend mode' })).toBeVisible();
  await expect(page.locator('svg[aria-label*="Phase 5 graph"]').first()).toBeVisible();
});

test('Backend comparison route redirects Viewer persona to dashboard', async ({ page }) => {
  await mockApiForPersona(page, 'alice-viewer');

  await page.goto('/lab/backend-comparison');

  await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
});

test('Backend comparison route allows Realtime Operator to emit Phase 5 events', async ({ page }) => {
  await mockApiForPersona(page, 'grace-realtime-operator');

  await page.goto('/lab/backend-comparison');

  await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
  await expect(page.locator('app-phase-five-page h1', { hasText: 'NestJS Comparison And Realtime API' })).toBeVisible();
  await expect(page.locator('.phase-five__identity strong', { hasText: 'Realtime Operator' })).toBeVisible();
  await expect(page.locator('.phase-five__header-action', { hasText: 'Emit event' })).toBeVisible();

  const emitResponse = page.waitForResponse((response) =>
    response.url().includes('/gateway/realtime/loan-status') && response.status() === 200,
  );

  await page.locator('.phase-five__header-action', { hasText: 'Emit event' }).click();
  await emitResponse;

  await expect(page.locator('[data-testid="realtime-event-row"]', { hasText: 'Approved' })).toBeVisible();
});

test('Realtime Operator sees the future live Socket.IO event update placeholder', async ({ page }) => {
  await mockApiForPersona(page, 'grace-realtime-operator');

  await page.goto('/lab/backend-comparison');

  await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });
  await expect(page.locator('.phase-five__card-title', { hasText: 'Realtime Event History' })).toBeVisible();
  await expect(page.locator('.phase-five__header-action', { hasText: 'Emit event' })).toBeVisible();
  await expect(page.locator('[data-testid="realtime-event-row"]', { hasText: 'loan.status.updated' })).toBeVisible();

  // Placeholder for future live Socket.IO subscription UI updates.
  // When live socket events are added, this test should assert appended socket event rows appear automatically.
});

test('Backend comparison route redirects Contract Admin persona to dashboard', async ({ page }) => {
  await mockApiForPersona(page, 'fiona-contract-admin');

  await page.goto('/lab/backend-comparison');

  await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
});

test('Contract Admin can open OpenAPI Contract Lab and see placeholder content', async ({ page }) => {
  await mockApiForPersona(page, 'fiona-contract-admin');

  await page.goto('/lab/openapi');

  await expect(page).toHaveURL(/.*\/lab\/openapi$/, { timeout: 15000 });
  await expect(page.locator('app-placeholder-page h1', { hasText: 'OpenAPI Contract Lab' })).toBeVisible();
  await expect(page.locator('.placeholder__card')).toBeVisible();
  await expect(page.locator('p-chip', { hasText: 'Routed' })).toBeVisible();
  await expect(page.locator('p-chip', { hasText: 'Data pending' })).toBeVisible();
});

test('Contract Admin can switch personas and access OpenAPI Contract Lab', async ({ page }) => {
  await mockApiForPersona(page, 'ethan-diagnostics-admin');

  await page.goto('/lab/dashboard');
  await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();

  await page.goto('/api/dev-auth/personas/fiona-contract-admin/select');
  await expect(page.locator('body')).toContainText('Fiona Contract Admin');

  await page.goto('/lab/openapi');
  await expect(page).toHaveURL(/.*\/lab\/openapi$/, { timeout: 15000 });
  await expect(page.locator('app-placeholder-page h1', { hasText: 'OpenAPI Contract Lab' })).toBeVisible();
});

test('Diagnostics persona can select comparison metric rows and highlight the active D3 path', async ({ page }) => {
  await mockApiForPersona(page, 'ethan-diagnostics-admin');

  await page.goto('/lab/backend-comparison');
  await expect(page).toHaveURL(/.*\/lab\/backend-comparison$/, { timeout: 15000 });

  const targetRow = page.locator('[data-testid="comparison-metric-row"]', { hasText: 'Nest proxy' }).first();
  await expect(targetRow).toBeVisible();
  await targetRow.click();

  await expect(targetRow).toHaveClass(/phase-five__active-row/);
  await expect(page.locator('svg[aria-label*="Phase 5 graph"]')).toBeVisible();
});

test('Realtime Operator can open Realtime Lab placeholder content', async ({ page }) => {
  await mockApiForPersona(page, 'grace-realtime-operator');

  await page.goto('/lab/realtime');

  await expect(page).toHaveURL(/.*\/lab\/realtime$/, { timeout: 15000 });
  await expect(page.locator('app-placeholder-page h1', { hasText: 'Realtime Lab' })).toBeVisible();
  await expect(page.locator('.placeholder__card')).toBeVisible();
  await expect(page.locator('p-chip', { hasText: 'Routed' })).toBeVisible();
  await expect(page.locator('p-chip', { hasText: 'Data pending' })).toBeVisible();
});

test('Viewer persona is redirected from Realtime Lab without realtime:view permission', async ({ page }) => {
  await mockApiForPersona(page, 'alice-viewer');

  await page.goto('/lab/realtime');

  await expect(page).toHaveURL(/.*\/lab\/dashboard$/, { timeout: 15000 });
  await expect(page.locator('app-dashboard-page h1', { hasText: 'Dashboard' })).toBeVisible();
});
