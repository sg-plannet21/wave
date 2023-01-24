import {
  DeserialiseEntityReturn,
  EntityMapping,
  FormattedToVersionTable,
} from 'features/entity-versions/types';
import { deserialiseEntity } from 'features/entity-versions/utilities/deserialiseEntity';
import { Prompt } from 'features/pages/messages/types';
import { Route } from 'features/pages/routes/types';
import { timeFormat } from 'lib/client/date-utilities';
import _ from 'lodash';
import moment from 'moment';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Schedule } from '../types';
import { useSchedule } from './useSchedule';

// function createScheduleMappings(
//   schedule: DeserialiseEntityReturn<Schedule>
// ): EntityMapping<Schedule>[] {
//   const mappings: EntityMapping<Schedule>[] = [
//     { key: 'changeDate', label: 'Change Date' },
//     { key: 'changeUser', label: 'Change User' },
//     { key: 'route', label: 'Route' },
//     { key: 'message_1', label: 'Message 1' },
//     { key: 'message_2', label: 'Message 2' },
//     { key: 'message_3', label: 'Message 3' },
//     { key: 'message_4', label: 'Message 4' },
//     { key: 'message_5', label: 'Message 5' },
//   ];
//   if (!schedule.is_default)
//     mappings.push(
//       { key: 'start_time', label: 'Start Time' },
//       { key: 'end_time', label: 'End Time' }
//     );
//   return mappings;
// }

// function formatVersionRecord(
//   schedule: DeserialiseEntityReturn<Omit<Schedule, 'versions'>>
// ): FormattedToVersionTable<Schedule> {
//   return {
//     ...schedule,
//     changeDate: moment(schedule.changeDate).format('MMM Do YYYY, h:mm:ss a'),
//     start_time: schedule.start_time
//       ? moment.utc(schedule.start_time, timeFormat).format(timeFormat)
//       : '',
//     end_time: schedule.end_time
//       ? moment.utc(schedule.end_time, timeFormat).format(timeFormat)
//       : '',
//   };
// }
export default function useScheduleVersionData(scheduleId: string) {
  const { data: schedule, error: scheduleError } = useSchedule(
    `${scheduleId}?versions=true`
  );
  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');
  const { data: messages, error: messagesError } =
    useCollectionRequest<Prompt>('prompts');

  //   const deserialised = deserialiseEntity<Schedule>(versions);
  //   const mappedToTable = deserialised.map(formatVersionRecord);

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
            'MMM Do YYYY, h:mm:ss a'
          ),
          start_time: schedule.start_time
            ? moment.utc(schedule.start_time, timeFormat).format(timeFormat)
            : '',
          end_time: schedule.end_time
            ? moment.utc(schedule.end_time, timeFormat).format(timeFormat)
            : '',
          ...(schedule.message_1 && {
            message_1: _.get(messages[schedule['message_1']], 'prompt_name'),
          }),
          ...(schedule.message_2 && {
            message_2: _.get(messages[schedule['message_2']], 'prompt_name'),
          }),
          ...(schedule.message_3 && {
            message_3: _.get(messages[schedule['message_3']], 'prompt_name'),
          }),
          ...(schedule.message_4 && {
            message_4: _.get(messages[schedule['message_4']], 'prompt_name'),
          }),
          ...(schedule.message_5 && {
            message_5: _.get(messages[schedule['message_5']], 'prompt_name'),
          }),
          route: _.get(routes[schedule.route], 'route_name'),
        };
      });
    }, [deserialisedSchedule, routes, messages]);

  const mappings: EntityMapping<Schedule>[] = useMemo(() => {
    if (!schedule) return [];
    const mappings: EntityMapping<Schedule>[] = [
      { key: 'changeDate', label: 'Change Date' },
      { key: 'changeUser', label: 'Change User' },
      { key: 'route', label: 'Route' },
      { key: 'message_1', label: 'Message 1' },
      { key: 'message_2', label: 'Message 2' },
      { key: 'message_3', label: 'Message 3' },
      { key: 'message_4', label: 'Message 4' },
      { key: 'message_5', label: 'Message 5' },
    ];
    if (!schedule.is_default)
      mappings.push(
        { key: 'start_time', label: 'Start Time' },
        { key: 'end_time', label: 'End Time' }
      );
    return mappings;
  }, [schedule]);

  return {
    error: scheduleError || routesError || messagesError,
    isLoading: !schedule && !routes && !messages,
    data: formattedSchedules,
    mappings,
  };
}
