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
import { ScheduleException } from '../types';
import { useScheduleException } from './useScheduleException';

const {
  publicRuntimeConfig: { versionTableFormat },
} = getConfig();

export default function useScheduleExceptionsVersionData(
  scheduleExceptionId: string
) {
  const { data: scheduleException, error: scheduleExceptionError } =
    useScheduleException(`${scheduleExceptionId}?versions=true`);

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  const { data: messages, error: messagesError } =
    useCollectionRequest<Prompt>('prompts');

  const deserialisedScheduleException: Array<
    DeserialiseEntityReturn<ScheduleException>
  > = useMemo(() => {
    if (!scheduleException) return [];

    return deserialiseEntity<ScheduleException>(scheduleException.versions);
  }, [scheduleException]);

  const formattedSchedules: FormattedToVersionTable<ScheduleException>[] =
    useMemo(() => {
      if (!routes || !messages) return [];
      return deserialisedScheduleException.map((scheduleException) => {
        return {
          ...scheduleException,
          route: getVersionObjectValue(
            routes,
            scheduleException.route,
            'route_name'
          ),
          start_time: moment(scheduleException.start_time).format(
            versionTableFormat
          ),
          end_time: moment(scheduleException.start_time).format(
            versionTableFormat
          ),
          ...[
            'message_1',
            'message_2',
            'message_3',
            'message_4',
            'message_5',
          ].reduce((lookup, message) => {
            lookup[
              message as keyof DeserialiseEntityReturn<ScheduleException>
            ] = getVersionObjectValue(
              messages,
              scheduleException[
                message as keyof DeserialiseEntityReturn<ScheduleException>
              ] as ScheduleException['message_1'],
              'prompt_name'
            );
            return lookup;
          }, {} as Partial<DeserialiseEntityReturn<ScheduleException>>),
        };
      });
    }, [deserialisedScheduleException, routes, messages]);

  const mappings: EntityMapping<ScheduleException>[] = useMemo(() => {
    if (!scheduleException) return [];

    const mappings: EntityMapping<ScheduleException>[] = [
      { key: 'changeDate', label: 'Change Date' },
      { key: 'changeUser', label: 'Change User' },
      { key: 'start_time', label: 'Start' },
      { key: 'end_time', label: 'End' },
      { key: 'route', label: 'Route' },
      { key: 'description', label: 'Name' },
      { key: 'message_1', label: 'Message 1' },
      { key: 'message_2', label: 'Message 2' },
      { key: 'message_3', label: 'Message 3' },
      { key: 'message_4', label: 'Message 4' },
      { key: 'message_5', label: 'Message 5' },
    ];

    return mappings;
  }, [scheduleException]);

  return {
    error: scheduleExceptionError || routesError || messagesError,
    isLoading:
      !scheduleException &&
      !routes &&
      !messages &&
      !scheduleExceptionError &&
      !routesError &&
      !messagesError,
    data: formattedSchedules,
    mappings,
    label: `${
      formattedSchedules.length && `${formattedSchedules[0].description} `
    }Exception Versions`,
  };
}
