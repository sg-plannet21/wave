import Badge from 'components/data-display/badge/Badge';
import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import Popover from 'components/feedback/popover/Popover';
import { Plus } from 'components/icons';
import WaveTablePage from 'components/skeletons/wave-table-page/WaveTablePage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  MenusTableRecord,
  useMenusTableData,
} from '../hooks/useMenusTableData';
import DeleteMenu from './DeleteMenu';

const MenusTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, isLoading, error } = useMenusTableData();
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Menus]);

  const columns: TableColumn<MenusTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: 'menus/[menuId]',
              query: { businessUnitId, menuId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    { field: 'retries', label: 'Retries' },
    {
      field: 'noInputRoute',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        if (!entry.noInputRoute)
          return <Badge label="NI" size="sm" variant="secondary" />;

        return (
          <Popover message={entry.noInputRoute}>
            <Badge variant="primary" size="sm" label="NI" />
          </Popover>
        );
      },
    },
  ];

  if (isSuperUser || hasWriteAccess) {
    columns.push({
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <div className="text-right">
            <DeleteMenu id={entry.id} name={entry.name} />
          </div>
        );
      },
    });
  }

  if (isLoading)
    return <WaveTablePage filters={[]} numberOfColumns={columns.length} />;

  if (error) return <div>We have encountered an error..</div>;

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        <Link href={`/${businessUnitId}/menu/new`}>
          <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <Plus />
            <span>New Menu</span>
          </a>
        </Link>
      </div>
      <div className="flex-1 overflow-x-auto">
        <WaveTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default MenusTable;
