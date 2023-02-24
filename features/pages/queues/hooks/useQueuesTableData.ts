import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Queue } from '../types';

export type QueuesTableRecord = {
  id: string;
  name: string;
};

export function useQueuesTableData() {
  const { data: queues, error: queuesError } =
    useCollectionRequest<Queue>('queues');

  const data: QueuesTableRecord[] = useMemo(() => {
    if (!queues) return [];

    return Object.values(queues).map((queue) => ({
      id: queue.queue_id,
      name: queue.queue_name,
    }));
  }, [queues]);

  return {
    isLoading: !queues && !queuesError,
    error: queuesError,
    data,
  };
}
