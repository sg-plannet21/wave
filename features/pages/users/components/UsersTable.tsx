import classNames from 'classnames';
import { TableColumn } from 'components/data-display/table';
import Table from 'components/data-display/table/Table';
import {
  AdminRole,
  EntryPoint,
  Menu,
  Prompt,
  Queue,
  Schedule,
  SuperAdminRole,
} from 'components/icons';
import WaveTableSkeleton from 'components/skeletons/wave-table/WaveTableSkeleton';
import _ from 'lodash';
import { useContext } from 'react';
import { EntityRoles } from 'state/auth/types';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { UpdateUserRolesDto, updateUserRoles } from '../api/updateUserRoles';
import { UserTableRecord, useUsersTableData } from '../hooks/useUsersTableData';
import { User } from '../types';

const iconBaseClasses = 'h-7 w-7';
const clickableClasses =
  'cursor-pointer hover:scale-125 transition-transform duration-300';
const iconActiveClasses = 'text-green-500 dark:text-green-400';

const UsersTable: React.FC = () => {
  const { data, roles, error, isLoading } = useUsersTableData();
  const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<User>('users');

  const columns: TableColumn<UserTableRecord>[] = [
    { field: 'username', label: 'Username' },
    { field: 'firstName', label: 'First Name' },
    { field: 'lastName', label: 'Last Name' },
    {
      field: 'id',
      label: 'Entry Points',
      Cell({ entry }) {
        return renderRoleIcon(entry, EntityRoles.EntryPoints);
      },
    },
    {
      field: 'id',
      label: 'Menus',
      Cell({ entry }) {
        return renderRoleIcon(entry, EntityRoles.Menus);
      },
    },
    {
      field: 'id',
      label: 'Queues',
      Cell({ entry }) {
        return renderRoleIcon(entry, EntityRoles.Queues);
      },
    },
    {
      field: 'id',
      label: 'Messages',
      Cell({ entry }) {
        return renderRoleIcon(entry, EntityRoles.Prompts);
      },
    },
    {
      field: 'id',
      label: 'Schedules',
      Cell({ entry }) {
        return renderRoleIcon(entry, EntityRoles.Schedules);
      },
    },
    {
      field: 'id',
      label: 'Administrator',
      Cell({ entry }) {
        return renderRoleIcon(entry, EntityRoles.Administrator);
      },
    },
  ];

  if (isLoading) return <WaveTableSkeleton numberOfColumns={columns.length} />;
  if (error) return <div>We have encountered an error..</div>;

  function getIconProps(user: UserTableRecord, role: EntityRoles) {
    const iconInactiveClasses = 'text-grey-500 dark:text-grey-400';

    return {
      onClick: () => handleRoleToggle(user, role),
      className: classNames(iconBaseClasses, clickableClasses, {
        [iconActiveClasses]: user.currentBuRoles.includes(role),
        [iconInactiveClasses]: !user.currentBuRoles.includes(role),
      }),
    };
  }

  function updateBusinessRoleList(
    user: UserTableRecord,
    role: EntityRoles
  ): number[] {
    if (!roles) return [];

    // xor complete BU list vs current roles + new role
    if (
      role === EntityRoles.Administrator ||
      user.currentBuRoles.includes(EntityRoles.Administrator)
    ) {
      return _.xor(
        user.businessUnitRoles,
        [...user.currentBuRoles, role].map((role) => roles[role])
      );
    }

    // xor the complete BU list vs the new option
    return _.xor(
      user.currentBuRoles.map((role) => roles[role]),
      [roles[role]]
    );
  }

  async function handleRoleToggle(user: UserTableRecord, role: EntityRoles) {
    if (!roles) return;

    const payload: UpdateUserRolesDto = {
      userId: user.id,
      roles: updateBusinessRoleList(user, role),
    };

    mutate(async (existingUsers) => {
      try {
        const { data } = await updateUserRoles(payload);
        addNotification({
          title: 'Updated Role',
          message: `${role} role updated for ${user.firstName} ${user.lastName}.`,
          type: 'success',
          duration: 3000,
        });
        const updatedUser = { [data['id']]: data };
        return { ...existingUsers, ...updatedUser };
      } catch (error) {
        console.log('error :>> ', error);
        return existingUsers;
      }
    });
  }

  function renderRoleIcon(user: UserTableRecord, role: EntityRoles) {
    if (user.isSuperUser) {
      return (
        <SuperAdminRole
          className={classNames(iconBaseClasses, iconActiveClasses)}
        />
      );
    }

    if (user.currentBuRoles.includes(EntityRoles.Administrator)) {
      return (
        <AdminRole
          className={classNames(
            iconBaseClasses,
            clickableClasses,
            iconActiveClasses
          )}
          onClick={() => handleRoleToggle(user, role)}
        />
      );
    }

    switch (role) {
      case EntityRoles.EntryPoints:
        return <EntryPoint {...getIconProps(user, EntityRoles.EntryPoints)} />;

      case EntityRoles.Menus:
        return <Menu {...getIconProps(user, EntityRoles.Menus)} />;

      case EntityRoles.Queues:
        return <Queue {...getIconProps(user, EntityRoles.Queues)} />;

      case EntityRoles.Prompts:
        return <Prompt {...getIconProps(user, EntityRoles.Prompts)} />;

      case EntityRoles.Schedules:
        return <Schedule {...getIconProps(user, EntityRoles.Schedules)} />;

      case EntityRoles.Administrator:
        return <AdminRole {...getIconProps(user, EntityRoles.Administrator)} />;

      default:
        return <></>;
    }
  }

  return <Table columns={columns} data={data} />;
};

export default UsersTable;
