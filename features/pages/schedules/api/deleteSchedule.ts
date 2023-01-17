import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { DeleteResponse, WaveError } from 'lib/client/types';

export default function deleteSchedule(
  id: string
): Promise<AxiosResponse<DeleteResponse, WaveError>> {
  return axios.delete(`/schedules/${id}/`);
}
