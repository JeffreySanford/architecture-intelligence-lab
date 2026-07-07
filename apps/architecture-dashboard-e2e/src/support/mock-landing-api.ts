import type { Page } from '@playwright/test';

type TestPersona = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

const personas: TestPersona[] = [
  {
    id: 'adhan-designer',
    name: 'Adhan Designer',
    role: 'Designer',
    permissions: ['design:view', 'dashboard:view'],
  },
  { id: 'alice-viewer', name: 'Alice Viewer', role: 'Viewer', permissions: ['dashboard:view', 'loans:view'] },
  {
    id: 'ethan-diagnostics-admin',
    name: 'Ethan Diagnostics Admin',
    role: 'Diagnostics Admin',
    permissions: ['backend-comparison:view', 'dashboard:view', 'diagnostics:view'],
  },
  {
    id: 'grace-admin',
    name: 'Grace Admin',
    role: 'Admin',
    permissions: [
      'admin:view',
      'contracts:view',
      'dashboard:view',
      'diagnostics:view',
      'loans:view',
      'backend-comparison:view',
      'developer:view',
      'mcp:view',
    ],
  },
  {
    id: 'henry-mcp-explorer',
    name: 'Henry MCP Explorer',
    role: 'MCP Explorer',
    permissions: ['dashboard:view', 'developer:view', 'mcp:view'],
  },
];

export async function mockLandingApi(page: Page): Promise<void> {
  let currentUser = {
    persona: personas[0],
    roles: [personas[0].role],
    permissions: personas[0].permissions,
  };

  await page.route('**/api/personas', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(personas),
    });
  });

  await page.route('**/api/dev-auth/personas/**/select', async (route) => {
    const requestUrl = route.request().url();
    const match = requestUrl.match(/\/api\/dev-auth\/personas\/([^/]+)\/select$/);
    const selected = personas.find((item) => item.id === match?.[1]) ?? personas[0];

    currentUser = {
      persona: selected,
      roles: [selected.role],
      permissions: selected.permissions,
    };

    await page.context().addCookies([
      {
        name: 'access_token',
        value: selected.id,
        domain: 'localhost',
        path: '/',
        sameSite: 'Lax',
        httpOnly: true,
      },
    ]);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'set-cookie': `access_token=${selected.id}; Path=/; HttpOnly; SameSite=Lax`,
      },
      body: JSON.stringify(currentUser),
    });
  });

  await page.route('**/api/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(currentUser),
    });
  });

  await page.route('**/api/dashboard/snapshot**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        dataset: 'small',
        borrowers: [{ id: 'borrower-001', name: 'Maya Chen', creditScore: 742, riskBand: 'Low' }],
        loans: [
          {
            id: 'loan-001',
            borrowerId: 'borrower-001',
            loanNumber: 'TL-1001',
            amount: 325000,
            statusCode: 'submitted',
          },
        ],
        documents: [{ id: 'doc-001', loanId: 'loan-001', type: 'Income Verification', status: 'received' }],
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

  await page.route('**/gateway/loans/direct', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mode: 'live',
        pathId: 'nest-direct',
        recordCount: 1,
        records: [
          {
            id: 'loan-001',
            loanNumber: 'TL-1001',
            borrowerName: 'Maya Chen',
            amount: 325000,
            status: 'Submitted',
          },
        ],
        observedAt: '2026-07-03T00:00:00.000Z',
      }),
    });
  });

  await page.route('**/gateway/loans/proxy', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mode: 'live',
        pathId: 'nest-proxy',
        recordCount: 1,
        records: [
          {
            id: 'loan-001',
            loanNumber: 'TL-1001',
            borrowerName: 'Maya Chen',
            amount: 325000,
            status: 'Submitted',
          },
        ],
        observedAt: '2026-07-03T00:00:00.000Z',
      }),
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
}
