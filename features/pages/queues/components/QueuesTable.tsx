import Badge from 'components/data-display/badge/Badge';
import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
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
  QueuesTableRecord,
  useQueuesTableData,
} from '../hooks/useQueuesTableData';
import DeleteQueue from './DeleteQueue';

const inactiveLabel = 'Disabled';

const QueuesTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, filters, isLoading, error } = useQueuesTableData();
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Schedules,
  ]);

  const columns: TableColumn<QueuesTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: 'queues/[queueId]',
              query: { businessUnitId, queueId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    { field: 'priority', label: 'Priority' },
    {
      field: 'closedRoute',
      label: 'Closed',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <Badge
            size="sm"
            label={entry.closedRoute ? entry.closedRoute : inactiveLabel}
            variant={entry.closedRoute ? 'primary' : 'secondary'}
          />
        );
      },
    },
    {
      field: 'noAgentsRoute',
      label: 'No Agents',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <Badge
            size="sm"
            label={entry.noAgentsRoute ? entry.noAgentsRoute : inactiveLabel}
            variant={entry.noAgentsRoute ? 'primary' : 'secondary'}
          />
        );
      },
    },
    {
      field: 'maxQueueCallsRoute',
      label: 'Max Calls',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <Badge
            size="sm"
            label={
              entry.maxQueueCallsRoute
                ? entry.maxQueueCallsRoute
                : inactiveLabel
            }
            variant={entry.maxQueueCallsRoute ? 'primary' : 'secondary'}
          />
        );
      },
    },
    {
      field: 'maxQueueTimeRoute',
      label: 'Max Time',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <Badge
            size="sm"
            label={
              entry.maxQueueTimeRoute ? entry.maxQueueTimeRoute : inactiveLabel
            }
            variant={entry.maxQueueTimeRoute ? 'primary' : 'secondary'}
          />
        );
      },
    },
    {
      field: 'callbackRoute',
      label: 'Calback',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <Badge
            size="sm"
            label={entry.callbackRoute ? entry.callbackRoute : inactiveLabel}
            variant={entry.callbackRoute ? 'primary' : 'secondary'}
          />
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
            <DeleteQueue id={entry.id} name={entry.name} />
          </div>
        );
      },
    });
  }

  function handleRouteFilterChange(filter: string) {
    filters.setRouteDisplayList((currentList) => _.xor(currentList, [filter]));
  }

  if (isLoading)
    return <WaveTablePage filters={[]} numberOfColumns={columns.length} />;

  if (error) return <div>We have encountered an error..</div>;

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        <Link href={`/${businessUnitId}/queues/new`}>
          <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <Plus />
            <span>New Queues</span>
          </a>
        </Link>
        {((data.length === 0 && filters.routeDisplayList.length < 5) ||
          data.length > 0) && (
          <div className="hidden md:block">
            <Card title="Queue Config" description="Filter by feature status">
              {filters.routeFilterList.map((routeFilter, index) => (
                <Switch
                  key={routeFilter.value}
                  isChecked={filters.routeDisplayList.includes(
                    routeFilter.value
                  )}
                  label={routeFilter.label}
                  onChange={() => handleRouteFilterChange(routeFilter.value)}
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

export default QueuesTable;
