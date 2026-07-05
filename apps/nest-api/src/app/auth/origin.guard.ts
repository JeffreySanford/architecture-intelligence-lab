import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { isOriginAllowed, parseAllowedOrigins } from './token.utils';

@Injectable()
export class OriginGuard implements CanActivate {
  private readonly allowedOrigins = parseAllowedOrigins(process.env['SOCKET_IO_ORIGINS']);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as {
      headers?: { origin?: string };
    };
    const origin = request.headers?.origin;

    if (!origin) {
      return true;
    }

    if (!isOriginAllowed(origin, this.allowedOrigins)) {
      throw new ForbiddenException('origin not allowed');
    }

    return true;
  }
}
