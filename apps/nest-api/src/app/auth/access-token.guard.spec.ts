import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';

function createRequest(cookie?: string) {
  return {
    headers: {
      cookie,
    },
  } as const;
}

function createContext(request: ReturnType<typeof createRequest>): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => () => undefined,
  } as unknown as ExecutionContext;
}

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new AccessTokenGuard(reflector);
  });

  it('throws UnauthorizedException when access_token cookie is missing', () => {
    expect(() => guard.canActivate(createContext(createRequest()))).toThrow(UnauthorizedException);
  });

  it('throws ForbiddenException for unknown persona values', () => {
    expect(() => guard.canActivate(createContext(createRequest('access_token=unknown-user')))).toThrow(
      ForbiddenException,
    );
  });

  it('allows requests with a known persona cookie', () => {
    expect(() => guard.canActivate(createContext(createRequest('access_token=alice-viewer')))).not.toThrow();
  });

  it('denies access when a handler requires a different allowed persona', () => {
    const request = createRequest('access_token=alice-viewer');
    const context = createContext(request);
    jest.spyOn(reflector, 'get').mockReturnValue(['grace-realtime-operator']);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
