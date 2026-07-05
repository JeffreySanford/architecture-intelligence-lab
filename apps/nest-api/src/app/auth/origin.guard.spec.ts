import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OriginGuard } from './origin.guard';

function createRequest(origin?: string) {
  return {
    headers: {
      origin,
    },
  } as const;
}

function createContext(request: ReturnType<typeof createRequest>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('OriginGuard', () => {
  let guard: OriginGuard;

  beforeEach(() => {
    guard = new OriginGuard();
  });

  it('allows requests without an Origin header', () => {
    expect(() => guard.canActivate(createContext(createRequest()))).not.toThrow();
  });

  it('allows requests from a known local dev origin', () => {
    expect(() => guard.canActivate(createContext(createRequest('http://localhost:4200')))).not.toThrow();
  });

  it('rejects requests from an unknown origin', () => {
    expect(() => guard.canActivate(createContext(createRequest('https://example.com')))).toThrow(
      ForbiddenException,
    );
  });
});
