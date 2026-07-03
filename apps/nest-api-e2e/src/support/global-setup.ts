import { Socket } from 'node:net';

const retryDelayMs = 250;
const timeoutMs = 30_000;

function waitForPortOpen(port: number, host: string): Promise<void> {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = new Socket();

      socket.once('connect', () => {
        socket.destroy();
        resolve();
      });

      socket.once('error', () => {
        socket.destroy();

        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${port}`));
          return;
        }

        setTimeout(tryConnect, retryDelayMs);
      });

      socket.connect(port, host);
    };

    tryConnect();
  });
}

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await waitForPortOpen(port, host);

  // Hint: Use `globalThis` to pass variables to global teardown.
  (globalThis as typeof globalThis & { __TEARDOWN_MESSAGE__: string }).__TEARDOWN_MESSAGE__ =
    '\nTearing down...\n';
};
