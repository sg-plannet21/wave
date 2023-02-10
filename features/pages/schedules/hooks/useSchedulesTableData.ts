import { Route } from 'features/pages/routes/types';
import {
  createMomentUtc,
  formatUtcToLocalTimeString,
} from 'lib/client/date-utilities';
import _ from 'lodash';
import moment from 'moment';
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
  isActive: boolean;
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
      isActive: false,
    }));
  }, [schedules, routes]);

  const dataWithActiveSchedule: ScheduleTableRecord[] = useMemo(() => {
    if (!data) return [];
    const now = moment();
    const filtered = data.filter((schedule) => schedule.weekDay === now.day());
    const activeSchedule = filtered.find(
      ({ startTime, endTime, isDefault }) => {
        if (isDefault) return false;
        return now.isBetween(
          createMomentUtc(startTime as string),
          createMomentUtc(endTime as string)
        );
      }
    );
    const activeScheduleId = activeSchedule
      ? activeSchedule.id
      : filtered.find((schedule) => schedule.isDefault)?.id;

    return data.map((schedule) => ({
      ...schedule,
      isActive: schedule.id === activeScheduleId,
    }));
  }, [data]);

  const filterBySection: ScheduleTableRecord[] = useMemo(() => {
    if (!sectionId) return dataWithActiveSchedule;
    return dataWithActiveSchedule.filter(
      (schedule) => schedule.sectionId === sectionId
    );
  }, [dataWithActiveSchedule, sectionId]);

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
    isLoading: (!schedules || !routes) && !routesError && !schedulesError,
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
