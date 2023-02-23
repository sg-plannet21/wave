import Badge from 'components/data-display/badge/Badge';
import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import Popover from 'components/feedback/popover/Popover';
import { Plus } from 'components/icons';
import Switch from 'components/inputs/switch';
import { mapNumberToColour } from 'components/inputs/switch/Switch';
import WaveTablePage from 'components/skeletons/wave-table-page/WaveTablePage';
import Card from 'components/surfaces/card';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  MenuOptions,
  MenusTableRecord,
  fieldList,
  useMenusTableData,
} from '../hooks/useMenusTableData';
import DeleteMenu from './DeleteMenu';

const MenusTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, filters, isLoading, error } = useMenusTableData();
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Menus]);

  const options: TableColumn<MenusTableRecord>[] = fieldList.map(
    ({ value: option }) => ({
      field: option as keyof MenuOptions,
      label: '',
      ignoreFiltering: true,
      Cell({ entry }: { entry: MenusTableRecord }) {
        if (!entry[option as keyof MenuOptions].route)
          return (
            <Badge
              label={entry[option as keyof MenuOptions].label}
              size="sm"
              variant="secondary"
            />
          );

        return (
          <Popover message={entry[option as keyof MenuOptions].route as string}>
            <Badge
              variant="primary"
              size="sm"
              label={entry[option as keyof MenuOptions].label}
            />
          </Popover>
        );
      },
    })
  );

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
    ...options,
    { field: 'retries', label: 'Retries' },
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

  function handleOptionFilterChange(option: string) {
    filters.setOptionExceptionList((exceptionList) =>
      _.xor(exceptionList, [option])
    );
  }

  if (isLoading)
    return <WaveTablePage filters={[]} numberOfColumns={columns.length} />;

  if (error) return <div>We have encountered an error..</div>;

  console.log('data.length :>> ', data.length);
  console.log('filters.option :>> ', filters.optionExceptionList);
  console.log('filters.option.length :>> ', filters.optionExceptionList.length);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        <Link href={`/${businessUnitId}/menus/new`}>
          <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <Plus />
            <span>New Menu</span>
          </a>
        </Link>

        {(data.length > 0 ||
          (data.length === 0 && filters.optionExceptionList.length !== 0)) && (
          <div className="hidden md:block">
            <Card
              title="Destination Types"
              description="Filter by Destination Type"
            >
              {filters.optionList.map((menuOption, index) => (
                <Switch
                  key={menuOption.value}
                  isChecked={
                    !filters.optionExceptionList.includes(menuOption.value)
                  }
                  label={menuOption.label}
                  onChange={() => handleOptionFilterChange(menuOption.value)}
                  colour={mapNumberToColour(index)}
                />
              ))}
            </Card>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-x-auto">
        <WaveTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default MenusTable;
