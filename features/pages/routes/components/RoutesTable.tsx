import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import { Plus } from 'components/icons';
import Switch from 'components/inputs/switch';
import { mapNumberToColour } from 'components/inputs/switch/Switch';
import Card from 'components/surfaces/card';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  RouteTableRecord,
  useRouteTableData,
} from '../hooks/useRoutesTableData';
import DeleteRoute from './DeleteRoute';

const RoutesTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, filters, isLoading, error } = useRouteTableData();
  const { isSuperUser } = useIsAuthorised();

  const columns: TableColumn<RouteTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: 'routes/[routeId]',
              query: { businessUnitId, routeId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    { field: 'destination', label: 'Destination' },
    { field: 'destinationTypeLabel', label: 'Destination Type' },
    {
      field: 'systemCreatedLabel',
      label: 'Type',
    },
  ];

  if (isSuperUser) {
    columns.push({
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        if (entry.system) return <></>;
        return (
          <div className="text-right">
            <DeleteRoute id={entry.id} name={entry.name} />
          </div>
        );
      },
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>We have encountered an error..</div>;

  function handleSystemFilterToggle() {
    filters.setSystemRoutes((prevState: boolean) => !prevState);
  }

  function handleDestinationFilterChange(destination: string) {
    // symmetric difference between destination exception list and [destination]
    filters.setDestinationExceptionList((prevState: string[]) =>
      _.xor(prevState, [destination])
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex w-full">
        <div className="w-1/4 flex flex-col p-2 space-y-3">
          <Link href={`/${businessUnitId}/routes/new`}>
            <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              <Plus />
              <span>New Route</span>
            </a>
          </Link>
          <Card
            title="System Routes"
            description="Show routes generated by Wave"
          >
            <Switch
              label="Show System Routes"
              isChecked={filters.isSystemRoutes}
              onChange={handleSystemFilterToggle}
            />
          </Card>

          {filters.destinationList.length > 1 && (
            <Card
              title="Destination Types"
              description="Filter by Destination Type"
            >
              {filters.destinationList.map((destination, index) => (
                <Switch
                  key={destination}
                  isChecked={
                    !filters.destinationExceptionList.includes(destination)
                  }
                  label={destination}
                  onChange={() => handleDestinationFilterChange(destination)}
                  colour={mapNumberToColour(index)}
                />
              ))}
            </Card>
          )}
        </div>
        <div className="w-full">
          <WaveTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default RoutesTable;
