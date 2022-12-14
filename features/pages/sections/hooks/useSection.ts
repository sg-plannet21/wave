import useRequest, { Config } from 'state/hooks/useRequest';
import { Section } from '../types';

export const useSection = (sectionId?: string, config?: Config) => {
  return useRequest<Section, string>(
    sectionId ? { url: `/section/${sectionId}`, ...config } : null
  );
};
