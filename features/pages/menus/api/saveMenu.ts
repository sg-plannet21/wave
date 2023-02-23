import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Menu } from '../types';

type NewMenuDto = {
  name: Menu['menu_name'];
  maxRetries: Menu['max_retries'];
  menuMessage: string;
  option0Message: string;
  option0Route: Menu['opt0_route'];
  option1Message: string;
  option1Route: Menu['opt1_route'];
  option2Message: string;
  option2Route: Menu['opt2_route'];
  option3Message: string;
  option3Route: Menu['opt3_route'];
  option4Message: string;
  option4Route: Menu['opt4_route'];
  option5Message: string;
  option5Route: Menu['opt5_route'];
  option6Message: string;
  option6Route: Menu['opt6_route'];
  option7Message: string;
  option7Route: Menu['opt7_route'];
  option8Message: string;
  option8Route: Menu['opt8_route'];
  option9Message: string;
  option9Route: Menu['opt9_route'];
  noInputMessage: string;
  noInputRoute: Menu['no_input_route'];
  noMatchMessage: string;
  noMatchRoute: Menu['no_match_route'];
  asteriskMessage: string;
  asteriskRoute: Menu['asterisk_route'];
  hashMessage: string;
  hashRoute: Menu['hash_route'];
};

type ExistingMenuDto = NewMenuDto & {
  id: Menu['menu_id'];
};

function isExistingMenu(
  data: NewMenuDto | ExistingMenuDto
): data is ExistingMenuDto {
  return 'id' in data;
}

function mapMessageToDto(message: string): number | null {
  return message ? parseInt(message) : null;
}

// function mapRouteToDto(route?: string): string | null {
//   return route ? route : null;
// }

function mapMenuToDto(data: NewMenuDto | ExistingMenuDto): Partial<Menu> {
  return {
    ...(isExistingMenu(data) && { menu_id: data.id }),
    menu_name: data.name,
    max_retries: data.maxRetries,
    menu_message: parseInt(data.menuMessage),
    opt0_message: mapMessageToDto(data.option0Message),
    opt0_route: data.option0Route,
    opt1_message: mapMessageToDto(data.option1Message),
    opt1_route: data.option1Route,
    opt2_message: mapMessageToDto(data.option2Message),
    opt2_route: data.option2Route,
    opt3_message: mapMessageToDto(data.option3Message),
    opt3_route: data.option3Route,
    opt4_message: mapMessageToDto(data.option4Message),
    opt4_route: data.option4Route,
    opt5_message: mapMessageToDto(data.option5Message),
    opt5_route: data.option5Route,
    opt6_message: mapMessageToDto(data.option6Message),
    opt6_route: data.option6Route,
    opt7_message: mapMessageToDto(data.option7Message),
    opt7_route: data.option7Route,
    opt8_message: mapMessageToDto(data.option8Message),
    opt8_route: data.option8Route,
    opt9_message: mapMessageToDto(data.option9Message),
    opt9_route: data.option9Route,
    no_input_message: mapMessageToDto(data.noInputMessage),
    no_input_route: data.noInputRoute,
    no_match_message: mapMessageToDto(data.noMatchMessage),
    no_match_route: data.noMatchRoute,
    asterisk_message: mapMessageToDto(data.asteriskMessage),
    asterisk_route: data.asteriskRoute,
    hash_message: mapMessageToDto(data.hashMessage),
    hash_route: data.hashRoute,
  };
}

export function saveMenu(
  data: NewMenuDto | ExistingMenuDto
): Promise<AxiosResponse<Menu, WaveError>> {
  const payload = mapMenuToDto(data);
  if (isExistingMenu(data)) return axios.patch(`/menus/${data.id}/`, payload);

  return axios.post('/menus/', payload);
}
