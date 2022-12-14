import { Route } from 'features/pages/routes/types';
import { formatTimeString } from 'lib/client/date-utilities';
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
};

export function useSchedulesTableData() {
  const [showSystemRoutes, setShowSystemRoutes] = useState<boolean>(true);
  const [dayExceptions, setDayExceptions] = useState<number[]>([]);

  const { data: schedules, error: schedulesError } =
    useCollectionRequest<Schedule>('schedules');
  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  console.log('schedules :>> ', schedules);

  const data: ScheduleTableRecord[] = useMemo(() => {
    if (!schedules || !routes) return [];

    return Object.values(schedules).map((schedule) => ({
      id: schedule.schedule_id,
      weekDay: schedule.week_day,
      isDefault: schedule.is_default,
      startTime: schedule.start_time
        ? formatTimeString(schedule.start_time)
        : 'default',
      endTime: schedule.end_time
        ? formatTimeString(schedule.end_time)
        : 'default',
      route: _.get(routes[schedule.route], 'route_name'),
    }));
  }, [schedules, routes]);

  const filteredBySystem: ScheduleTableRecord[] = useMemo(() => {
    return showSystemRoutes
      ? data
      : data.filter((schedule) => !schedule.isDefault);
  }, [data, showSystemRoutes]);

  const filterByDays = useMemo(() => {
    return filteredBySystem.filter(
      (schedule) => !dayExceptions.includes(schedule.weekDay)
    );
  }, [filteredBySystem, dayExceptions]);

  return {
    isLoading: !schedules && !routes && !schedulesError && !routesError,
    error: schedulesError || routesError,
    data: filterByDays,
    filters: {
      isSystemRoutes: showSystemRoutes,
      setSystemRoutes: setShowSystemRoutes,
      dayExceptions,
      setDayExceptions,
    },
  };
}
