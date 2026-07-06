const { execSync } = require('node:child_process');

const env = {
  ...process.env,
  ARCHITECTURE_DASHBOARD_ACCESS_LOG: 'off',
};

function run(command) {
  execSync(command, {
    stdio: 'inherit',
    env,
  });
}

console.warn('WARNING: Starting all services and waiting 10 seconds for backend readiness');

run('docker compose up -d postgres redis pgadmin redis-insight spring-api nest-api');
run('pnpm run docker:check');
run('docker compose up -d architecture-dashboard');
run('pnpm run seed:spring-api');

console.warn('Waiting 10 seconds for dashboard proxy and service DNS to settle...');
execSync('node -e "setTimeout(()=>{}, 10000)"', {
  stdio: 'inherit',
  env,
});

run('docker compose logs --follow');
