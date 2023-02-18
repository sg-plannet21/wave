import Badge from 'components/data-display/badge/Badge';
import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table/WaveTable';
import { Clock, Plus } from 'components/icons';
import Switch from 'components/inputs/switch';
import { mapNumberToColour } from 'components/inputs/switch/Switch';
import SectionsSelect from 'components/navigation/SectionsSelect';
import WaveTablePage from 'components/skeletons/wave-table-page';
import Card from 'components/surfaces/card';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  ScheduleExceptionTableRecord,
  useScheduleExceptionsTableData,
} from '../hooks/useScheduleExceptionsTableData';
import DeleteScheduleException from './DeleteScheduleException';
import ScheduleExceptionVersions from './ScheduleExceptionVersions';

const ScheduleExceptionsTables: React.FC = () => {
  const {
    query: { businessUnitId, sectionId },
  } = useRouter();
  const { data, filters, isLoading, error } = useScheduleExceptionsTableData(
    sectionId?.toString()
  );
  const { isSuperUser } = useIsAuthorised();

  const columns: TableColumn<ScheduleExceptionTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname:
                '/[businessUnitId]/schedule-exceptions/[sectionId]/[scheduleExceptionId]',
              query: {
                businessUnitId,
                sectionId,
                scheduleExceptionId: entry.id,
              },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    { field: 'startTimeLabel', label: 'Start' },
    { field: 'endTimeLabel', label: 'End' },
    {
      field: 'id',
      label: 'Status',
      ignoreFiltering: true,
      Cell({ entry }) {
        const value = entry.status.value;
        const variant =
          value === 'Active'
            ? 'success'
            : value === 'Expired'
            ? 'secondary'
            : 'primary';
        return (
          <Badge
            label={entry.status.label}
            size="sm"
            variant={variant}
            startIcon={<Clock className="h-3 w-3 mr-1" />}
          />
        );
      },
    },
    { field: 'routeLabel', label: 'Destination' },
    {
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        return <ScheduleExceptionVersions scheduleExceptionId={entry.id} />;
      },
    },
  ];

  if (isSuperUser) {
    columns.push({
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <div className="text-right">
            <DeleteScheduleException id={entry.id} name={entry.name} />
          </div>
        );
      },
    });
  }

  function handleExceptionStateFilterChange(
    state: ScheduleExceptionTableRecord['status']['value']
  ) {
    filters.setStateExceptionList((currentList) => _.xor(currentList, [state]));
  }

  if (isLoading) return <WaveTablePage numberOfColumns={columns.length} />;
  if (error) return <div>We have encountered an error..</div>;

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        <Link href={`/${businessUnitId}/schedule-exceptions/${sectionId}/new`}>
          <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <Plus />
            <span>New Exception</span>
          </a>
        </Link>

        {filters.stateList.length > 1 && (
          <div className="hidden md:block">
            <Card title="Exception States" description="Filter by State">
              {filters.stateList.map((scheduleException, index) => (
                <Switch
                  key={scheduleException}
                  isChecked={
                    !filters.stateExceptionList.includes(scheduleException)
                  }
                  label={scheduleException}
                  onChange={() =>
                    handleExceptionStateFilterChange(scheduleException)
                  }
                  colour={mapNumberToColour(index + 3)}
                />
              ))}
            </Card>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-x-auto">
        <WaveTable<ScheduleExceptionTableRecord> columns={columns} data={data}>
          <div className="w-72">
            <SectionsSelect path="schedule-exceptions" />
          </div>
        </WaveTable>
      </div>
    </div>
  );
};

export default ScheduleExceptionsTables;
