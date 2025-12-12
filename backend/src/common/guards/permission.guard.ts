import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUser } from '../../modules/auth/models/jwt-user.model';
import { USER_ROLES } from '../factories/enum-values';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    if (!user) throw new ForbiddenException('No user found');

    const action = this.reflector.get<string>('permission_action', context.getHandler());

    if (!action) {
      throw new ForbiddenException(`No permission action defined for handler`);
    }

    if (user.role === USER_ROLES.ADMIN) return true;

    const controllerClass = context.getClass() as any;
    const permissions = controllerClass.permissions as
      | Record<string, (user: JwtUser, request?: any) => boolean>
      | undefined;

    if (!permissions) throw new ForbiddenException(`No permissions defined for controller`);

    const permissionFn = permissions[action];
    if (!permissionFn) throw new ForbiddenException(`No permission defined for action "${action}"`);

    return permissionFn(user, request);
  }
}
