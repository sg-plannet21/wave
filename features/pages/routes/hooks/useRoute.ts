import useRequest, { Config } from 'state/hooks/useRequest';
import { Route } from '../types';

// export const getRoute = ({ routeId }: { routeId: string }): Promise<Route> => {
//   return axios.get(`/routes/${routeId}`);
// };

// type UseRouteOptions = {
//   routeId?: string;
//   config?: Config;
// };

export const useRoute = (routeId?: string, config?: Config) => {
  return useRequest<Route, string>(
    routeId ? { url: `/routes/${routeId}`, ...config } : null
  );
};
