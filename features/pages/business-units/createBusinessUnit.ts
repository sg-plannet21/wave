import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { BusinessUnit } from './types';

type CreateBusinessUnitDTO = {
  name: BusinessUnit['business_unit'];
  regionId: BusinessUnit['default_region'];
};

export function createBusinessUnit(
  data: CreateBusinessUnitDTO
): Promise<AxiosResponse<BusinessUnit, WaveError>> {
  return axios.post('/businessunits/', {
    business_unit: data.name,
    default_region: data.regionId,
  });
}
