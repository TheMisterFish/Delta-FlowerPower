import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../interfaces/roles.interface'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {    
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);

    if (!Roles[roles[0]]) {
      return true;
    }
    // We only use one role per time.
    const role = Roles[roles[0]];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    function hasRole() {
      if (user.role === Roles.admin) {
        return true;
      } else if (user.role == Roles.researcher && role !== Roles.admin) {
          return true;
      } else if (user.role === Roles.guest && role === Roles.guest) {
          return true;
      }
      return false;
    }

    return user && user.role && hasRole();
  }
}