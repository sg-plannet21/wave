import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { BusinessUnit } from '../types';

export const useBusinessUnit = (businessUnitId?: string, config?: Config) => {
  return useRequest<BusinessUnit, WaveError>(
    businessUnitId
      ? { url: `/businessunits/${businessUnitId}`, ...config }
      : null
  );
};
