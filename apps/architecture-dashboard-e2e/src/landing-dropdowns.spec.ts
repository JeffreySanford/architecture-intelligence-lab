import { test, expect, type Page } from '@playwright/test';

type TestPersona = {
  id: string;
  name: string;
  role: string;
  permissions: string[];
};

const personas: TestPersona[] = [
  { id: 'alice-viewer', name: 'Alice Viewer', role: 'Viewer', permissions: ['dashboard:view', 'loans:view'] },
  { id: 'ethan-diagnostics-admin', name: 'Ethan Diagnostics Admin', role: 'Diagnostics Admin', permissions: ['backend-comparison:view', 'dashboard:view', 'diagnostics:view'] },
  { id: 'grace-realtime-operator', name: 'Grace Realtime Operator', role: 'Realtime Operator', permissions: ['dashboard:view', 'realtime:view', 'realtime:emit'] },
  { id: 'grace-admin', name: 'Grace Admin', role: 'Admin', permissions: ['admin:view', 'dashboard:view', 'contracts:view'] },
];

async function mockLandingApi(page: Page) {
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

  await page.route('**/api/dev-auth/personas/*/select', async (route) => {
    const requestUrl = route.request().url();
    const idMatch = requestUrl.match(/\/api\/dev-auth\/personas\/([^/]+)\/select$/);
    const personaId = idMatch?.[1];
    const selected = personas.find((item) => item.id === personaId);

    if (selected) {
      currentUser = {
        persona: selected,
        roles: [selected.role],
        permissions: selected.permissions,
      };
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'set-cookie': `access_token=${personaId}; Path=/; HttpOnly; SameSite=Lax` },
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
    const url = new URL(route.request().url());
    const dataset = url.searchParams.get('dataset') || 'small';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        dataset,
        borrowers: [
          { id: 'borrower-001', name: 'Maya Chen', creditScore: 742, riskBand: 'Low' },
        ],
        loans: [
          { id: 'loan-001', borrowerId: 'borrower-001', loanNumber: 'TL-1001', amount: 325000, statusCode: 'submitted' },
        ],
        documents: [
          { id: 'doc-001', loanId: 'loan-001', type: 'Income Verification', status: 'received' },
        ],
        statusCodes: [{ code: 'submitted', label: 'Submitted', sortOrder: 1 }],
      }),
    });
  });
}

test('landing page dropdowns show items and persist selections through dashboard state', async ({ page }) => {
  await mockLandingApi(page);

  await page.goto('/');
  await expect(page.locator('text=Loaded')).toContainText('Loaded');

  // Verify persona list is available in the dropdown options.
  await page.locator('p-select[inputid="persona-select"]').click();
  const personaOption = page.locator('.p-select-option', { hasText: 'Grace Realtime Operator' });
  await expect(personaOption).toBeVisible();
  await personaOption.click();

  // Verify dataset size selection and backend mode selection.
  await page.locator('p-select[inputid="dataset-select"]').click();
  await expect(page.locator('.p-select-option', { hasText: 'Small' })).toBeVisible();
  await expect(page.locator('.p-select-option', { hasText: 'Medium' })).toBeVisible();
  await expect(page.locator('.p-select-option', { hasText: 'Stress' })).toBeVisible();
  const largeOption = page.locator('.p-select-option', { hasText: 'Large' });
  await expect(largeOption).toBeVisible();
  await largeOption.click();

  await page.locator('p-select[inputid="backend-select"]').click();
  await expect(page.locator('.p-select-option', { hasText: 'Spring direct' })).toBeVisible();
  await expect(page.locator('.p-select-option', { hasText: 'Nest direct' })).toBeVisible();
  await expect(page.locator('.p-select-option', { hasText: 'Compare all' })).toBeVisible();
  const backendOption = page.locator('.p-select-option', { hasText: 'Nest proxy' });
  await expect(backendOption).toBeVisible();
  await backendOption.click();

  await page.click('button:has-text("Enter As")');

  await expect(page).toHaveURL(/.*\/lab\/dashboard\?dataset=large&backend=nest-proxy(&|$)/, { timeout: 30000 });
  await expect(page.locator('text=Spring snapshot · large · nest-proxy')).toBeVisible();
});
