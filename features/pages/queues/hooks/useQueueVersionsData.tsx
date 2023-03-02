import {
  DeserialiseEntityReturn,
  EntityMapping,
  FormattedToVersionTable,
} from 'features/entity-versions/types';
import { deserialiseEntity } from 'features/entity-versions/utilities/deserialiseEntity';
import { getVersionObjectValue } from 'features/entity-versions/utilities/formatObjectReference';
import { Prompt } from 'features/pages/messages/types';
import { Route } from 'features/pages/routes/types';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Queue } from '../types';
import { useQueue } from './useQueue';

export default function useQueuesVersionData(queueId: string) {
  const { data: queue, error: queueError } = useQueue(
    `${queueId}?versions=true`
  );

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  const { data: messages, error: messagesError } =
    useCollectionRequest<Prompt>('prompts');

  const deserialisedQueue: Array<DeserialiseEntityReturn<Queue>> =
    useMemo(() => {
      if (!queue) return [];

      return deserialiseEntity<Queue>(queue.versions);
    }, [queue]);

  const formattedMenus: FormattedToVersionTable<Queue>[] = useMemo(() => {
    if (!routes || !messages) return [];

    return deserialisedQueue.map((queue) => {
      return {
        ...queue,
        queue_welcome: getVersionObjectValue(
          messages,
          queue.queue_welcome,
          'prompt_name'
        ),
        queue_music: getVersionObjectValue(
          messages,
          queue.queue_music,
          'prompt_name'
        ),
        whisper_message: getVersionObjectValue(
          messages,
          queue.whisper_message,
          'prompt_name'
        ),
        ...[
          'queue_message_1',
          'queue_message_2',
          'queue_message_3',
          'queue_message_4',
          'queue_message_5',
        ].reduce((lookup, message) => {
          lookup[message as keyof DeserialiseEntityReturn<Queue>] =
            getVersionObjectValue(
              messages,
              queue[
                message as keyof DeserialiseEntityReturn<Queue>
              ] as Queue['queue_message_1'],
              'prompt_name'
            );
          return lookup;
        }, {} as Partial<DeserialiseEntityReturn<Queue>>),
        closed_toggle: queue.closed_toggle ? ' On' : 'Off',
        closed_message: getVersionObjectValue(
          messages,
          queue.closed_message,
          'prompt_name'
        ),
        closed_route: getVersionObjectValue(
          routes,
          queue.closed_route,
          'route_name'
        ),
        no_agents_toggle: queue.no_agents_toggle ? ' On' : 'Off',
        no_agents_message: getVersionObjectValue(
          messages,
          queue.no_agents_message,
          'prompt_name'
        ),
        no_agents_route: getVersionObjectValue(
          routes,
          queue.no_agents_route,
          'route_name'
        ),
        max_queue_calls_toggle: queue.max_queue_calls_toggle ? ' On' : 'Off',
        max_queue_calls_message: getVersionObjectValue(
          messages,
          queue.max_queue_calls_message,
          'prompt_name'
        ),
        max_queue_calls_route: getVersionObjectValue(
          routes,
          queue.max_queue_calls_route,
          'route_name'
        ),
        max_queue_time_toggle: queue.max_queue_time_toggle ? ' On' : 'Off',
        max_queue_time_message: getVersionObjectValue(
          messages,
          queue.max_queue_time_message,
          'prompt_name'
        ),
        max_queue_time_route: getVersionObjectValue(
          routes,
          queue.max_queue_time_route,
          'route_name'
        ),
        callback_toggle: queue.callback_toggle ? ' On' : 'Off',
        callback_route: getVersionObjectValue(
          routes,
          queue.callback_route,
          'route_name'
        ),
      };
    });
  }, [deserialisedQueue, routes, messages]);

  const mappings: EntityMapping<Queue>[] = useMemo(() => {
    if (!queue) return [];

    const mappings: EntityMapping<Queue>[] = [
      { key: 'changeDate', label: 'Change Date' },
      { key: 'changeUser', label: 'Change User' },
      { key: 'queue_priority', label: 'Priority' },
      { key: 'queue_welcome', label: 'Queue Welcome' },
      { key: 'queue_music', label: 'Queue Music' },
      { key: 'whisper_message', label: 'Whisper Announcement' },
      { key: 'queue_message_1', label: 'Queue Message 1' },
      { key: 'queue_message_2', label: 'Queue Message 2' },
      { key: 'queue_message_3', label: 'Queue Message 3' },
      { key: 'queue_message_4', label: 'Queue Message 4' },
      { key: 'queue_message_5', label: 'Queue Message 5' },
      { key: 'closed_toggle', label: 'Closed Toggle' },
      { key: 'closed_message', label: 'Closed Message' },
      { key: 'closed_route', label: 'Closed Route' },
      { key: 'no_agents_toggle', label: 'No Agents Toggle' },
      { key: 'no_agents_message', label: 'No Agents Message' },
      { key: 'no_agents_route', label: 'No Agents Route' },
      { key: 'max_queue_calls_toggle', label: 'Max Queue Calls Toggle' },
      { key: 'max_queue_calls_threshold', label: 'Max Queue Calls Toggle' },
      { key: 'max_queue_calls_message', label: 'Max Queue Calls Message' },
      { key: 'max_queue_calls_route', label: 'Max Queue Calls Route' },
      { key: 'max_queue_time_toggle', label: 'Max Queue Time Toggle' },
      { key: 'max_queue_time_threshold', label: 'Max Queue Time Toggle' },
      { key: 'max_queue_time_message', label: 'Max Queue Time Message' },
      { key: 'max_queue_time_route', label: 'Max Queue Time Route' },
      { key: 'callback_toggle', label: 'Callback Toggle' },
      { key: 'callback_calls_threshold', label: 'Callback Calls Threshold' },
      { key: 'callback_time_threshold', label: 'Callback Time Threshold' },
      { key: 'callback_route', label: 'Callback Route' },
    ];

    return mappings;
  }, [queue]);

  return {
    error: queueError || routesError || messagesError,
    isLoading:
      !queue &&
      !routes &&
      !messages &&
      !queueError &&
      !routesError &&
      !messagesError,
    data: formattedMenus,
    mappings,
    label: `${
      formattedMenus.length && `${formattedMenus[0].queue_name} `
    } Versions`,
  };
}
