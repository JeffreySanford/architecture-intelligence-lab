const http = require('node:http');
const crypto = require('node:crypto');

const baseUrl = process.env.ARCHITECTURE_LAB_BASE_URL || 'http://localhost:4200';
const devAuthSecret = process.env.DEV_AUTH_SECRET || 'local-training-lab-dev-secret';

function createDevAccessToken(personaId) {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const encodedPersona = Buffer.from(personaId).toString('base64url');
  const unsignedToken = `v1.${encodedPersona}.${expiresAt}`;
  const signature = crypto.createHmac('sha256', devAuthSecret).update(unsignedToken).digest('base64url');
  return `${unsignedToken}.${signature}`;
}

const contractCookie = `access_token=${createDevAccessToken('fiona-contract-admin')}`;
const diagnosticsCookie = `access_token=${createDevAccessToken('ethan-diagnostics-admin')}`;

function request(path, cookie) {
  const url = new URL(path, baseUrl);

  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: 'GET',
        headers: cookie ? { Cookie: cookie } : undefined,
        timeout: 10000,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            path,
            status: res.statusCode,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      },
    );

    req.on('timeout', () => {
      req.destroy(new Error(`Timed out requesting ${path}`));
    });
    req.on('error', reject);
    req.end();
  });
}

async function expectOk(path, cookie) {
  const response = await request(path, cookie);
  if (response.status !== 200) {
    throw new Error(`${path} returned ${response.status}`);
  }
  console.log(`${path} ${response.status} ${response.body.length}`);
  return response;
}

async function main() {
  await expectOk('/');
  await expectOk('/api/health');
  await expectOk('/api/dashboard/snapshot?dataset=stress');
  await expectOk('/swagger/spring/', contractCookie);
  await expectOk('/swagger/spring-json/', contractCookie);
  await expectOk('/swagger/nest/', contractCookie);
  await expectOk('/swagger/nest-json/', contractCookie);

  const comparison = await expectOk('/gateway/comparison/loans', diagnosticsCookie);
  const payload = JSON.parse(comparison.body);
  const paths = Array.isArray(payload.paths) ? payload.paths : [];
  const allPathsOk = paths.length === 3 && paths.every((path) => path.status === 'ok');

  if (payload.mode !== 'live' || !allPathsOk) {
    throw new Error(`Expected live comparison metrics, got ${comparison.body}`);
  }

  const history = await expectOk('/gateway/comparison/loans/history', diagnosticsCookie);
  const historyPayload = JSON.parse(history.body);
  if (historyPayload.subject !== 'loans' || historyPayload.sampleCount < 1) {
    throw new Error(`Expected historical comparison metrics, got ${history.body}`);
  }

  console.log('Docker smoke passed.');
}

main().catch((error) => {
  console.error(`Docker smoke failed: ${error.message}`);
  process.exit(1);
});
