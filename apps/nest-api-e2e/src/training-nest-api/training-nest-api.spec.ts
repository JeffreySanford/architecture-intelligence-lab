import { createHmac } from 'node:crypto';

type GatewayHealthResponse = {
  status: string;
  service: string;
  mode: string;
};

type ComparisonResponse = {
  subject: string;
  paths: Array<{ pathId: string }>;
};

type ComparisonHistoryResponse = {
  subject: string;
  sampleCount: number;
  summary: Array<{ pathId: string; samples: number }>;
};

type RealtimeEventResponse = {
  type: string;
  loanNumber: string;
  nextStatus: string;
};

function createDevAccessToken(personaId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const encodedPersona = Buffer.from(personaId).toString('base64url');
  const unsignedToken = `v1.${encodedPersona}.${expiresAt}`;
  const signature = createHmac('sha256', process.env['DEV_AUTH_SECRET'] || 'local-training-lab-dev-secret')
    .update(unsignedToken)
    .digest('base64url');
  return `${unsignedToken}.${signature}`;
}

const viewerCookie = `access_token=${createDevAccessToken('alice-viewer')}`;

function apiUrl(path: string): string {
  const baseUrl =
    (globalThis as typeof globalThis & { __API_BASE_URL__?: string }).__API_BASE_URL__ ??
    'http://localhost:3000';

  return new URL(path, baseUrl).toString();
}

async function getJson<T>(path: string, cookie?: string): Promise<{ status: number; data: T }> {
  const response = await fetch(apiUrl(path), {
    headers: cookie
      ? {
          Cookie: cookie,
        }
      : undefined,
  });
  return {
    status: response.status,
    data: (await response.json()) as T,
  };
}

async function postJson<T>(
  path: string,
  body: Record<string, string>,
  cookie?: string,
): Promise<{ status: number; data: T }> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    data: (await response.json()) as T,
  };
}

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await getJson<{ message: string }>('/api');

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('Phase 5 Nest gateway', () => {
  it('should reject gateway health without an access_token cookie', async () => {
    const res = await getJson<GatewayHealthResponse>('/gateway/health');

    expect(res.status).toBe(401);
  });

  it('should allow gateway health with a valid persona cookie', async () => {
    const res = await getJson<GatewayHealthResponse>('/gateway/health', viewerCookie);

    expect(res.status).toBe(200);
    expect(res.data).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'nest-api',
        mode: 'live',
      }),
    );
  });

  it('should reject gateway comparison without a persona cookie', async () => {
    const res = await getJson<ComparisonResponse>('/gateway/comparison/loans');

    expect(res.status).toBe(401);
  });

  it('should compare Spring direct, Nest direct, and Nest proxy paths with a persona cookie', async () => {
    const res = await getJson<ComparisonResponse>('/gateway/comparison/loans', viewerCookie);

    expect(res.status).toBe(200);
    expect(res.data.subject).toBe('loans');
    expect(res.data.paths.map((path: { pathId: string }) => path.pathId)).toEqual([
      'spring-direct',
      'nest-direct',
      'nest-proxy',
    ]);
  });

  it('should expose historical comparison metrics after a comparison run', async () => {
    await getJson<ComparisonResponse>('/gateway/comparison/loans', viewerCookie);
    const res = await getJson<ComparisonHistoryResponse>('/gateway/comparison/loans/history', viewerCookie);

    expect(res.status).toBe(200);
    expect(res.data.subject).toBe('loans');
    expect(res.data.sampleCount).toBeGreaterThan(0);
    expect(res.data.summary.map((path) => path.pathId)).toEqual([
      'spring-direct',
      'nest-direct',
      'nest-proxy',
    ]);
  });

  it('should reject realtime loan status events without a persona cookie', async () => {
    const res = await postJson<RealtimeEventResponse>('/gateway/realtime/loan-status', {
      loanId: 'loan-200',
      loanNumber: 'TL-1200',
      previousStatus: 'Submitted',
      nextStatus: 'Approved',
    });

    expect(res.status).toBe(401);
  });

  it('should create realtime loan status events with a persona cookie', async () => {
    const res = await postJson<RealtimeEventResponse>(
      '/gateway/realtime/loan-status',
      {
        loanId: 'loan-200',
        loanNumber: 'TL-1200',
        previousStatus: 'Submitted',
        nextStatus: 'Approved',
      },
      viewerCookie,
    );

    expect(res.status).toBe(201);
    expect(res.data).toEqual(
      expect.objectContaining({
        type: 'loan.status.updated',
        loanNumber: 'TL-1200',
        nextStatus: 'Approved',
      }),
    );
  });
});
