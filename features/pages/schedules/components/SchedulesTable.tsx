import Table, { TableColumn } from 'components/data-display/table';
import { Plus } from 'components/icons';
import Switch from 'components/inputs/switch';
import { mapNumberToColour } from 'components/inputs/switch/Switch';
import SectionsSelect from 'components/navigation/SectionsSelect';
import Card from 'components/surfaces/card';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import {
  ScheduleTableRecord,
  useSchedulesTableData,
} from '../hooks/useSchedulesTableData';
import { Weekdays } from '../types';
import DeleteSchedule from './DeleteSchedule';

const SchedulesTable: React.FC = () => {
  const [selectedSchedules, setSelectedSchedules] = useState<{
    isDefault: boolean;
    schedules: string[];
  }>({ isDefault: false, schedules: [] });

  const {
    query: { businessUnitId, sectionId },
  } = useRouter();
  const { data, filters, isLoading, error } = useSchedulesTableData(
    sectionId?.toString()
  );
  const { isSuperUser, hasWriteAccess } = useIsAuthorised();

  // clear selected schedules on section change (nav dropdown)
  useEffect(() => {
    setSelectedSchedules({ isDefault: false, schedules: [] });
  }, [sectionId]);

  function handleScheduleAdd(scheduleId: string, isDefaultSchedule: boolean) {
    const isDefault = selectedSchedules.schedules.length
      ? selectedSchedules.isDefault
      : isDefaultSchedule;

    const schedules = _.xor(selectedSchedules.schedules, [scheduleId]);
    setSelectedSchedules({ isDefault, schedules });
  }

  const columns: TableColumn<ScheduleTableRecord>[] = [
    {
      field: 'id',
      ignoreFiltering: true,
      label: '',
      Cell({ entry }) {
        return (
          <div className="flex items-center">
            <input
              disabled={
                selectedSchedules.schedules.length > 0 &&
                selectedSchedules.isDefault !== entry.isDefault
              }
              checked={selectedSchedules.schedules.includes(
                entry.id.toString()
              )}
              onChange={() => handleScheduleAdd(entry.id, entry.isDefault)}
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label className="sr-only">checkbox</label>
          </div>
        );
      },
    },
    {
      field: 'weekDay',
      label: 'Day',
      Cell({ entry }) {
        return (
          <Link
            href={{
              pathname: '/[businessUnitId]/schedules/[sectionId]/[scheduleId]',
              query: { businessUnitId, sectionId, scheduleId: entry.id },
            }}
          >
            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
              {Weekdays[entry.weekDay]}
            </a>
          </Link>
        );
      },
    },
    { field: 'startTime', label: 'Start Time' },
    { field: 'endTime', label: 'End Time' },
    {
      field: 'route',
      label: 'Route',
    },
  ];

  if (isSuperUser || hasWriteAccess) {
    columns.push({
      field: 'id',
      label: '',
      ignoreFiltering: true,
      Cell({ entry }) {
        if (entry.isDefault) return <></>;
        return (
          <div className="text-right">
            <DeleteSchedule id={entry.id} name={entry.weekDay.toString()} />
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

  function handleDayFilterChange(day: number) {
    // symmetric difference between destination exception list and [destination]
    filters.setDayExceptions((prevState: number[]) => _.xor(prevState, [day]));
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex w-full">
        <div className="w-1/4 flex flex-col p-2 space-y-3">
          <Link href={`/${businessUnitId}/schedules/new`}>
            <a className="flex justify-center items-center space-x-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              <Plus />
              <span>New Schedule</span>
            </a>
          </Link>
          <Card
            title="Default Schedules"
            description="Fallback / Catch all schedules"
          >
            <Switch
              label="Default Schedules"
              isChecked={filters.isSystemRoutes}
              onChange={handleSystemFilterToggle}
            />
          </Card>
          <Card title="Days" description="Filter by Day">
            {Array.from(Array(7).keys())
              .map((day) => day + 1)
              .map((day) => (
                <Switch
                  key={day}
                  isChecked={!filters.dayExceptions.includes(day)}
                  label={Weekdays[day]}
                  onChange={() => handleDayFilterChange(day)}
                  colour={mapNumberToColour(day + 5)}
                />
              ))}
          </Card>
        </div>
        <div className="w-full">
          <div className="py-2 px-4 flex justify-end">
            <div className="w-72">
              <SectionsSelect />
            </div>
          </div>
          <Table<ScheduleTableRecord> columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default SchedulesTable;
