import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { Queue } from '../types';

export const useQueue = (
  queueId?: string,
  config?: Config<Queue, WaveError>
) => {
  return useRequest<Queue, WaveError>(
    queueId ? { url: `/queues/${queueId}` } : null,
    config
  );
};
