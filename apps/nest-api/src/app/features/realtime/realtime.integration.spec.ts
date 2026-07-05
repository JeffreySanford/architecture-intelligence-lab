import axios from 'axios';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeModule } from './realtime.module';

describe('Realtime API integration', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RealtimeModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address() as { port: number };
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns realtime event history from the Nest realtime endpoint', async () => {
    const response = await axios.get(`${baseUrl}/gateway/realtime/events`, {
      validateStatus: () => true,
      headers: { Cookie: 'access_token=alice-viewer' },
    });

    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      mode: 'mock',
      namespace: '/gateway/realtime',
      eventName: 'loan.status.updated',
    });
    expect(Array.isArray(response.data.events)).toBe(true);
  });

  it('rejects realtime endpoint requests without an access_token cookie', async () => {
    const response = await axios.get(`${baseUrl}/gateway/realtime/events`, {
      validateStatus: () => true,
    });

    expect(response.status).toBe(401);
  });

  it('returns Redis adapter status from the realtime status endpoint', async () => {
    const response = await axios.get(`${baseUrl}/gateway/realtime/redis-status`, {
      validateStatus: () => true,
      headers: { Cookie: 'access_token=alice-viewer' },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('mode');
    expect(response.data).toHaveProperty('connected');
    expect(response.data).toHaveProperty('message');
    expect(['redis', 'in-process', 'unknown']).toContain(response.data.mode);
  });

  it('emits a loan status event through the realtime endpoint', async () => {
    const response = await axios.post(
      `${baseUrl}/gateway/realtime/loan-status`,
      {
        loanId: 'loan-002',
        loanNumber: 'TL-1002',
        previousStatus: 'In Review',
        nextStatus: 'Approved',
      },
      {
        validateStatus: () => true,
        headers: { Cookie: 'access_token=alice-viewer' },
      },
    );

    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      loanId: 'loan-002',
      loanNumber: 'TL-1002',
      previousStatus: 'In Review',
      nextStatus: 'Approved',
      type: 'loan.status.updated',
    });
  });
});
