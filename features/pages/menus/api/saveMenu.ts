import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Menu } from '../types';

type NewMenuDto = {
  name: Menu['menu_name'];
  maxRetries: Menu['max_retries'];
  menuMessage: Menu['menu_message'];
  opt0Message?: string;
  opt0Route?: string;
  opt1Message?: string;
  opt1Route?: string;
  opt2Message?: string;
  opt2Route?: string;
  opt3Message?: string;
  opt3Route?: string;
  opt4Message?: string;
  opt4Route?: string;
  opt5Message?: string;
  opt5Route?: string;
  opt6Message?: string;
  opt6Route?: string;
  opt7Message?: string;
  opt7Route?: string;
  opt8Message?: string;
  opt8Route?: string;
  opt9Message?: string;
  opt9Route?: string;
  noInputMessage?: string;
  noInputRoute?: string;
  noMatchMessage?: string;
  noMatchRoute?: string;
  asteriskMessage?: string;
  asteriskRoute?: string;
  hashMessage?: string;
  hashRoute?: string;
};

type ExistingMenuDto = NewMenuDto & {
  id: Menu['menu_id'];
};

function isExistingMenu(
  data: NewMenuDto | ExistingMenuDto
): data is ExistingMenuDto {
  return 'id' in data;
}

function mapMessageToDto(message?: string): number | null {
  return message ? parseInt(message) : null;
}

function mapRouteToDto(route?: string): string | null {
  return route ? route : null;
}

function mapMenuToDto(data: NewMenuDto | ExistingMenuDto): Partial<Menu> {
  return {
    ...(isExistingMenu(data) && { menu_id: data.id }),
    menu_name: data.name,
    max_retries: data.maxRetries,
    menu_message: data.menuMessage,
    opt0_message: mapMessageToDto(data.opt0Message),
    opt0_route: mapRouteToDto(data.opt0Route),
    opt1_message: mapMessageToDto(data.opt1Message),
    opt1_route: mapRouteToDto(data.opt1Route),
    opt2_message: mapMessageToDto(data.opt2Message),
    opt2_route: mapRouteToDto(data.opt2Route),
    opt3_message: mapMessageToDto(data.opt3Message),
    opt3_route: mapRouteToDto(data.opt3Route),
    opt4_message: mapMessageToDto(data.opt4Message),
    opt4_route: mapRouteToDto(data.opt4Route),
    opt5_message: mapMessageToDto(data.opt5Message),
    opt5_route: mapRouteToDto(data.opt5Route),
    opt6_message: mapMessageToDto(data.opt6Message),
    opt6_route: mapRouteToDto(data.opt6Route),
    opt7_message: mapMessageToDto(data.opt7Message),
    opt7_route: mapRouteToDto(data.opt7Route),
    opt8_message: mapMessageToDto(data.opt8Message),
    opt8_route: mapRouteToDto(data.opt8Route),
    opt9_message: mapMessageToDto(data.opt9Message),
    opt9_route: mapRouteToDto(data.opt9Route),
    no_input_message: mapMessageToDto(data.noInputMessage),
    no_input_route: mapRouteToDto(data.noInputRoute),
    no_match_message: mapMessageToDto(data.noMatchMessage),
    no_match_route: mapRouteToDto(data.noMatchRoute),
    asterisk_message: mapMessageToDto(data.asteriskMessage),
    asterisk_route: mapRouteToDto(data.asteriskRoute),
    hash_message: mapMessageToDto(data.hashMessage),
    hash_route: mapRouteToDto(data.hashRoute),
  };
}

export function saveMenu(
  data: NewMenuDto | ExistingMenuDto
): Promise<AxiosResponse<Menu, WaveError>> {
  const payload = mapMenuToDto(data);
  if (isExistingMenu(data)) return axios.patch(`/menus/${data.id}/`, payload);

  return axios.post('/menus/', payload);
}
