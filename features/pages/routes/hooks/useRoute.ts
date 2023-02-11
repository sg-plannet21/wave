import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { Route } from '../types';

export const useRoute = (
  routeId?: string,
  config?: Config<Route, WaveError>
) => {
  return useRequest<Route, WaveError>(
    routeId ? { url: `/routes/${routeId}` } : null,
    config
  );
};
