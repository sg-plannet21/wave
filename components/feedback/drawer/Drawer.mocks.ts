import { DrawerProps } from './Drawer';

const base: DrawerProps = {
  isOpen: true,
  onClose: () => {},
  children: 'Content',
  renderFooter: () => 'Footer',
  title: 'Drawer Example',
};

export const mockDrawerProps = {
  base,
};
