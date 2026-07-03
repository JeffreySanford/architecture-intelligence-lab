/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { configureRedisIoAdapter } from './app/features/realtime/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NestBootstrap');
  await configureRedisIoAdapter(app, logger);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Architecture Intelligence Nest Gateway')
    .setDescription('Comparison, proxy, and realtime API for the training lab.')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Nest gateway is running on: http://localhost:${port}/gateway`);
  logger.log(`Nest Swagger UI is running on: http://localhost:${port}/swagger`);
}

bootstrap();
