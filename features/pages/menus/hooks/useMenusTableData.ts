import { Route } from 'features/pages/routes/types';
import _ from 'lodash';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Menu } from '../types';

type ActiveOptionType = { label: string; route: string | null };

export type MenuOptions = {
  noInput: ActiveOptionType;
  noMatch: ActiveOptionType;
  option0: ActiveOptionType;
  option1: ActiveOptionType;
  option2: ActiveOptionType;
  option3: ActiveOptionType;
  option4: ActiveOptionType;
  option5: ActiveOptionType;
  option6: ActiveOptionType;
  option7: ActiveOptionType;
  option8: ActiveOptionType;
  option9: ActiveOptionType;
  asterisk: ActiveOptionType;
  hash: ActiveOptionType;
};

export type MenusTableRecord = MenuOptions & {
  id: string;
  name: string;
  retries: number;
};

function mapRouteToOption(
  routes: _.Dictionary<Route>,
  route: keyof _.Dictionary<Route> | null,
  label: string
): ActiveOptionType {
  if (!route)
    return {
      route: null,
      label,
    };

  return { route: _.get(routes[route], 'route_name'), label };
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
      noInput: mapRouteToOption(routes, menu.no_input_route, 'NI'),
      noMatch: mapRouteToOption(routes, menu.no_match_route, 'NM'),
      option0: mapRouteToOption(routes, menu.opt0_route, '1'),
      option1: mapRouteToOption(routes, menu.opt1_route, '2'),
      option2: mapRouteToOption(routes, menu.opt2_route, '3'),
      option3: mapRouteToOption(routes, menu.opt3_route, '4'),
      option4: mapRouteToOption(routes, menu.opt4_route, '5'),
      option5: mapRouteToOption(routes, menu.opt5_route, '6'),
      option6: mapRouteToOption(routes, menu.opt6_route, '7'),
      option7: mapRouteToOption(routes, menu.opt7_route, '8'),
      option8: mapRouteToOption(routes, menu.opt8_route, '9'),
      option9: mapRouteToOption(routes, menu.opt9_route, '0'),
      asterisk: mapRouteToOption(routes, menu.asterisk_route, '*'),
      hash: mapRouteToOption(routes, menu.hash_route, '#'),
    }));
  }, [menus, routes]);

  return {
    isLoading: !menus && !routes && !menusError && !routesError,
    error: menusError || routesError,
    data,
  };
}
