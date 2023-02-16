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
import { EntityRoles } from 'state/auth/types';
import { UserTableRecord, useUsersTableData } from '../hooks/useUsersTableData';

function renderRoleIcon(user: UserTableRecord, role: EntityRoles) {
  const classes = 'h-7 w-7';
  const active = classes + ' text-green-500 dark:text-green-400';
  const inactive = classes + ' text-grey-500 dark:text-grey-400';
  if (user.isSuperUser) return <SuperAdminRole className={active} />;
  if (user.currentBuRoles.includes(EntityRoles.Administrator))
    return <AdminRole className={active} />;

  switch (role) {
    case EntityRoles.EntryPoints:
      return (
        <EntryPoint
          className={
            user.currentBuRoles.includes(EntityRoles.EntryPoints)
              ? active
              : inactive
          }
        />
      );
    case EntityRoles.Menus:
      return (
        <Menu
          className={
            user.currentBuRoles.includes(EntityRoles.Menus) ? active : inactive
          }
        />
      );
    case EntityRoles.Queues:
      return (
        <Queue
          className={
            user.currentBuRoles.includes(EntityRoles.Queues) ? active : inactive
          }
        />
      );
    case EntityRoles.Prompts:
      return (
        <Prompt
          className={
            user.currentBuRoles.includes(EntityRoles.Prompts)
              ? active
              : inactive
          }
        />
      );
    case EntityRoles.Schedules:
      return (
        <Schedule
          className={
            user.currentBuRoles.includes(EntityRoles.Schedules)
              ? active
              : inactive
          }
        />
      );

    default:
      return <></>;
  }
}

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
];

const UsersTable: React.FC = () => {
  const { data, error, isLoading } = useUsersTableData();

  if (isLoading) return <WaveTableSkeleton numberOfColumns={columns.length} />;
  if (error) return <div>We have encountered an error..</div>;

  return <Table columns={columns} data={data} />;
};

export default UsersTable;
