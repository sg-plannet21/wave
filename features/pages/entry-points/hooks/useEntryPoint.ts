import useRequest, { Config } from 'state/hooks/useRequest';
import { EntryPoint } from '../types';

export const useEntryPoint = (entryPointId?: string, config?: Config) => {
  return useRequest<EntryPoint, string>(
    entryPointId ? { url: `/entrypoints/${entryPointId}`, ...config } : null
  );
};
