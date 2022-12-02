import _ from 'lodash';
import { useMemo } from 'react';
import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { Route, RouteDestinationType, RouteTableEntity } from '../types';

export function useRouteTableData() {
  const { data: routes, error: routesError } =
    useWaveCollectionRequest<Route>('routes');
  const { data: destinationTypes, error: destinationTypesError } =
    useWaveCollectionRequest<RouteDestinationType>('routeDestinationTypes');

  const routeTableData = useMemo((): RouteTableEntity[] => {
    if (!routes || !destinationTypes) return [];

    return Object.values(routes).map((route) => ({
      ...route,
      system_created_label: route.system_created ? 'System' : 'Custom',
      destination_type_label: _.get(
        destinationTypes[route.destination_type],
        'destination_type'
      ),
    }));
  }, [routes, destinationTypes]);

  return {
    isLoading:
      !routes && !destinationTypes && !routesError && !destinationTypesError,
    data: routeTableData,
    error: routesError || destinationTypesError,
  };
}
