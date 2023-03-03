import {
  DeserialiseEntityReturn,
  EntityMapping,
  FormattedToVersionTable,
} from 'features/entity-versions/types';
import { deserialiseEntity } from 'features/entity-versions/utilities/deserialiseEntity';
import { getVersionObjectValue } from 'features/entity-versions/utilities/formatObjectReference';
import { Prompt } from 'features/pages/messages/types';
import { Route } from 'features/pages/routes/types';
import moment from 'moment';
import getConfig from 'next/config';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Schedule, Weekdays } from '../types';
import { useSchedule } from './useSchedule';

const {
  publicRuntimeConfig: { timeFormat, versionTableDateFormat },
} = getConfig();

export default function useScheduleVersionData(scheduleId: string) {
  const { data: schedule, error: scheduleError } = useSchedule(
    `${scheduleId}?versions=true`
  );
  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');
  const { data: messages, error: messagesError } =
    useCollectionRequest<Prompt>('prompts');

  const deserialisedSchedule: Array<DeserialiseEntityReturn<Schedule>> =
    useMemo(() => {
      if (!schedule) return [];

      return deserialiseEntity<Schedule>(schedule.versions);
    }, [schedule]);

  const formattedSchedules: FormattedToVersionTable<Schedule>[] =
    useMemo(() => {
      if (!routes || !messages) return [];
      return deserialisedSchedule.map((schedule) => {
        return {
          ...schedule,
          changeDate: moment(schedule.changeDate).format(
            versionTableDateFormat
          ),
          start_time: schedule.start_time
            ? moment.utc(schedule.start_time, timeFormat).format(timeFormat)
            : '',
          end_time: schedule.end_time
            ? moment.utc(schedule.end_time, timeFormat).format(timeFormat)
            : '',
          week_day: Weekdays[schedule.week_day],
          ...[
            'message_1',
            'message_2',
            'message_3',
            'message_4',
            'message_5',
          ].reduce((lookup, message) => {
            lookup[message as keyof DeserialiseEntityReturn<Schedule>] =
              getVersionObjectValue(
                messages,
                schedule[
                  message as keyof DeserialiseEntityReturn<Schedule>
                ] as Schedule['message_1'],
                'prompt_name'
              );
            return lookup;
          }, {} as Partial<DeserialiseEntityReturn<Schedule>>),
          route: getVersionObjectValue(routes, schedule.route, 'route_name'),
        };
      });
    }, [deserialisedSchedule, routes, messages]);

  const mappings: EntityMapping<Schedule>[] = useMemo(() => {
    if (!schedule) return [];
    const mappings: EntityMapping<Schedule>[] = [
      { key: 'changeDate', label: 'Change Date' },
      { key: 'changeUser', label: 'Change User' },
      { key: 'route', label: 'Route' },
      { key: 'week_day', label: 'Weekday' },
    ];
    if (!schedule.is_default)
      mappings.push(
        { key: 'start_time', label: 'Start Time' },
        { key: 'end_time', label: 'End Time' }
      );
    mappings.push(
      { key: 'message_1', label: 'Message 1' },
      { key: 'message_2', label: 'Message 2' },
      { key: 'message_3', label: 'Message 3' },
      { key: 'message_4', label: 'Message 4' },
      { key: 'message_5', label: 'Message 5' }
    );
    return mappings;
  }, [schedule]);

  return {
    error: scheduleError || routesError || messagesError,
    isLoading:
      (!schedule || !routes || !messages) &&
      !scheduleError &&
      !routesError &&
      !messagesError,
    data: formattedSchedules,
    mappings,
    label: `${
      formattedSchedules.length && `${formattedSchedules[0].week_day} `
    }Schedule Versions`,
  };
}
