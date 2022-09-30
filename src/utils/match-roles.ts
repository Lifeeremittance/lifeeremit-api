import { ROLE } from '../const';

export const matchRoles = (roles: ROLE[], userRoles: string[]) => {
  if (!roles || !userRoles) return false;
  return roles.some((role) => userRoles.includes(role));
};
