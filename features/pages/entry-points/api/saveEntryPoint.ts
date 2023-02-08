import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { EntryPoint } from '../types';

type EntryPointDto = {
  id: string;
  section: string;
  region: number;
};

export function saveEntryPoint(
  data: EntryPointDto
): Promise<AxiosResponse<EntryPoint>> {
  return axios.patch(`/routes/${data.id}/`, data);
}
