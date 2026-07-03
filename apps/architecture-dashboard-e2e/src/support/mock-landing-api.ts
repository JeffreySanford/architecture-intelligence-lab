import type { Page } from '@playwright/test';

type TestPersona = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

const personas: TestPersona[] = [
  { id: 'alice-viewer', name: 'Alice Viewer', role: 'Viewer', permissions: ['dashboard:view', 'loans:view'] },
  {
    id: 'ethan-diagnostics-admin',
    name: 'Ethan Diagnostics Admin',
    role: 'Diagnostics Admin',
    permissions: ['backend-comparison:view', 'dashboard:view', 'diagnostics:view'],
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
}
