import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Prompt } from '../types';

type EditMessageDTO = {
  id: Prompt['prompt_id'];
  name: Prompt['prompt_name'];
  detail: Prompt['prompt_detail'];
};

export function editMessage(
  data: EditMessageDTO
): Promise<AxiosResponse<Prompt, WaveError>> {
  return axios.patch(`/prompts/${data.id}/`, {
    prompt_id: data.id,
    prompt_name: data.name,
    prompt_detail: data.detail,
  });
}
