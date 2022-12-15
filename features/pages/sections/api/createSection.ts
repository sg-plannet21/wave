import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Section } from '../types';

type CreateSectionDTO = {
  name: Section['section'];
};

export function createSection(
  data: CreateSectionDTO
): Promise<AxiosResponse<Section>> {
  return axios.post('/section/', {
    section: data.name,
  });
}
