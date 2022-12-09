import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import storage from 'lib/client/storage';
import _, { Dictionary } from 'lodash';

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

import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from 'swr/infinite';

export interface ApiCollectionResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

export type GetRequest = AxiosRequestConfig | null;

interface InfiniteReturn<Data, Error>
  extends Pick<
    SWRInfiniteResponse<
      AxiosResponse<ApiCollectionResponse<Data>>,
      AxiosError<Error>
    >,
    'isValidating' | 'error' | 'mutate' | 'size' | 'setSize'
  > {
  data: Dictionary<Data> | undefined;
  response: AxiosResponse<ApiCollectionResponse<Data>>[] | undefined;
}

export interface InfiniteConfig<Data = unknown, Error = unknown>
  extends Omit<
    SWRInfiniteConfiguration<AxiosResponse<Data>, AxiosError<Error>>,
    'fallbackData'
  > {
  fallbackData?: Data[];
}

function createWaveFetcherKey(
  request: AxiosRequestConfig | null
): string | null {
  const defaultHeaders: AxiosRequestConfig = {
    headers: {
      businessunit: storage.getBusinessUnit(),
    },
  };
  return request ? JSON.stringify({ ...defaultHeaders, ...request }) : null;
}

function getKey<Data>(
  queryKey: string,
  index: number,
  previousPageData: AxiosResponse<ApiCollectionResponse<Data>> | null
): string | null {
  if (previousPageData && !previousPageData.data.next) {
    return null;
  }

  // first page
  if (index === 0) {
    return createWaveFetcherKey({ url: queryKey });
  }
  // remaining..
  return createWaveFetcherKey({ url: `${queryKey}?page=${index}` });
}

// getRequest: (
//   index: number,
//   previousPageData: AxiosResponse<ApiCollectionResponse<Data>> | null
// ) => GetRequest,
// entityId: keyof Data,
// queryKey: string,
export default function useWaveCollectionRequest<
  Data = unknown,
  Error = unknown
>(
  entityType: keyof typeof entities,
  {
    fallbackData,
    ...config
  }: InfiniteConfig<ApiCollectionResponse<Data>, Error> = {}
): InfiniteReturn<Data, Error> {
  const {
    data: response,
    error,
    isValidating,
    mutate,
    size,
    setSize,
  } = useSWRInfinite<
    AxiosResponse<ApiCollectionResponse<Data>>,
    AxiosError<Error>
  >(
    (index, previousPageData) => {
      return getKey(entities[entityType].path, index, previousPageData);
    },
    (request) => axios(JSON.parse(request)),
    {
      ...config,
      fallbackData:
        fallbackData &&
        fallbackData.map((i) => ({
          status: 200,
          statusText: 'InitialData',
          config: {},
          headers: {},
          data: i,
        })),
    }
  );

  return {
    data:
      response &&
      _.chain(response)
        .flatMap('data.results')
        .sortBy(entities[entityType].orderBy)
        .keyBy(entities[entityType].id)
        .value(),
    response,
    mutate,
    error,
    isValidating,
    size,
    setSize,
  };
}
