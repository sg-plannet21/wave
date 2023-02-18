import { Route } from 'features/pages/routes/types';
import _ from 'lodash';
import moment from 'moment';
import getConfig from 'next/config';
import { useMemo, useState } from 'react';
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
  status: { value: 'Expired' | 'Active' | 'Upcoming'; label: string };
};

function getExceptionStatus(
  startTime: string,
  endTime: string
): ScheduleExceptionTableRecord['status'] {
  const now = moment();
  const exceptionStart = moment(startTime);
  const exceptionEnd = moment(endTime);

  if (now.isAfter(exceptionEnd))
    return { value: 'Expired', label: exceptionStart.fromNow() };

  if (now.isBetween(exceptionStart, exceptionEnd))
    return {
      value: 'Active',
      label: exceptionEnd.fromNow().replace('in', 'for'),
    };

  return { value: 'Upcoming', label: exceptionStart.fromNow() };
}

export function useScheduleExceptionsTableData(sectionId?: string) {
  const [stateExceptionList, setStateExceptionList] = useState<
    ScheduleExceptionTableRecord['status']['value'][]
  >([]);

  const { data: scheduleExceptions, error: scheduleExceptionsError } =
    useCollectionRequest<ScheduleException>('scheduleExceptions');

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

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

  const filteredData: ScheduleExceptionTableRecord[] = useMemo(
    () =>
      data.filter(
        (exception) => !stateExceptionList.includes(exception.status.value)
      ),
    [data, stateExceptionList]
  );

  const stateList: ScheduleExceptionTableRecord['status']['value'][] = useMemo(
    () =>
      _.chain(data)
        .map((exception) => exception.status.value)
        .uniq()
        .sortBy((exception) => exception.toLowerCase())
        .value(),
    [data]
  );

  return {
    isLoading:
      !scheduleExceptions &&
      !routes &&
      !scheduleExceptionsError &&
      !routesError,
    error: scheduleExceptionsError || routesError,
    data: filteredData,
    filters: {
      stateList,
      stateExceptionList,
      setStateExceptionList,
    },
  };
}
