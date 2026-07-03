type GatewayHealthResponse = {
  status: string;
  service: string;
  mode: string;
};

type ComparisonResponse = {
  subject: string;
  paths: Array<{ pathId: string }>;
};

type RealtimeEventResponse = {
  type: string;
  loanNumber: string;
  nextStatus: string;
};

function apiUrl(path: string): string {
  const baseUrl =
    (globalThis as typeof globalThis & { __API_BASE_URL__?: string }).__API_BASE_URL__ ??
    'http://localhost:3000';

  return new URL(path, baseUrl).toString();
}

async function getJson<T>(path: string): Promise<{ status: number; data: T }> {
  const response = await fetch(apiUrl(path));
  return {
    status: response.status,
    data: (await response.json()) as T,
  };
}

async function postJson<T>(
  path: string,
  body: Record<string, string>,
): Promise<{ status: number; data: T }> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
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
  it('should expose gateway health', async () => {
    const res = await getJson<GatewayHealthResponse>('/gateway/health');

    expect(res.status).toBe(200);
    expect(res.data).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'nest-api',
        mode: 'live',
      }),
    );
  });

  it('should compare Spring direct, Nest direct, and Nest proxy paths', async () => {
    const res = await getJson<ComparisonResponse>('/gateway/comparison/loans');

    expect(res.status).toBe(200);
    expect(res.data.subject).toBe('loans');
    expect(res.data.paths.map((path: { pathId: string }) => path.pathId)).toEqual([
      'spring-direct',
      'nest-direct',
      'nest-proxy',
    ]);
  });

  it('should create realtime loan status events', async () => {
    const res = await postJson<RealtimeEventResponse>('/gateway/realtime/loan-status', {
      loanId: 'loan-200',
      loanNumber: 'TL-1200',
      previousStatus: 'Submitted',
      nextStatus: 'Approved',
    });

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
