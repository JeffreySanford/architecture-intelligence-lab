import type { Page } from '@playwright/test';

export type TestPersona = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

export const personas: Record<string, TestPersona> = {
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

export async function mockPhaseFiveApi(page: Page, personaId: keyof typeof personas) {
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

  await page.route('**/gateway/realtime/redis-status', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mode: 'in-process',
        connected: false,
        redisUrl: 'redis://localhost:6379',
        message: 'Socket.IO Redis adapter unavailable; using in-process gateway.',
      }),
    });
  });
}
