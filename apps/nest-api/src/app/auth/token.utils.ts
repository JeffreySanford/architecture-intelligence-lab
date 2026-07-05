const DEFAULT_LOCAL_ORIGINS = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:4201',
  'http://127.0.0.1:4201',
  'http://localhost:18080',
  'http://127.0.0.1:18080',
];

const KNOWN_PERSONA_IDS = new Set([
  'alice-viewer',
  'ben-reviewer',
  'cara-approver',
  'diana-admin',
  'ethan-diagnostics-admin',
  'fiona-contract-admin',
  'grace-realtime-operator',
  'henry-mcp-explorer',
  'irene-document-reviewer',
  'jason-auditor',
  'morgan-platform-admin',
  'nora-security-admin',
  'owen-api-admin',
  'grace-admin',
]);

export function extractAccessToken(cookieSource: { headers?: { cookie?: string } } | string | undefined | Record<string, unknown>): string | undefined {
  const cookieHeader =
    typeof cookieSource === 'string'
      ? cookieSource
      : typeof (cookieSource as { headers?: { cookie?: string } }).headers?.cookie === 'string'
      ? (cookieSource as { headers: { cookie: string } }).headers.cookie
      : typeof (cookieSource as Record<string, unknown>).cookie === 'string'
      ? (cookieSource as Record<string, { cookie: string }>).cookie
      : undefined;
  if (!cookieHeader) {
    return undefined;
  }

  return (cookieHeader as string)
    .split(';')
    .map((cookie: string) => cookie.trim())
    .find((cookie: string) => cookie.startsWith('access_token='))
    ?.split('=')[1];
}

export function isKnownPersonaId(personaId?: string): boolean {
  return typeof personaId === 'string' && KNOWN_PERSONA_IDS.has(personaId);
}

export function parseAllowedOrigins(envValue?: string): string[] {
  if (!envValue || !envValue.trim()) {
    return DEFAULT_LOCAL_ORIGINS;
  }

  const origins = envValue
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0 && origin !== '*' && !origin.includes('*'));

  return origins.length > 0 ? origins : DEFAULT_LOCAL_ORIGINS;
}

export function isOriginAllowed(origin: string | undefined, allowedOrigins: string[]): boolean {
  return typeof origin === 'string' && allowedOrigins.includes(origin);
}

export function getDefaultLocalOrigins(): string[] {
  return [...DEFAULT_LOCAL_ORIGINS];
}
