import { Route } from 'features/pages/routes/types';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Queue } from '../types';

type QueueRoutes = {
  closedRoute?: string;
  noAgentsRoute?: string;
  maxQueueCallsRoute?: string;
  maxQueueTimeRoute?: string;
  callbackRoute?: string;
};

export type QueuesTableRecord = {
  id: string;
  name: string;
  priority: number;
} & QueueRoutes;

type ExceptionItem = {
  label: string;
  value: keyof QueueRoutes;
};

const routeFilterList: ExceptionItem[] = [
  { label: 'Closed', value: 'closedRoute' },
  { label: 'No Agents', value: 'noAgentsRoute' },
  { label: 'Max Calls', value: 'maxQueueCallsRoute' },
  { label: 'Max Time', value: 'maxQueueTimeRoute' },
  { label: 'Callbacks', value: 'callbackRoute' },
];

export function useQueuesTableData() {
  const [routeDisplayList, setRouteDisplayList] = useState<string[]>([
    'closedRoute',
    'noAgentsRoute',
    'maxQueueCallsRoute',
    'maxQueueTimeRoute',
    'callbackRoute',
  ]);

  const { data: queues, error: queuesError } =
    useCollectionRequest<Queue>('queues');

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  const data: QueuesTableRecord[] = useMemo(() => {
    if (!queues || !routes) return [];

    return Object.values(queues).map((queue) => ({
      id: queue.queue_id,
      name: queue.queue_name,
      priority: queue.queue_priority,
      closedRoute: queue.closed_route
        ? _.get(routes[queue.closed_route], 'route_name')
        : undefined,
      noAgentsRoute: queue.no_agents_route
        ? _.get(routes[queue.no_agents_route], 'route_name')
        : undefined,
      maxQueueCallsRoute: queue.max_queue_calls_route
        ? _.get(routes[queue.max_queue_calls_route], 'route_name')
        : undefined,
      maxQueueTimeRoute: queue.max_queue_time_route
        ? _.get(routes[queue.max_queue_time_route], 'route_name')
        : undefined,
      callbackRoute: queue.callback_route
        ? _.get(routes[queue.callback_route], 'route_name')
        : undefined,
    }));
  }, [queues, routes]);

  const filtered: QueuesTableRecord[] = useMemo(() => {
    return data.filter((queue) =>
      routeDisplayList.some((route) => !!queue[route as keyof QueueRoutes])
    );
  }, [data, routeDisplayList]);

  return {
    isLoading: !queues && !routes && !queuesError && !routesError,
    error: queuesError || routesError,
    data: filtered,
    filters: {
      routeFilterList,
      routeDisplayList,
      setRouteDisplayList,
    },
  };
}
