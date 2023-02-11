import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { EntryPoint } from '../types';

type EntryPointDto = {
  id: string;
  name: string;
  section: string;
  region: number;
};

export function saveEntryPoint(
  data: EntryPointDto
): Promise<AxiosResponse<EntryPoint>> {
  return axios.patch(`/entrypoints/${data.id}/`, {
    entry_point_id: data.id,
    entry_point: data.name,
    region: data.region,
    section: data.section,
  });
}
