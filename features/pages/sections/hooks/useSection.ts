import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { Section } from '../types';

export const useSection = (
  sectionId?: string,
  config?: Config<Section, WaveError>
) => {
  return useRequest<Section, WaveError>(
    sectionId ? { url: `/section/${sectionId}` } : null,
    config
  );
};
