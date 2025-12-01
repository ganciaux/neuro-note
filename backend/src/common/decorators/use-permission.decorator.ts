import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission_action';
export const UsePermission = (action: string) => SetMetadata(PERMISSION_KEY, action);
