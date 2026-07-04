const fs = require('node:fs');
const path = require('node:path');

require('reflect-metadata');
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
    target: 'es2021',
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    ignoreDeprecations: '6.0',
  },
});

const { NestFactory } = require('@nestjs/core');
const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
const { AppModule } = require('../apps/nest-api/src/app/app.module');

async function main() {
  const outputPath = path.resolve(
    process.argv[2] ?? 'libs/generated/nest-api-client/openapi.json',
  );

  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Architecture Intelligence Nest Gateway')
    .setDescription('Comparison, proxy, and realtime API for the training lab.')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);

  await app.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
