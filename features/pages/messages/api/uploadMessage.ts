import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Prompt } from '../types';

export function uploadMessage(): Promise<AxiosResponse<Prompt>> {
  return axios.post('/prompts/');
}
