import { createHmac, timingSafeEqual } from 'crypto';

const TOKEN_VERSION = 'v1';
const DEFAULT_DEV_AUTH_SECRET = 'local-training-lab-dev-secret';
const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 8;

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

function devAuthSecret(): string {
  const secret = process.env['DEV_AUTH_SECRET'];
  return secret && secret.trim() ? secret : DEFAULT_DEV_AUTH_SECRET;
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

function signature(unsignedToken: string): string {
  return createHmac('sha256', devAuthSecret()).update(unsignedToken).digest('base64url');
}

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

export function createDevAccessToken(personaId: string, expiresAt?: number): string {
  const resolvedExpiresAt = expiresAt ?? Math.floor(Date.now() / 1000) + DEFAULT_TOKEN_TTL_SECONDS;
  const encodedPersona = base64Url(personaId);
  const unsignedToken = `${TOKEN_VERSION}.${encodedPersona}.${resolvedExpiresAt}`;
  return `${unsignedToken}.${signature(unsignedToken)}`;
}

export function resolveAccessTokenPersona(accessToken?: string): string | undefined {
  if (!accessToken) {
    return undefined;
  }

  const parts = accessToken.split('.');
  if (parts.length !== 4 || parts[0] !== TOKEN_VERSION) {
    return undefined;
  }

  const unsignedToken = `${parts[0]}.${parts[1]}.${parts[2]}`;
  const expectedSignature = Buffer.from(signature(unsignedToken));
  const actualSignature = Buffer.from(parts[3]);
  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
    return undefined;
  }

  const expiresAt = Number(parts[2]);
  if (!Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return undefined;
  }

  try {
    return Buffer.from(parts[1], 'base64url').toString('utf8');
  } catch {
    return undefined;
  }
}

export function extractPersonaId(cookieSource: { headers?: { cookie?: string } } | string | undefined | Record<string, unknown>): string | undefined {
  return resolveAccessTokenPersona(extractAccessToken(cookieSource));
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
