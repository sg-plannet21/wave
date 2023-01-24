import { Version } from 'lib/client/types';

interface PromptDetail {
  region: string;
  version: number;
  wording: string;
}

export interface Prompt {
  url: string;
  prompt_id: number;
  versions: number[];
  dependencies?: Version[];
  audio_file: string;
  prompt_name: string;
  prompt_detail: PromptDetail;
  business_unit: string;
  prompt_folder?: string;
}
