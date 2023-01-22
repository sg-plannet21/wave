import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { Prompt } from '../types';

export interface UploadMessageDTO {
  name: string;
  file: File;
  region: number;
  businessUnit: string;
}

export function uploadMessage(
  payload: UploadMessageDTO
): Promise<AxiosResponse<Prompt, WaveError>> {
  const formData = new FormData();
  formData.append('audio_file', payload.file);

  formData.append(
    'prompt_detail',
    JSON.stringify({
      region: `${payload.region}`,
      version: 1,
      wording: '',
    })
  );

  formData.append('prompt_name', payload.name.trim());
  formData.append('business_unit', payload.businessUnit);
  formData.append('prompt_folder', '');

  return axios.post('/prompts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
