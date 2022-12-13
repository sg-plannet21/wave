import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Route } from '../types';

type EditRouteDTO = {
  id: Route['route_id'];
  name: Route['route_name'];
  destination: Route['destination'];
  destinationType: Route['destination_type'];
};

export function editRoute(data: EditRouteDTO): Promise<AxiosResponse<Route>> {
  return axios.patch(`/routes/${data.id}/`, {
    route_id: data.id,
    route_name: data.name,
    destination: data.destination,
    destination_type: data.destinationType,
  });
}
