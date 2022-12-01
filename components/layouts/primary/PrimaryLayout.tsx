import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  BusinessUnit,
  Cross,
  Dialpad,
  EntryPoint,
  Exception,
  Menu as MenuIcon,
  Moon,
  Prompt,
  Queue,
  Route,
  Schedule,
  Section,
  Sun,
  UnassignedEntity,
  User,
  Users,
} from 'components/icons';
import BusinessUnitSelect from 'components/navigation/BusinessUnitSelect/BusinessUnitSelect';
import NavLink from 'components/navigation/NavLink/NavLink';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/router';
import logo from 'public/logo.svg';
import React from 'react';

const Logo = () => {
  return (
    <NavLink className="flex items-center text-white" href=".">
      <Image
        height="32px"
        width="32px"
        className="h-8 w-auto"
        src={logo}
        alt="Workflow"
      />
      <span className="text-xl text-white font-semibold">Wave</span>
    </NavLink>
  );
};

type MobileSidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { data } = useSession();
  const businessUnits = data?.user.business_unit_roles ?? [];
  return (
    <Transition.Root show={sidebarOpen} as={React.Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 flex z-40 md:hidden"
        open={sidebarOpen}
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={React.Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={React.Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
            <Transition.Child
              as={React.Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <Cross className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 flex items-center px-4">
              <Logo />
            </div>
            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 py-1 space-y-1">
                <BusinessUnitSelect businessUnits={businessUnits} />
                <SideNavigation />
              </nav>
            </div>
          </div>
        </Transition.Child>
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </Dialog>
    </Transition.Root>
  );
};

type SideNavigationItem = {
  name: string;
  href: string;
  icon: (_props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
};

const SideNavigation: React.FC = () => {
  const router = useRouter();
  const { businessUnitId } = router.query;
  const { data } = useSession();
  const businessUnits = data?.user.business_unit_roles ?? [];
  // TODO: check access & filter admin routes
  const sideNavigation = [
    {
      name: 'Unassigned Entities',
      href: `/${businessUnitId}/unassigned-entities`,
      icon: UnassignedEntity,
    },
    {
      name: 'Business Units',
      href: `/${businessUnitId}/business-units`,
      icon: BusinessUnit,
    },
    {
      name: 'Routes',
      href: `/${businessUnitId}/routes`,
      icon: Route,
    },
    {
      name: 'Users',
      href: `/${businessUnitId}/users`,
      icon: Users,
    },
    {
      name: 'Entry Points',
      href: `/${businessUnitId}/entry-points`,
      icon: EntryPoint,
    },
    {
      name: 'Menus',
      href: `/${businessUnitId}/menus`,
      icon: Dialpad,
    },
    {
      name: 'Queues',
      href: `/${businessUnitId}/queues`,
      icon: Queue,
    },
    {
      name: 'Messages',
      href: `/${businessUnitId}/messages`,
      icon: Prompt,
    },
    {
      name: 'Sections',
      href: `/${businessUnitId}/sections`,
      icon: Section,
    },
    {
      name: 'Schedules',
      href: `/${businessUnitId}/schedules`,
      icon: Schedule,
    },
    {
      name: 'Schedule Exceptions',
      href: `/${businessUnitId}/schedule-exceptions`,
      icon: Exception,
    },
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <>
      <BusinessUnitSelect businessUnits={businessUnits} />

      {sideNavigation.map((item) => (
        <NavLink
          key={item.name}
          href={item.href}
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

type IUserNavigationItem = {
  name: string;
  href: string;
  onClick?: () => void;
};

function logout() {
  console.log('logout()');
}

const UserNavigation: React.FC = () => {
  const userNavigation = [
    { name: 'Profile', href: '/about' },
    { name: 'Logout', href: '', onClick: logout },
  ].filter(Boolean) as IUserNavigationItem[];
  return (
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs bg-gray-200 p-2 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-600 dark:text-gray-300">
              <span className="sr-only">Open user menu</span>
              <User className="h-8 w-8 rounded-full" />
            </Menu.Button>
          </div>
          <Transition
            show={open}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-600 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <NavLink
                      onClick={item.onClick}
                      href={item.href}
                      className={`block px-4 py-2 text-sm text-gray-700 dark:text-white ${
                        active && 'bg-gray-100 dark:bg-cyan-600'
                      }`}
                      activeClassName="bg-indigo-100 dark:bg-cyan-500"
                    >
                      {item.name}
                    </NavLink>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export type PrimaryLayoutProps = {
  children: React.ReactNode;
};

const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { systemTheme, theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  function renderThemeChanger() {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDarkTheme = currentTheme === 'dark';
    return (
      <button
        id="theme-toggle"
        type="button"
        className="text-cyan-400 dark:text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
      >
        <Moon className={`${isDarkTheme ? 'hidden' : ''} w-6 h-6`} />
        <Sun className={`${isDarkTheme ? '' : 'hidden'} w-6 h-6`} />
      </button>
    );
  }

  return (
    <>
      <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-slate-700 dark:text-white">
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <Sidebar />
        <div className="w-0 flex-1 flex flex-col overflow-hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-end dark:bg-slate-800">
              <div className="ml-4 flex items-center md:ml-6">
                {renderThemeChanger()}
                <UserNavigation />
              </div>
            </div>
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
