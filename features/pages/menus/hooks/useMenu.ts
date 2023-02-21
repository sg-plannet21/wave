import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { Menu } from '../types';

export const useMenu = (menuId?: string, config?: Config<Menu, WaveError>) => {
  return useRequest<Menu, WaveError>(
    menuId ? { url: `/menus/${menuId}` } : null,
    config
  );
};
