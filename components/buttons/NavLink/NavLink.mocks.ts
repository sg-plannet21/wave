import { INavLink } from './NavLink';

const base: INavLink = {
  href: '/',
  children: 'Home',
  className:
    'bg-indigo-500 text-white px-4 py-2 rounded hover:text-indigo-500 hover:bg-white border border-indigo-500',
};

export const mockNavLinkProps = {
  base,
};
