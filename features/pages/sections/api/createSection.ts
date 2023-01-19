import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Section } from '../types';

type CreateSectionDTO = {
  name: Section['section'];
};

export function createSection(
  data: CreateSectionDTO
): Promise<AxiosResponse<Section, WaveError>> {
  return axios.post('/section/', {
    section: data.name,
  });
}
