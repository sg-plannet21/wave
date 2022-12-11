import { AxiosError } from 'axios';
import { entityFetcher } from 'lib/client/api-helper';

import storage from 'lib/client/storage';
import { WaveError } from 'lib/client/types';
import { Dictionary } from 'lodash';
import useSWR from 'swr';

type EntityMap = {
  [key: string]: { id: string; path: string; orderBy: string };
};

const entities: EntityMap = {
  routes: { id: 'route_id', path: '/routes/', orderBy: 'route_name' },
  entrypoints: {
    id: 'entry_point_id',
    path: '/entrypoints/',
    orderBy: 'entry_point',
  },
  users: { id: 'id', path: '/users/', orderBy: 'last_name' },
  regions: { id: 'id', path: '/regions/', orderBy: 'language_name' },
  menus: { id: 'menu_id', path: '/menus/', orderBy: 'menu_name' },
  queues: { id: 'queue_id', path: '/queues/', orderBy: 'queue_name' },
  prompts: { id: 'prompt_id', path: '/prompts/', orderBy: 'prompt_name' },
  section: { id: 'schedule_id', path: '/section/', orderBy: 'section' },
  schedules: { id: 'section_id', path: '/schedules/', orderBy: 'week_day' },
  scheduleExceptions: {
    id: 'schedule_exception_id',
    path: '/scheduleexceptions/',
    orderBy: 'description',
  },
  routeDestinationTypes: {
    id: 'destination_type_id',
    path: '/routedestinationtypes/',
    orderBy: 'destination_type',
  },
};

export default function useCollectionRequest<Entity>(
  entityType: keyof typeof entities
) {
  if (!entities[entityType]) {
    throw new Error('Unknown entity for useCollectionRequest: ' + entityType);
  }
  return useSWR<Dictionary<Entity>, AxiosError<WaveError>>(
    [entities[entityType].path, storage.getBusinessUnit()],
    entityFetcher(
      entities[entityType].id as keyof Entity,
      entities[entityType].orderBy as keyof Entity
    )
  );
}
