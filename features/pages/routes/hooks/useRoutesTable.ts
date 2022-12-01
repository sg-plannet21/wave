import _, { Dictionary } from 'lodash';
import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { Route, RouteDestinationType, RouteTableEntity } from '../types';

function mapToRouteTable(
  routes: Dictionary<Route>,
  destinationTypes: Dictionary<RouteDestinationType>
): RouteTableEntity[] {
  return Object.values(routes).map((route) => ({
    ...route,
    system_created_label: route.system_created ? 'System' : 'Custom',
    destination_type_label: _.get(
      destinationTypes[route.destination_type],
      'destination_type'
    ),
  }));
}

export function useRouteTableData() {
  const { data: routes, error: routesError } =
    useWaveCollectionRequest<Route>('routes');
  const { data: entryPoints, error: entryPointsError } =
    useWaveCollectionRequest<RouteDestinationType>('routeDestinationTypes');

  return {
    isLoading: !routes && !entryPoints && !routesError && !entryPointsError,
    data: (routes && entryPoints && mapToRouteTable(routes, entryPoints)) || [],
    error: routesError || entryPointsError,
  };
}
