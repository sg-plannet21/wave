import Image from 'next/image';
import React from 'react';
import logo from '../../../public/logo.svg';
import NavLink from '../../buttons/NavLink/NavLink';
import { Menu, UnassignedEntity, Users } from '../../icons/';

const Logo = () => {
  return (
    <NavLink className="flex items-center text-white" href=".">
      <Image className="h-8 w-auto" src={logo} alt="Workflow" />
      <span className="text-xl text-white font-semibold">Wave</span>
    </NavLink>
  );
};

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (_props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

const SideNavigation: React.FC = () => {
  // TODO: check access & filter admin routes
  const sideNavigation = [
    {
      name: 'Unassigned Entities',
      to: '/unassigned-entities',
      icon: UnassignedEntity,
    },
    {
      name: 'Users',
      to: '/about',
      icon: Users,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      {sideNavigation.map((item) => (
        <NavLink
          key={item.name}
          href={item.to}
          className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md"
          activeClassName="bg-gray-900 text-white"
        >
          <item.icon
            className="text-gray-400 group-hover:text-gray-300 mr-4 flex-shrink-0 h-6 w-6"
            aria-hidden="true"
          />
          {item.name}
        </NavLink>
      ))}
    </>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <Logo />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
              <SideNavigation />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
  justify?: 'items-center' | 'items-start';
}

type PrimaryLayoutProps = {
  children: React.ReactNode;
};

const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar />
        <div className="w-0 flex-1 flex flex-col overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default PrimaryLayout;
