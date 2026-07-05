import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { extractPersonaId, isKnownPersonaId } from './token.utils';

export const ALLOWED_PERSONAS_KEY = 'allowed_personas';

export const AllowedPersonas = (...personas: string[]) =>
  Reflect.metadata(ALLOWED_PERSONAS_KEY, personas);

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as {
      headers?: { cookie?: string };
    };
    const personaId = extractPersonaId(request);

    if (!personaId) {
      throw new UnauthorizedException('access_token cookie is required');
    }

    if (!isKnownPersonaId(personaId)) {
      throw new ForbiddenException('unknown persona token');
    }

    const allowedPersonas = this.reflector.get<string[]>(
      ALLOWED_PERSONAS_KEY,
      context.getHandler(),
    );

    if (allowedPersonas && allowedPersonas.length > 0 && !allowedPersonas.includes(personaId)) {
      throw new ForbiddenException('persona does not have access to this route');
    }

    return true;
  }
}
