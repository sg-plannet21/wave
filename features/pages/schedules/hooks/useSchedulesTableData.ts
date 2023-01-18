import { Route } from 'features/pages/routes/types';
import { formatUtcToLocalTimeString } from 'lib/client/date-utilities';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Schedule } from '../types';

export type ScheduleTableRecord = {
  id: string;
  isDefault: boolean;
  weekDay: number;
  startTime: string | null;
  endTime: string | null;
  route: string;
  sectionId: string;
};

export function useSchedulesTableData(sectionId?: string) {
  const [showDefaultSchedules, setShowDefaultSchedules] =
    useState<boolean>(true);
  const [dayExceptions, setDayExceptions] = useState<number[]>([]);

  const { data: schedules, error: schedulesError } =
    useCollectionRequest<Schedule>('schedules');
  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  const data: ScheduleTableRecord[] = useMemo(() => {
    if (!schedules || !routes) return [];

    return Object.values(schedules).map((schedule) => ({
      id: schedule.schedule_id,
      weekDay: schedule.week_day,
      isDefault: schedule.is_default,
      startTime: schedule.start_time
        ? formatUtcToLocalTimeString(schedule.start_time)
        : 'Default',
      endTime: schedule.end_time
        ? formatUtcToLocalTimeString(schedule.end_time)
        : 'Default',
      route: _.get(routes[schedule.route], 'route_name'),
      sectionId: schedule.section,
    }));
  }, [schedules, routes]);

  const filterBySection: ScheduleTableRecord[] = useMemo(() => {
    if (!sectionId) return data;
    return data.filter((schedule) => schedule.sectionId === sectionId);
  }, [data, sectionId]);

  const filteredBySystem: ScheduleTableRecord[] = useMemo(() => {
    return showDefaultSchedules
      ? filterBySection
      : filterBySection.filter((schedule) => !schedule.isDefault);
  }, [filterBySection, showDefaultSchedules]);

  const filterByDays: ScheduleTableRecord[] = useMemo(() => {
    return filteredBySystem.filter(
      (schedule) => !dayExceptions.includes(schedule.weekDay)
    );
  }, [filteredBySystem, dayExceptions]);

  const ordered: ScheduleTableRecord[] = useMemo(() => {
    return _.orderBy(filterByDays, ['weekDay', 'startTime'], ['asc', 'asc']);
  }, [filterByDays]);

  return {
    isLoading: !schedules && !routes && !schedulesError && !routesError,
    error: schedulesError || routesError,
    data: ordered,
    filters: {
      isSystemRoutes: showDefaultSchedules,
      setSystemRoutes: setShowDefaultSchedules,
      dayExceptions,
      setDayExceptions,
    },
  };
}
