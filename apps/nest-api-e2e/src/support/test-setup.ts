module.exports = async function () {
  // Configure fetch helpers for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3000';
  (globalThis as typeof globalThis & { __API_BASE_URL__: string }).__API_BASE_URL__ =
    `http://${host}:${port}`;
};
