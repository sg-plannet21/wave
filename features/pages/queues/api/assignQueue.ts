import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Queue } from '../types';

export default function assignQueue(
  queue: Queue
): Promise<AxiosResponse<Queue, WaveError>> {
  return axios.patch(`/queues/${queue.queue_id}/?unassigned=true`, queue);
}
