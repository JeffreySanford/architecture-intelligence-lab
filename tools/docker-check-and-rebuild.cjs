const { execSync } = require('node:child_process');
const { request } = require('node:http');

const services = [
  'spring-api',
  'nest-api',
  'postgres',
  'redis',
];

const springPort = process.env.SPRING_API_PORT || '18080';
const nestPort = process.env.NEST_API_PORT || '13000';
const waitTimeoutMs = 120000;
const healthIntervalMs = 2000;

function exec(command) {
  return execSync(command, { stdio: ['pipe', 'pipe', 'inherit'], encoding: 'utf8' }).trim();
}

function getRunningServices() {
  try {
    const output = exec('docker compose ps --services --filter "status=running"');
    return output ? output.split(/\r?\n/).filter(Boolean) : [];
  } catch (error) {
    console.error('Unable to query running Docker Compose services.');
    process.exit(1);
  }
}

function rebuildService(service) {
  console.log(`Rebuilding and starting service: ${service}`);
  try {
    exec(`docker compose up --build -d ${service}`);
    console.log(`Service ${service} is now running.`);
  } catch (error) {
    console.error(`Failed to rebuild service ${service}.`);
    process.exit(1);
  }
}

function startService(service) {
  console.log(`Starting service: ${service}`);
  try {
    exec(`docker compose up -d ${service}`);
    console.log(`Service ${service} is now running.`);
  } catch (error) {
    console.error(`Failed to start service ${service}.`);
    process.exit(1);
  }
}

function restartService(service) {
  console.log(`Restarting service: ${service}`);
  try {
    exec(`docker compose up -d ${service}`);
    console.log(`Service ${service} restart triggered.`);
  } catch (error) {
    console.error(`Failed to restart service ${service}.`);
    process.exit(1);
  }
}

function waitForHttp(url, timeoutMs, serviceName) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    let attempt = 1;

    const check = () => {
      const req = request(url, { method: 'GET' }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          res.resume();
          resolve(true);
        } else if (Date.now() >= deadline) {
          reject(new Error(`Timeout waiting for ${serviceName} at ${url} after ${attempt} attempts`));
        } else {
          attempt += 1;
          setTimeout(check, healthIntervalMs);
        }
      });

      req.on('error', (err) => {
        if (Date.now() >= deadline) {
          reject(new Error(`Timeout waiting for ${serviceName} at ${url}: ${err.message}`));
        } else {
          attempt += 1;
          setTimeout(check, healthIntervalMs);
        }
      });

      req.setTimeout(5000, () => {
        req.destroy();
      });
      req.end();
    };

    check();
  });
}

function dumpServiceDiagnostics(service) {
  console.error(`\n=== Diagnostics for ${service} ===`);
  try {
    console.error(exec(`docker compose ps ${service}`));
  } catch (error) {
    console.error(`Unable to get container status for ${service}: ${error.message}`);
  }

  try {
    console.error(exec(`docker compose logs --no-color --tail=50 ${service}`));
  } catch (error) {
    console.error(`Unable to get logs for ${service}: ${error.message}`);
  }
}

async function waitForServices() {
  console.log(`Waiting for spring-api on http://localhost:${springPort}/api/health`);
  await waitForHttp(`http://localhost:${springPort}/api/health`, waitTimeoutMs, 'spring-api');
  console.log('spring-api is healthy.');

  console.log(`Waiting for nest-api on http://localhost:${nestPort}/gateway/health`);
  await waitForHttp(`http://localhost:${nestPort}/gateway/health`, waitTimeoutMs, 'nest-api');
  console.log('nest-api is healthy.');
}

async function retryHealthcheck(service, url, serviceName) {
  try {
    await waitForHttp(url, waitTimeoutMs, serviceName);
    console.log(`${serviceName} is healthy.`);
    return;
  } catch (firstError) {
    console.warn(`${serviceName} healthcheck failed once, retrying after restart: ${firstError.message}`);
    restartService(service);
    await new Promise((resolve) => setTimeout(resolve, 5000));

    try {
      await waitForHttp(url, waitTimeoutMs, serviceName);
      console.log(`${serviceName} is healthy after restart.`);
      return;
    } catch (secondError) {
      throw new Error(`${serviceName} failed healthcheck after restart: ${secondError.message}`);
    }
  }
}

async function main() {
  console.log('Checking Docker Compose services...');
  const runningServices = new Set(getRunningServices());

  for (const service of services) {
    if (runningServices.has(service)) {
      console.log(`✔ ${service} is running`);
      continue;
    }

    console.log(`✖ ${service} is not running or is dirty`);
    startService(service);
  }

  console.log('Docker Compose service check complete.');

  try {
    console.log(`Waiting for spring-api on http://localhost:${springPort}/api/health`);
    await retryHealthcheck('spring-api', `http://localhost:${springPort}/api/health`, 'spring-api');

    console.log(`Waiting for nest-api on http://localhost:${nestPort}/gateway/health`);
    await retryHealthcheck('nest-api', `http://localhost:${nestPort}/gateway/health`, 'nest-api');
  } catch (error) {
    console.error('Wait for services failed:', error.message || error);
    dumpServiceDiagnostics('spring-api');
    dumpServiceDiagnostics('nest-api');
    process.exit(1);
  }
}

main();
