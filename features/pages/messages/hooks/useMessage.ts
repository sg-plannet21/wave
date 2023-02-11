import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { Prompt } from '../types';

export const useMessage = (
  messageId?: string,
  config?: Config<Prompt, WaveError>
) => {
  return useRequest<Prompt, WaveError>(
    messageId ? { url: `/prompts/${messageId}` } : null,
    config
  );
};
