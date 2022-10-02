import { ROLE } from '../const';

type WhoAmI = {
  isUser: boolean;
  isAdmin: boolean;
  isFieldOfficer: boolean;
  isDiagnosticCenter: boolean;
};

export const whoAmI = (roles: ROLE[]): WhoAmI => {
  if (!roles?.length) {
    return {
      isUser: false,
      isAdmin: false,
      isFieldOfficer: false,
      isDiagnosticCenter: false,
    };
  }

  return {
    isUser: roles.includes(ROLE.USER) && roles.length === 1,
    isAdmin: roles.includes(ROLE.ADMIN),
    isFieldOfficer: roles.includes(ROLE.FIELD_OFFICER),
    isDiagnosticCenter: roles.includes(ROLE.DIAGNOSTIC_CENTER),
  };
};
