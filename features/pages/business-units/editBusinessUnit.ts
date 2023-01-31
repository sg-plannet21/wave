import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { WaveError } from 'lib/client/types';
import { BusinessUnit } from './types';

type EditBusinessUnitDTO = {
  id: BusinessUnit['business_unit_id'];
  name: BusinessUnit['business_unit'];
  regionId: BusinessUnit['default_region'];
};

export function editBusinessUnit(
  data: EditBusinessUnitDTO
): Promise<AxiosResponse<BusinessUnit, WaveError>> {
  return axios.patch(`/businessunits/${data.id}/`, {
    business_unit_id: data.id,
    business_unit: data.name,
    default_region: data.regionId,
  });
}
