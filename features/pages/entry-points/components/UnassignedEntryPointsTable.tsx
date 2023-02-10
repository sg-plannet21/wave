import { AxiosError } from 'axios';
import UnassignedEntitiesTable, {
  EntityTableRecord,
} from 'features/pages/unassigned-entities/components/UnassignedEntitesTable';
import { entityFetcher } from 'lib/client/api-helper';
import { WaveError } from 'lib/client/types';
import { Dictionary } from 'lodash';
import { useSession } from 'next-auth/react';
import getConfig from 'next/config';
import { useContext, useMemo } from 'react';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
import NotificationContext from 'state/notifications/NotificationContext';
import useSWR from 'swr';
import assignEntryPoint from '../api/assignEntrypoint';
import { EntryPoint } from '../types';

const {
  publicRuntimeConfig: { fallbackRegionId },
} = getConfig();

const UnassignedEntryPointsTable: React.FC = () => {
  const { data } = useSession();
  const { activeBusinessUnit } = useContext(BusinessUnitContext);
  const currentRegionId =
    data?.user.business_unit_roles.find(
      (bu) => bu.business_unit === activeBusinessUnit?.id
    )?.default_region ?? fallbackRegionId;

  const { data: entryPoints, mutate } = useSWR<
    Dictionary<EntryPoint>,
    AxiosError<WaveError>
  >(
    ['/entrypoints/?unassigned=true', activeBusinessUnit],
    entityFetcher('entry_point_id', 'entry_point'),
    { revalidateOnFocus: false }
  );

  const { addNotification } = useContext(NotificationContext);

  const mappedEntryPoints: EntityTableRecord[] = useMemo(() => {
    if (!entryPoints || !activeBusinessUnit) return [];

    return Object.values(entryPoints).map((entryPoint) => ({
      id: entryPoint.entry_point_id,
      name: entryPoint.entry_point,
      businessUnit: activeBusinessUnit.name,
      onAssign: async (id: string) =>
        mutate(
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
    mutate,
    addNotification,
    currentRegionId,
  ]);

  return <UnassignedEntitiesTable data={mappedEntryPoints} />;
};

export default UnassignedEntryPointsTable;
