import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUser } from '../../modules/auth/models/jwt-user.model';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const action = this.reflector.get<string>('permission_action', context.getHandler());
    const request = context.switchToHttp().getRequest();

    const controllerClass = context.getClass() as any;
    const permissions = controllerClass.permissions as Record<string, Function> | undefined;

    if (!permissions) throw new ForbiddenException(`No permissions defined for controller`);

    const permissionFn = permissions[action];
    if (!permissionFn) throw new ForbiddenException(`No permission defined for action "${action}"`);

    const user = request.user as JwtUser;
    return permissionFn(user, request);
  }
}
