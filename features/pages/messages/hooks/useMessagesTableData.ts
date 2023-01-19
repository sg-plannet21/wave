import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Prompt } from '../types';

export type MessagessTableRecord = {
  id: Prompt['prompt_id'];
  name: Prompt['prompt_name'];
  audioFile: Prompt['audio_file'];
};

export function useMessagesTableData() {
  const { data: prompts, error: promptsError } =
    useCollectionRequest<Prompt>('prompts');

  const data: MessagessTableRecord[] = useMemo(() => {
    if (!prompts) return [];

    return Object.values(prompts).map((prompt) => ({
      id: prompt.prompt_id,
      name: prompt.prompt_name,
      audioFile: prompt.audio_file,
    }));
  }, [prompts]);

  return {
    isLoading: !prompts && !promptsError,
    error: promptsError,
    data,
  };
}
