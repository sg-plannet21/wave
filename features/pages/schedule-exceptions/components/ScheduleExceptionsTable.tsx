import { TableColumn } from 'components/data-display/table';
import Table from 'components/data-display/table/Table';
import { Plus } from 'components/icons';
import SectionsSelect from 'components/navigation/SectionsSelect';
import WaveTablePage from 'components/skeletons/wave-table-page';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  ScheduleExceptionTableRecord,
  useScheduleExceptionsTableData,
} from '../hooks/useScheduleExceptionsTableData';
import DeleteScheduleException from './DeleteScheduleException';

const ScheduleExceptionsTables: React.FC = () => {
  const {
    query: { businessUnitId, sectionId },
  } = useRouter();
  const { data, isLoading, error } = useScheduleExceptionsTableData(
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
              pathname: 'schedule-exceptions/[scheduleExceptionId]',
              query: { businessUnitId, scheduleExceptionId: entry.id },
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
    { field: 'status', label: 'Status' },
    { field: 'routeLabel', label: 'Destination' },
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
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="py-2 px-4 flex justify-end">
          <div className="w-72">
            <SectionsSelect path="schedule-exceptions" />
          </div>
        </div>
        <Table<ScheduleExceptionTableRecord> columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ScheduleExceptionsTables;
