import { INestApplication } from '@nestjs/common';
import axios from 'axios';
import { createNestSwaggerApp } from '../main';

describe('Nest Swagger docs security', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    app = await createNestSwaggerApp();
    await app.listen(0);

    const address = app.getHttpServer().address() as { port: number };
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await app.close();
  });

  const fetchSwagger = async (path: string, cookie?: string) => {
    return axios.get(`${baseUrl}${path}`, {
      validateStatus: () => true,
      headers: cookie ? { Cookie: cookie } : undefined,
    });
  };

  it('denies Swagger UI access without an access_token cookie', async () => {
    const response = await fetchSwagger('/swagger');
    expect(response.status).toBe(403);
    expect(response.data).toEqual({ error: 'forbidden' });
  });

  it('denies raw Swagger JSON access without an access_token cookie', async () => {
    const response = await fetchSwagger('/swagger-json');
    expect(response.status).toBe(403);
    expect(response.data).toEqual({ error: 'forbidden' });
  });

  it('allows Swagger UI access for contract admin persona', async () => {
    const response = await fetchSwagger('/swagger', 'access_token=fiona-contract-admin');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(typeof response.data).toBe('string');
  });

  it('allows raw Swagger JSON access for admin persona', async () => {
    const response = await fetchSwagger('/swagger-json', 'access_token=grace-admin');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('openapi', '3.0.0');
  });
});
