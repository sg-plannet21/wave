import classNames from 'classnames';
import Table from 'components/data-display/table/Table';
import { EntryPoint as EntryPointIcon, Queue } from 'components/icons';
import Button from 'components/inputs/button';
import ContentLayout from 'components/layouts/content/Content';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import assignEntryPoint from 'features/pages/entry-points/api/assignEntrypoint';
import { EntryPoint } from 'features/pages/entry-points/types';
import { useSession } from 'next-auth/react';
import getConfig from 'next/config';
import { NextPageWithLayout } from 'pages/page';
import { useContext, useMemo, useState } from 'react';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';

type EntityTableRecord = {
  id: string;
  name: string;
  businessUnit: string;
  onAssign: (id: string) => void;
};

const commonButtonClasses =
  'inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:focus:ring-gray-500 dark:focus:text-white';

const inactiveButtonClasses =
  'hover:bg-gray-100 hover:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white';

const activeButtonClasses =
  'bg-blue-700 border-gray-200 dark:bg-gray-800 dark:border-gray-600';

const commonBadgeClasses = 'text-xs font-medium px-2.5 py-0.5 rounded border';

const badgeDefaultClasses =
  'bg-blue-100 text-blue-800 dark:bg-gray-700 dark:text-blue-400 border-blue-400';

const badgeActiveClasses =
  'bg-green-100 text-green-800 dark:bg-gray-700 dark:text-green-400 border-green-400';

const {
  publicRuntimeConfig: { fallbackRegionId },
} = getConfig();

const UnassignedEntitiesHome: NextPageWithLayout = () => {
  const [entityType, setEntityType] = useState<'entryPoints' | 'queues'>(
    'entryPoints'
  );
  const { data: entryPoints, mutate: mutateEntryPoints } =
    useCollectionRequest<EntryPoint>('entrypoints_unassigned');
  const { data } = useSession();
  const { activeBusinessUnit } = useContext(BusinessUnitContext);
  const currentRegionId =
    data?.user.business_unit_roles.find(
      (bu) => bu.business_unit === activeBusinessUnit?.id
    )?.default_region ?? fallbackRegionId;

  const { addNotification } = useContext(NotificationContext);

  const isEntity = entityType === 'entryPoints';
  const isQueue = entityType === 'queues';

  const mappedEntryPoints: EntityTableRecord[] = useMemo(() => {
    if (!entryPoints || !activeBusinessUnit) return [];

    return Object.values(entryPoints).map((entryPoint) => ({
      id: entryPoint.entry_point_id,
      name: entryPoint.entry_point,
      businessUnit: activeBusinessUnit.name,
      onAssign: async (id: string) =>
        mutateEntryPoints(
          async (existingEntryPoints) => {
            addNotification({
              title: 'Assigned Entrypoint',
              message: `${entryPoint.entry_point} moved to ${activeBusinessUnit.name}`,
              type: 'success',
              duration: 3000,
            });
            await assignEntryPoint({
              ...entryPoints[id],
              region: currentRegionId,
            });

            if (existingEntryPoints && existingEntryPoints[id])
              delete existingEntryPoints[id];

            return { ...existingEntryPoints };
          },
          { revalidate: false }
        ),
    }));
  }, [entryPoints, activeBusinessUnit, mutateEntryPoints, addNotification]);

  return (
    <ContentLayout title="Unassigned Entities">
      <div className="w-full flex flex-col md:flex-row">
        <div className="sm:w-56 flex md:flex-col p-2 space-x-3 md:space-y-3 md:space-x-0">
          <div className="w-48 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <button
              onClick={() => setEntityType('entryPoints')}
              {...(isEntity && { 'aria-current': true })}
              type="button"
              className={classNames(
                commonButtonClasses,
                'border-b border-gray-200 rounded-t-lg',
                {
                  [activeButtonClasses]: isEntity,
                  [inactiveButtonClasses]: !isEntity,
                }
              )}
            >
              <div className="flex items-center">
                <EntryPointIcon className="w-4 h-4 mr-2 fill-current" />
                Entry Points
              </div>
              <span
                className={classNames(commonBadgeClasses, {
                  [badgeDefaultClasses]: mappedEntryPoints.length === 0,
                  [badgeActiveClasses]: mappedEntryPoints.length > 0,
                })}
              >
                {mappedEntryPoints.length}
              </span>
            </button>
            <button
              {...(entityType === 'queues' && { 'aria-current': true })}
              type="button"
              onClick={() => setEntityType('queues')}
              className={classNames(commonButtonClasses, 'rounded-b-lg', {
                [activeButtonClasses]: isQueue,
                [inactiveButtonClasses]: !isQueue,
              })}
            >
              <div className="flex items-center">
                <Queue className="w-4 h-4 mr-2 fill-current" />
                Queues
              </div>
              <span
                className={classNames(commonBadgeClasses, {
                  [badgeDefaultClasses]: false,
                  [badgeActiveClasses]: true,
                })}
              >
                3
              </span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-x-auto">
          <Table<EntityTableRecord>
            columns={[
              { field: 'name', label: 'Name' },
              { field: 'businessUnit', label: 'Destination Business Unit' },
              {
                field: 'id',
                label: '',
                Cell({ entry }) {
                  return (
                    <Button
                      className="ml-auto mr-0"
                      size="sm"
                      onClick={() => entry.onAssign(entry.id)}
                    >
                      Assign
                    </Button>
                  );
                },
              },
            ]}
            data={mappedEntryPoints}
          />
        </div>
      </div>
    </ContentLayout>
  );
};

export default UnassignedEntitiesHome;

UnassignedEntitiesHome.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
