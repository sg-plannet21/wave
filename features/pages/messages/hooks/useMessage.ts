import useRequest, { Config } from 'state/hooks/useRequest';
import { Prompt } from '../types';

export const useMessage = (messageId?: string, config?: Config) => {
  return useRequest<Prompt, string>(
    messageId ? { url: `/prompts/${messageId}`, ...config } : null
  );
};
