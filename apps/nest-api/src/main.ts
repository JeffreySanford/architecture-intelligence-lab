/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { configureRedisIoAdapter } from './app/features/realtime/redis-io.adapter';

type SwaggerRequest = {
  headers?: {
    cookie?: string;
  };
};

type SwaggerResponse = {
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

type SwaggerNext = () => void;

export async function createNestSwaggerApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);
  await configureRedisIoAdapter(app, new Logger('NestBootstrap'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Architecture Intelligence Nest Gateway')
    .setDescription('Comparison, proxy, and realtime API for the training lab.')
    .setVersion('0.1.0')
    .build();

  app.use(['/swagger', '/swagger-json'], (req: SwaggerRequest, res: SwaggerResponse, next: SwaggerNext) => {
    const accessToken = extractAccessToken(req);
    const allowedPersonas = new Set(['fiona-contract-admin', 'grace-admin']);
    if (!accessToken || !allowedPersonas.has(accessToken)) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }
    next();
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  return app;
}

async function bootstrap() {
  const app = await createNestSwaggerApp();
  const logger = new Logger('NestBootstrap');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Nest gateway is running on: http://localhost:${port}/gateway`);
  logger.log(`Nest Swagger UI is running on: http://localhost:${port}/swagger`);
}

export function extractAccessToken(req: { headers?: { cookie?: string } }): string | undefined {
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('access_token='))
    ?.split('=')[1];
}

if (require.main === module) {
  bootstrap();
}
