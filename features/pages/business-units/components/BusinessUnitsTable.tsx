import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import { Plus } from 'components/icons';
import WaveTablePage from 'components/skeletons/wave-table-page';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BusinessUnitTableRecord,
  useBusinessUnitsTableData,
} from '../hooks/useBusinessUnitsTableData';
import DeleteBusinessUnit from './DeleteSection';

// const scheduleId = '9594dce5-ba32-413b-9430-39620f165f30';
// return <ScheduleVersions scheduleId={scheduleId} />;
const BusinessUnitsTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, error, isLoading } = useBusinessUnitsTableData();

  const columns: TableColumn<BusinessUnitTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: 'business-units/[buId]',
              query: { businessUnitId, buId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    {
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <div className="text-right">
            <DeleteBusinessUnit id={entry.id} name={entry.name} />
          </div>
        );
      },
    },
  ];

  if (isLoading)
    return <WaveTablePage filters={[]} numberOfColumns={columns.length} />;

  if (error) return <div>We have encountered an error..</div>;

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="md:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        <Link href={`/${businessUnitId}/business-units/new`}>
          <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            <Plus />
            <span>New Business Unit</span>
          </a>
        </Link>
      </div>
      <div className="flex-1 overflow-x-auto">
        <WaveTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default BusinessUnitsTable;
