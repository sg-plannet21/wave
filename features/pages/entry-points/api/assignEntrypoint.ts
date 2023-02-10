import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { EntryPoint } from '../types';

export default function assignEntryPoint(
  entryPoint: EntryPoint
): Promise<AxiosResponse<EntryPoint, WaveError>> {
  return axios.patch(
    `/entrypoints/${entryPoint.entry_point_id}/?unassigned=true`,
    entryPoint
  );
}
