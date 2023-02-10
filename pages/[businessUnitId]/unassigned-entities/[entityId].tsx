import { AxiosError } from 'axios';
import classNames from 'classnames';
import {
  EntryPoint as EntryPointIcon,
  Queue as QueueIcon,
} from 'components/icons';
import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import NavLink from 'components/navigation/NavLink/NavLink';
import UnassignedEntryPointsTable from 'features/pages/entry-points/components/UnassignedEntryPointsTable';
import { EntryPoint } from 'features/pages/entry-points/types';
import UnassignedQueuesTable from 'features/pages/queues/components/UnassignedQueuesTable';
import { Queue } from 'features/pages/queues/types';
import { entityFetcher } from 'lib/client/api-helper';
import { WaveError } from 'lib/client/types';
import { Dictionary } from 'lodash';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/page';
import { useContext } from 'react';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
import useSWR from 'swr';

const refreshInterval = 30000;

const UnassignedEntitiesHome: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { activeBusinessUnit } = useContext(BusinessUnitContext);

  const { data: entryPoints } = useSWR<
    Dictionary<EntryPoint>,
    AxiosError<WaveError>
  >(
    ['/entrypoints/?unassigned=true', activeBusinessUnit],
    entityFetcher('entry_point_id', 'entry_point'),
    { refreshInterval }
  );

  const { data: queues } = useSWR<Dictionary<Queue>, AxiosError<WaveError>>(
    ['/queues/?unassigned=true', activeBusinessUnit],
    entityFetcher('queue_id', 'queue_name'),
    { refreshInterval }
  );

  const links = [
    {
      name: 'Entry Points',
      href: `/${activeBusinessUnit?.id}/unassigned-entities/entry-points`,
      icon: EntryPointIcon,
      count: Object.values(entryPoints ?? []).length,
    },
    {
      name: 'Queues',
      href: `/${activeBusinessUnit?.id}/unassigned-entities/queues`,
      icon: QueueIcon,
      count: Object.values(queues ?? []).length,
    },
  ];

  return (
    <ContentLayout title="Unassigned Entities">
      <div className="w-full flex flex-col md:flex-row">
        <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
          <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <ul className="flex items-center sm:items-start sm:flex-col space-x-4 sm:space-x-0">
              {links.map((item) => (
                <li key={item.href} className="w-full">
                  <NavLink
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white group flex justify-between items-center px-2 py-2 text-base font-medium rounded-md"
                    activeClassName="bg-gray-900 text-white"
                  >
                    <div className="flex items-center mr-3 sm:mr0">
                      <item.icon
                        className="text-gray-400 dark:text-gray-300 group-hover:text-gray-200 mr-2 flex-shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                    <span
                      className={classNames(
                        'text-xs font-medium px-2.5 py-0.5 rounded border group-hover:scale-105 transition-transform',
                        {
                          'bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-blue-400 border-blue-400':
                            item.count === 0,
                          'bg-green-100 text-green-800 dark:bg-gray-700 dark:text-green-400 border-green-400':
                            item.count > 0,
                        }
                      )}
                    >
                      {item.count}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex-1 overflow-x-auto">
          <h4 className="sm:py-1 sm:px-8 text-lg font-semibold text-left text-gray-900 dark:text-white">
            {query.entityId === 'queues' ? 'Queues' : 'Entry Points'}
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              Data refreshed on a {refreshInterval / 1000} second interval.
            </p>
          </h4>
          {query.entityId === 'queues' ? (
            <UnassignedQueuesTable />
          ) : (
            <UnassignedEntryPointsTable />
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

export default UnassignedEntitiesHome;

UnassignedEntitiesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
