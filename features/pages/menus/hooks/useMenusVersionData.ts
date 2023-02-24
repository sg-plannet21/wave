import {
  DeserialiseEntityReturn,
  EntityMapping,
  FormattedToVersionTable,
} from 'features/entity-versions/types';
import { deserialiseEntity } from 'features/entity-versions/utilities/deserialiseEntity';
import { getVersionObjectValue } from 'features/entity-versions/utilities/formatObjectReference';
import { Prompt } from 'features/pages/messages/types';
import { Route } from 'features/pages/routes/types';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Menu } from '../types';
import { useMenu } from './useMenu';

const fields = [
  'opt0',
  'opt1',
  'opt2',
  'opt3',
  'opt4',
  'opt5',
  'opt6',
  'opt7',
  'opt8',
  'opt9',
  'no_input',
  'no_match',
  'asterisk',
  'hash',
];

export default function useMenusVersionData(menuId: string) {
  const { data: menu, error: menuError } = useMenu(`${menuId}?versions=true`);

  const { data: routes, error: routesError } =
    useCollectionRequest<Route>('routes');

  const { data: messages, error: messagesError } =
    useCollectionRequest<Prompt>('prompts');

  const deserialisedMenu: Array<DeserialiseEntityReturn<Menu>> = useMemo(() => {
    if (!menu) return [];

    return deserialiseEntity<Menu>(menu.versions);
  }, [menu]);

  const formattedMenus: FormattedToVersionTable<Menu>[] = useMemo(() => {
    if (!routes || !messages) return [];

    return deserialisedMenu.map((menu) => {
      return {
        ...menu,
        route: getVersionObjectValue(
          messages,
          menu.menu_message,
          'prompt_name'
        ),
        ...fields.reduce((lookup, field) => {
          // message
          lookup[`${field}_message` as keyof DeserialiseEntityReturn<Menu>] =
            getVersionObjectValue(
              messages,
              menu[
                `${field}_message` as keyof DeserialiseEntityReturn<Menu>
              ] as keyof Menu,
              'prompt_name'
            );
          // route
          lookup[`${field}_route` as keyof DeserialiseEntityReturn<Menu>] =
            getVersionObjectValue(
              routes,
              menu[
                `${field}_route` as keyof DeserialiseEntityReturn<Menu>
              ] as keyof Menu,
              'route_name'
            );
          return lookup;
        }, {} as Partial<DeserialiseEntityReturn<Menu>>),
      };
    });
  }, [deserialisedMenu, routes, messages]);

  const mappings: EntityMapping<Menu>[] = useMemo(() => {
    if (!menu) return [];

    const mappings: EntityMapping<Menu>[] = [
      { key: 'changeDate', label: 'Change Date' },
      { key: 'changeUser', label: 'Change User' },
      { key: 'menu_name', label: 'Name' },
      { key: 'max_retries', label: 'Max Retries' },
      { key: 'opt1_message', label: 'Opt 1 Message' },
      { key: 'opt1_route', label: 'Opt 1 Route' },
      { key: 'opt2_message', label: 'Opt 2 Message' },
      { key: 'opt2_route', label: 'Opt 2 Route' },
      { key: 'opt3_message', label: 'Opt 3 Message' },
      { key: 'opt3_route', label: 'Opt 3 Route' },
      { key: 'opt4_message', label: 'Opt 4 Message' },
      { key: 'opt4_route', label: 'Opt 4 Route' },
      { key: 'opt5_message', label: 'Opt 5 Message' },
      { key: 'opt5_route', label: 'Opt 5 Route' },
      { key: 'opt6_message', label: 'Opt 6 Message' },
      { key: 'opt6_route', label: 'Opt 6 Route' },
      { key: 'opt7_message', label: 'Opt 7 Message' },
      { key: 'opt7_route', label: 'Opt 7 Route' },
      { key: 'opt8_message', label: 'Opt 8 Message' },
      { key: 'opt8_route', label: 'Opt 8 Route' },
      { key: 'opt9_message', label: 'Opt 9 Message' },
      { key: 'opt9_route', label: 'Opt 9 Route' },
      { key: 'opt0_message', label: 'Opt 0 Message' },
      { key: 'opt0_route', label: 'Opt 0 Route' },
      { key: 'no_match_message', label: 'No Match Message' },
      { key: 'no_match_route', label: 'No Match Route' },
      { key: 'no_input_message', label: 'No Input Message' },
      { key: 'no_input_route', label: 'No Input Route' },
    ];

    return mappings;
  }, [menu]);

  return {
    error: menuError || routesError || messagesError,
    isLoading:
      !menu &&
      !routes &&
      !messages &&
      !menuError &&
      !routesError &&
      !messagesError,
    data: formattedMenus,
    mappings,
    label: `${
      formattedMenus.length && `${formattedMenus[0].menu_name} `
    }Exception Versions`,
  };
}
