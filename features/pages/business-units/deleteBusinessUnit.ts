import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { DeleteResponse, WaveError } from 'lib/client/types';

export default function deleteBusinessUnit(
  id: string
): Promise<AxiosResponse<DeleteResponse, WaveError>> {
  return axios.delete(`/businessunits/${id}/`);
}
