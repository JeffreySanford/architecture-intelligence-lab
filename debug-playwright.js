const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const personas = [
    { id: 'adhan-designer', name: 'Adhan Designer', role: 'Designer', description: 'Frontend design-system lab.', permissions: ['design:view'] },
    { id: 'alice-viewer', name: 'Alice Viewer', role: 'Viewer', description: 'Viewer persona', permissions: ['dashboard:view', 'loans:view'] },
  ];

  let currentUser = { persona: personas[0], roles: [personas[0].role], permissions: personas[0].permissions };

  await page.route('**/api/personas', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(personas) }),
  );

  await page.route('**/api/dev-auth/personas/**/select', async route => {
    const url = route.request().url();
    const match = url.match(/\/api\/dev-auth\/personas\/([^/]+)\/select$/);
    const selected = personas.find((p) => p.id === match?.[1]) ?? personas[0];
    currentUser = { persona: selected, roles: [selected.role], permissions: selected.permissions };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'set-cookie': 'access_token=' + selected.id + '; Path=/; HttpOnly; SameSite=Lax',
      },
      body: JSON.stringify(currentUser),
    });
  });

  await page.route('**/api/me', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(currentUser) }),
  );

  page.on('console', message => console.log('PAGE-CONSOLE', message.type(), message.text()));
  page.on('pageerror', exception => console.log('PAGE-ERROR', exception.message));
  page.on('request', request => { if (request.url().includes('/api/')) console.log('REQ', request.method(), request.url()); });
  page.on('response', async response => { if (response.url().includes('/api/')) { const text = await response.text().catch(() => '<no body>'); console.log('RESP', response.status(), response.url(), text.slice(0, 200)); }});

  await page.goto('http://127.0.0.1:4200/');
  await page.waitForTimeout(2000);
  console.log('status after load:', await page.locator('p.landing__status').innerText().catch(() => '<no status>'));
  console.log('card count:', await page.locator('.landing__persona').count());
  console.log('button text:', await page.locator('button:has-text("Enter As")').innerText().catch(() => '<no button>'));
  console.log('click selectors count button:', await page.locator('button:has-text("Adhan Designer")').count());
  console.log('click selectors count card:', await page.locator('.landing__persona:has-text("Adhan Designer")').count());
  await page.click('.landing__persona:has-text("Adhan Designer")');
  await page.waitForTimeout(2000);
  console.log('status after click:', await page.locator('p.landing__status').innerText().catch(() => '<no status>'));
  console.log('selected persona button patch:', await page.locator('button:has-text("Enter As")').innerText().catch(() => '<no button>'));
  await page.click('button:has-text("Enter As")');
  await page.waitForTimeout(3000);
  console.log('final url:', page.url());
  await browser.close();
})();
