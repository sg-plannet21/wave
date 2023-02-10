import UnassignedEntitiesTable, {
  EntityTableRecord,
} from 'features/pages/unassigned-entities/components/UnassignedEntitesTable';
import { useSession } from 'next-auth/react';
import getConfig from 'next/config';
import { useContext, useMemo } from 'react';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import assignEntryPoint from '../api/assignEntrypoint';
import { EntryPoint } from '../types';

const {
  publicRuntimeConfig: { fallbackRegionId },
} = getConfig();

const UnassignedEntryPointsTable: React.FC = () => {
  const { data: entryPoints, mutate: mutateEntryPoints } =
    useCollectionRequest<EntryPoint>('entrypoints_unassigned');
  const { data } = useSession();
  const { activeBusinessUnit } = useContext(BusinessUnitContext);
  const currentRegionId =
    data?.user.business_unit_roles.find(
      (bu) => bu.business_unit === activeBusinessUnit?.id
    )?.default_region ?? fallbackRegionId;

  const { addNotification } = useContext(NotificationContext);

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
  }, [
    entryPoints,
    activeBusinessUnit,
    mutateEntryPoints,
    addNotification,
    currentRegionId,
  ]);

  return <UnassignedEntitiesTable data={mappedEntryPoints} />;
};

export default UnassignedEntryPointsTable;
