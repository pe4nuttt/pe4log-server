import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<(number | string)[]>(
      ROLE_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (!roles.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    console.log('[USER ROLE]', request.user.role);

    return roles.includes(String(request.user.role));
  }
}
