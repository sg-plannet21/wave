import storage from 'lib/client/storage';
import { useSession } from 'next-auth/react';
import { EntityRoles } from 'state/auth/types';

type UseIsAuthorisedReturn = {
  isSuperUser: boolean;
  hasWriteAccess: boolean;
};

export const useIsAuthorised = (
  allowedRoles?: EntityRoles[]
): UseIsAuthorisedReturn => {
  const { data } = useSession();

  if (!data?.user) throw new Error('User does not exist!');

  // Super User
  if (data.user.is_wave_superuser)
    return { isSuperUser: true, hasWriteAccess: true };

  const currentBusinessUnitRoles = data.user.business_unit_roles.find(
    (bu) => bu.business_unit === storage.getBusinessUnit()
  );
  if (!currentBusinessUnitRoles) {
    return { isSuperUser: false, hasWriteAccess: false };
  }

  // Admin Role for current Business Unit
  if (currentBusinessUnitRoles.roles.includes(EntityRoles.Administrator)) {
    return { isSuperUser: false, hasWriteAccess: true };
  }

  // Individual Role for current Business Unit
  if (
    allowedRoles?.length &&
    currentBusinessUnitRoles.roles.some((userRole) =>
      allowedRoles.includes(userRole)
    )
  ) {
    return { isSuperUser: false, hasWriteAccess: true };
  }

  return { isSuperUser: false, hasWriteAccess: false };
};
