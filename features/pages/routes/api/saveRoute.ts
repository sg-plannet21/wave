import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Route } from '../types';

type NewRoute = {
  name: Route['route_name'];
  destination: Route['destination'];
  destinationType: Route['destination_type'];
};

type ExistingRoute = NewRoute & {
  id: Route['route_id'];
};

function isExistingRoute(
  route: NewRoute | ExistingRoute
): route is ExistingRoute {
  return 'id' in route;
}

function mapRouteToDto(route: NewRoute | ExistingRoute): Partial<Route> {
  return {
    ...(isExistingRoute(route) && { route_id: route.id }),
    route_name: route.name,
    destination: route.destination,
    destination_type: route.destinationType,
  };
}

export function saveRoute(
  data: NewRoute | ExistingRoute
): Promise<AxiosResponse<Route>> {
  const payload = mapRouteToDto(data);
  if (isExistingRoute(data)) {
    return axios.patch(`/routes/${data.id}/`, payload);
  } else {
    return axios.post('/routes/', payload);
  }
}
