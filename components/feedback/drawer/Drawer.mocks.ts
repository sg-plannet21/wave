import { DrawerProps } from './Drawer';

const base: DrawerProps = {
  isOpen: true,
  onClose: () => {
    console.log('close');
  },
  children: 'Content',
  renderFooter: () => 'Footer',
  title: 'Drawer Example',
};

export const mockDrawerProps = {
  base,
};
