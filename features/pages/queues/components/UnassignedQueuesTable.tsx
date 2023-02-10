import { AxiosError } from 'axios';
import UnassignedEntitiesTable, {
  EntityTableRecord,
} from 'features/pages/unassigned-entities/components/UnassignedEntitesTable';
import { entityFetcher } from 'lib/client/api-helper';
import { WaveError } from 'lib/client/types';
import { Dictionary } from 'lodash';
import { useContext, useMemo } from 'react';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';
import NotificationContext from 'state/notifications/NotificationContext';
import useSWR from 'swr';
import assignQueue from '../api/assignQueue';
import { Queue } from '../types';

const UnassignedQueuesTable: React.FC = () => {
  const { activeBusinessUnit } = useContext(BusinessUnitContext);

  const { data: queues, mutate } = useSWR<
    Dictionary<Queue>,
    AxiosError<WaveError>
  >(
    ['/queues/?unassigned=true', activeBusinessUnit],
    entityFetcher('queue_id', 'queue_name'),
    { revalidateOnFocus: false }
  );

  const { addNotification } = useContext(NotificationContext);

  const mappedQueues: EntityTableRecord[] = useMemo(() => {
    if (!queues || !activeBusinessUnit) return [];

    return Object.values(queues).map((queue) => ({
      id: queue.queue_id,
      name: queue.queue_name,
      businessUnit: activeBusinessUnit.name,
      onAssign: async (id: string) =>
        mutate(
          async (existingQueues) => {
            addNotification({
              title: 'Assigned Queue',
              message: `${queue.queue_name} moved to ${activeBusinessUnit.name}`,
              type: 'success',
              duration: 3000,
            });
            await assignQueue(queue);

            if (existingQueues && existingQueues[id]) delete existingQueues[id];

            return { ...existingQueues };
          },
          { revalidate: false }
        ),
    }));
  }, [queues, activeBusinessUnit, mutate, addNotification]);

  return <UnassignedEntitiesTable data={mappedQueues} />;
};

export default UnassignedQueuesTable;
