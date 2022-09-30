import { SetMetadata } from '@nestjs/common';
import { DECORATOR_KEYS, ROLE } from '../const';

export const Roles = (...roles: ROLE[]) =>
  SetMetadata(DECORATOR_KEYS.ROLES_KEY, roles);
