import { axios } from 'lib/client/axios';
import { Route } from '../types';

type CreateRouteDTO = {
  name: Route['route_name'];
  destination: Route['destination'];
  destinationType: Route['destination_type'];
};

export function createRoute(data: CreateRouteDTO): Promise<Route> {
  return axios.post('/routes/', {
    route_name: data.name,
    destination: data.destination,
    destination_type: data.destinationType,
  });
}
