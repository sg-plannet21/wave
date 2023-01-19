import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Section } from '../types';

type EditSectionDTO = {
  id: Section['section_id'];
  name: Section['section'];
};

export function editSection(
  data: EditSectionDTO
): Promise<AxiosResponse<Section, WaveError>> {
  return axios.patch(`/section/${data.id}/`, {
    section_id: data.id,
    section: data.name,
  });
}
