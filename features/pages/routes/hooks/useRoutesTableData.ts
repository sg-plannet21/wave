import _ from 'lodash';
import { useMemo, useState } from 'react';
import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { Route, RouteDestinationType } from '../types';

export type RouteTableRecord = {
  id: string;
  name: string;
  destinationTypeLabel: string;
  system: boolean;
  systemCreatedLabel: string;
};

export function useRouteTableData() {
  const [showSystemRoutes, setShowSystemRoutes] = useState<boolean>(false);
  const [destinationExceptionList, setDestinationExceptionList] = useState<
    string[]
  >([]);

  const { data: routes, error: routesError } =
    useWaveCollectionRequest<Route>('routes');
  const { data: destinationTypes, error: destinationTypesError } =
    useWaveCollectionRequest<RouteDestinationType>('routeDestinationTypes');

  const data: RouteTableRecord[] = useMemo(() => {
    if (!routes || !destinationTypes) return [];

    return Object.values(routes).map((route) => ({
      id: route.route_id,
      name: route.route_name,
      system: route.system_created,
      systemCreatedLabel: route.system_created ? 'System' : 'Custom',
      destinationTypeLabel: _.get(
        destinationTypes[route.destination_type],
        'destination_type'
      ),
    }));
  }, [routes, destinationTypes]);

  const filteredBySystem = useMemo(() => {
    return showSystemRoutes ? data : data.filter((route) => !route.system);
  }, [data, showSystemRoutes]);

  const filteredByDestination = useMemo(() => {
    return filteredBySystem.filter(
      (route) => !destinationExceptionList.includes(route.destinationTypeLabel)
    );
  }, [filteredBySystem, destinationExceptionList]);

  const destinationList: string[] = useMemo(() => {
    return _.chain(filteredBySystem)
      .map((route) => route.destinationTypeLabel)
      .filter((routeLabel) => !!routeLabel)
      .sortBy((route) => route.toLowerCase())
      .uniq()
      .value();
  }, [filteredBySystem]);

  return {
    isLoading:
      !routes && !destinationTypes && !routesError && !destinationTypesError,
    error: routesError || destinationTypesError,
    data: filteredByDestination,
    filters: {
      isSystemRoutes: showSystemRoutes,
      setSystemRoutes: setShowSystemRoutes,
      destinationList,
      destinationExceptionList,
      setDestinationExceptionList,
    },
  };
}
