import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { EntryPoint } from '../types';

export const useEntryPoint = (
  entryPointId?: string,
  config?: Config<EntryPoint, WaveError>
) => {
  return useRequest<EntryPoint, WaveError>(
    entryPointId ? { url: `/entrypoints/${entryPointId}` } : null,
    config
  );
};
