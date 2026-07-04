const fs = require('node:fs');
const path = require('node:path');

const workspaceRoot = process.cwd();
const requestedClient = process.argv[2] ?? 'all';

const clients = {
  spring: {
    name: 'Spring',
    root: 'libs/generated/spring-api-client/src/generated',
    requiredFiles: [
      'api/api.ts',
      'api/labController.service.ts',
      'models/dashboardSnapshotDto.ts',
      'models/personaDto.ts',
    ],
    generatedServicePattern: /@generated\/spring-api-client/,
    allowedConsumers: [
      'apps/architecture-dashboard/src/app/core/api/lab-api.models.ts',
      'apps/architecture-dashboard/src/app/core/api/spring-api.facade.ts',
      'apps/architecture-dashboard/src/app/core/api/spring-api.facade.spec.ts',
      'apps/architecture-dashboard/src/app/app.config.ts',
    ],
  },
  nest: {
    name: 'Nest',
    root: 'libs/generated/nest-api-client/src/generated',
    requiredFiles: [
      'api/api.ts',
      'api/comparison.service.ts',
      'api/realtime.service.ts',
      'models/backendComparisonMetricDto.ts',
      'models/realtimeEventDto.ts',
    ],
    generatedServicePattern: /@generated\/nest-api-client/,
    allowedConsumers: [
      'apps/architecture-dashboard/src/app/core/api/nest-api.facade.ts',
      'apps/architecture-dashboard/src/app/core/api/nest-api.facade.spec.ts',
      'apps/architecture-dashboard/src/app/app.config.ts',
    ],
  },
};

const selectedClients =
  requestedClient === 'all' ? Object.values(clients) : [clients[requestedClient]];

if (selectedClients.some((client) => !client)) {
  console.error(`Unknown client "${requestedClient}". Use spring, nest, or all.`);
  process.exit(1);
}

const failures = [];

for (const client of selectedClients) {
  for (const file of client.requiredFiles) {
    const fullPath = path.join(workspaceRoot, client.root, file);
    if (!fs.existsSync(fullPath)) {
      failures.push(`${client.name} generated client is missing ${path.join(client.root, file)}`);
    }
  }
}

const sourceFiles = collectFiles(path.join(workspaceRoot, 'apps/architecture-dashboard/src/app'));
for (const client of selectedClients) {
  const allowed = new Set(client.allowedConsumers.map(normalizePath));
  for (const file of sourceFiles) {
    const relativePath = normalizePath(path.relative(workspaceRoot, file));
    if (allowed.has(relativePath)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf8');
    if (client.generatedServicePattern.test(content)) {
      failures.push(
        `${relativePath} imports ${client.name} generated client directly; use a core/api facade instead.`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`OpenAPI client check passed for ${requestedClient}.`);

function collectFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }
    return entry.isFile() && fullPath.endsWith('.ts') ? [fullPath] : [];
  });
}

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}
