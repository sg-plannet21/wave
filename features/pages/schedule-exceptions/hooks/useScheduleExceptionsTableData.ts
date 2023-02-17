import { Route } from 'features/pages/routes/types';
import _ from 'lodash';
import moment from 'moment';
import getConfig from 'next/config';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { ScheduleException } from '../types';

const {
  publicRuntimeConfig: { tableDateFormat },
} = getConfig();

export type ScheduleExceptionTableRecord = {
  id: string;
  name: string;
  startTimeLabel: string;
  endTimeLabel: string;
  routeLabel: string;
  status: string;
};

function getExceptionStatus(startTime: string, endTime: string) {
  const now = moment();
  const exceptionStart = moment(startTime);
  const exceptionEnd = moment(endTime);

  if (now.isAfter(exceptionEnd)) return 'Inactive';
  // currently active
  if (now.isBetween(exceptionStart, exceptionEnd))
    return exceptionEnd.fromNow();
  // upcoming
  return exceptionStart.fromNow();
}

export function useScheduleExceptionsTableData(sectionId?: string) {
  const { data: scheduleExceptions, error: scheduleExceptionsError } =
    useCollectionRequest<ScheduleException>('scheduleExceptions');

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  console.log('scheduleExceptions :>> ', scheduleExceptions);

  const data: ScheduleExceptionTableRecord[] = useMemo(() => {
    if (!scheduleExceptions || !routes) return [];

    return Object.values(scheduleExceptions)
      .filter((scheduleException) => scheduleException.section === sectionId)
      .map((scheduleException) => ({
        id: scheduleException.schedule_exception_id,
        name: scheduleException.description,
        startTimeLabel: moment(scheduleException.start_time).format(
          tableDateFormat
        ),
        endTimeLabel: moment(scheduleException.end_time).format(
          tableDateFormat
        ),
        routeLabel: _.get(routes[scheduleException.route], 'route_name'),
        status: getExceptionStatus(
          scheduleException.start_time,
          scheduleException.end_time
        ),
      }));
  }, [scheduleExceptions, sectionId, routes]);

  return {
    isLoading:
      !scheduleExceptions &&
      !routes &&
      !scheduleExceptionsError &&
      !routesError,
    error: scheduleExceptionsError || routesError,
    data,
  };
}
