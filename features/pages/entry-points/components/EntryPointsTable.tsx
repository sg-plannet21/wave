import { TableColumn } from 'components/data-display/table';
import WaveTable from 'components/data-display/wave-table';
import Switch from 'components/inputs/switch';
import { mapNumberToColour } from 'components/inputs/switch/Switch';
import WaveTablePage from 'components/skeletons/wave-table-page';
import Card from 'components/surfaces/card';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  EntryPointTableRecord,
  useEntryPointsTableData,
} from '../hooks/useEntryPointsData';
import DeleteEntryPoint from './DeleteEntryPoint';

const EntryPointsTable: React.FC = () => {
  const {
    query: { businessUnitId },
  } = useRouter();
  const { data, filters, isLoading, error } = useEntryPointsTableData();
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.EntryPoints,
  ]);

  const columns: TableColumn<EntryPointTableRecord>[] = [
    {
      field: 'name',
      label: 'Name',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: 'entry-points/[entryPointId]',
              query: { businessUnitId, entryPointId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {entry.name}
            </a>
          </Link>
        );
      },
    },
    { field: 'section', label: 'Section' },
    { field: 'region', label: 'Region' },
  ];

  if (isSuperUser || hasWriteAccess) {
    columns.push({
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        return (
          <div className="text-right">
            <DeleteEntryPoint id={entry.id} name={entry.name} />
          </div>
        );
      },
    });
  }

  if (isLoading) return <WaveTablePage numberOfColumns={columns.length} />;
  if (error) return <div>We have encountered an error..</div>;

  function handleSectionFilterChange(sectionName: string) {
    filters.setSectionExceptionList(
      _.xor(filters.sectionExceptionList, [sectionName])
    );
  }

  function handleRegionFilterChange(regionName: string) {
    filters.setRegionExceptionList(
      _.xor(filters.regionExceptionList, [regionName])
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
        {filters.sectionList.length > 1 && (
          <div className="hidden md:block">
            <Card title="Sections">
              {filters.sectionList.map((sectionName, index) => (
                <Switch
                  key={sectionName}
                  isChecked={
                    !filters.sectionExceptionList.includes(sectionName)
                  }
                  label={sectionName}
                  onChange={() => handleSectionFilterChange(sectionName)}
                  colour={mapNumberToColour(index)}
                />
              ))}
            </Card>
          </div>
        )}
        {filters.regionList.length > 1 && (
          <div className="hidden md:block">
            <Card title="Regions">
              {filters.regionList.map((regionName, index) => (
                <Switch
                  key={regionName}
                  isChecked={!filters.regionExceptionList.includes(regionName)}
                  label={regionName}
                  onChange={() => handleRegionFilterChange(regionName)}
                  colour={mapNumberToColour(index + 6)}
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

export default EntryPointsTable;
