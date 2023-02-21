import { Route } from 'features/pages/routes/types';
import _ from 'lodash';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Menu } from '../types';

export type MenusTableRecord = {
  id: string;
  name: string;
  retries: number;
  noInputRoute: string | null;
  noMatchRoute: string | null;
  option0Route: string | null;
  option1Route: string | null;
  option2Route: string | null;
  option3Route: string | null;
  option4Route: string | null;
  option5Route: string | null;
  option6Route: string | null;
  option7Route: string | null;
  option8Route: string | null;
  option9Route: string | null;
  asteriskRoute: string | null;
  hashRoute: string | null;
};

function mapRouteToOption(
  routes: _.Dictionary<Route>,
  route: keyof _.Dictionary<Route> | null
): string | null {
  if (!route) return null;

  return _.get(routes[route], 'route_name');
}

export function useMenusTableData() {
  const { data: menus, error: menusError } =
    useCollectionRequest<Menu>('menus');

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  const data: MenusTableRecord[] = useMemo(() => {
    if (!menus || !routes) return [];

    return Object.values(menus).map((menu) => ({
      id: menu.menu_id,
      name: menu.menu_name,
      retries: menu.max_retries,
      noInputRoute: mapRouteToOption(routes, menu.no_input_route),
      noMatchRoute: mapRouteToOption(routes, menu.no_match_route),
      option0Route: mapRouteToOption(routes, menu.opt0_route),
      option1Route: mapRouteToOption(routes, menu.opt1_route),
      option2Route: mapRouteToOption(routes, menu.opt2_route),
      option3Route: mapRouteToOption(routes, menu.opt3_route),
      option4Route: mapRouteToOption(routes, menu.opt4_route),
      option5Route: mapRouteToOption(routes, menu.opt5_route),
      option6Route: mapRouteToOption(routes, menu.opt6_route),
      option7Route: mapRouteToOption(routes, menu.opt7_route),
      option8Route: mapRouteToOption(routes, menu.opt8_route),
      option9Route: mapRouteToOption(routes, menu.opt9_route),
      asteriskRoute: mapRouteToOption(routes, menu.asterisk_route),
      hashRoute: mapRouteToOption(routes, menu.hash_route),
    }));
  }, [menus, routes]);

  return {
    isLoading: !menus && !routes && !menusError && !routesError,
    error: menusError || routesError,
    data,
  };
}
