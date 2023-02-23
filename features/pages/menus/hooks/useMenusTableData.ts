import { Route } from 'features/pages/routes/types';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Menu } from '../types';

type FieldList = Array<{ value: keyof MenuOptions; label: string }>;

export const fieldList: FieldList = [
  { value: 'noInput', label: 'No Input' },
  { value: 'noMatch', label: 'No Match' },
  { value: 'option0', label: 'Option 0' },
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
  { value: 'option6', label: 'Option 6' },
  { value: 'option7', label: 'Option 7' },
  { value: 'option8', label: 'Option 8' },
  { value: 'option9', label: 'Option 9' },
  { value: 'asterisk', label: 'Option *' },
  { value: 'hash', label: 'Option #' },
];

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
  const [optionExceptionList, setOptionExceptionList] = useState<string[]>([]);

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
      option1: mapRouteToOption(routes, menu.opt1_route, '1'),
      option2: mapRouteToOption(routes, menu.opt2_route, '2'),
      option3: mapRouteToOption(routes, menu.opt3_route, '3'),
      option4: mapRouteToOption(routes, menu.opt4_route, '4'),
      option5: mapRouteToOption(routes, menu.opt5_route, '5'),
      option6: mapRouteToOption(routes, menu.opt6_route, '6'),
      option7: mapRouteToOption(routes, menu.opt7_route, '7'),
      option8: mapRouteToOption(routes, menu.opt8_route, '8'),
      option9: mapRouteToOption(routes, menu.opt9_route, '9'),
      option0: mapRouteToOption(routes, menu.opt0_route, '0'),
      asterisk: mapRouteToOption(routes, menu.asterisk_route, '*'),
      hash: mapRouteToOption(routes, menu.hash_route, '#'),
    }));
  }, [menus, routes]);

  const filtered: MenusTableRecord[] = useMemo(
    () =>
      data.filter(
        (menu) =>
          optionExceptionList.findIndex(
            (exception) => menu[exception as keyof MenuOptions].route
          ) === -1
      ),
    [data, optionExceptionList]
  );

  return {
    isLoading: !menus && !routes && !menusError && !routesError,
    error: menusError || routesError,
    data: filtered,
    filters: {
      optionList: fieldList.filter(
        (field) => field.value !== 'noInput' && field.value !== 'noMatch'
      ),
      optionExceptionList,
      setOptionExceptionList,
    },
  };
}
