import { BusinessUnitRole } from 'features/pages/business-units/types';
import { useMemo } from 'react';
import { EntityRoles } from 'state/auth/types';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { User } from '../types';

export type UserTableRecord = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  currentBuRoles: EntityRoles[];
  businessUnitRoles: number[];
  isSuperUser: boolean;
};

export function useUsersTableData() {
  const { data: users, error: usersError } =
    useCollectionRequest<User>('users');

  const { data: businessUnitRoles, error: businessUnitRolesError } =
    useCollectionRequest<BusinessUnitRole>('businessUnitRoles');

  const roles = useMemo(() => {
    if (!businessUnitRoles) return undefined;

    const promptsRole = Object.values(businessUnitRoles)[0].roles[0];

    /*
    Business Unit Roles use the following structure:
    roles: [BU Role #1] => Prompts Role Id
    roles: [BU Role #2] => Entry Points Role Id
    roles: [BU Role #3] => Menus Role Id
    roles: [BU Role #4] => Queues Role Id
    roles: [BU Role #5] => Schedules Role Id
    roles: [BU Role #6] => Administrator Role Id
    */

    enum Roles {
      Prompts = promptsRole,
      EntryPoints = promptsRole + 1,
      Menus = promptsRole + 2,
      Queues = promptsRole + 3,
      Schedules = promptsRole + 4,
      Administrator = promptsRole + 5,
    }

    return Roles;
    // return {
    //   [promptsRole]: EntityRoles.Prompts,
    //   [promptsRole + 1]: EntityRoles.EntryPoints,
    //   [promptsRole + 2]: EntityRoles.Menus,
    //   [promptsRole + 3]: EntityRoles.Queues,
    //   [promptsRole + 4]: EntityRoles.Schedules,
    //   [promptsRole + 5]: EntityRoles.Administrator,
    // };
  }, [businessUnitRoles]);

  const data: UserTableRecord[] = useMemo(() => {
    if (!users || !roles) return [];
    return Object.values(users)
      .filter((user) => !user.is_cc_user)
      .map((user) => ({
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        currentBuRoles: user.current_business_unit_roles.map(
          (buRoleId) => roles[buRoleId]
        ) as EntityRoles[],
        businessUnitRoles: user.current_business_unit_roles,
        isSuperUser: user.is_wave_superuser,
      }));
  }, [users, roles]);

  return {
    data,
    roles,
    error: usersError || businessUnitRolesError,
    isLoading: !data && !usersError && !businessUnitRoles,
  };
}
