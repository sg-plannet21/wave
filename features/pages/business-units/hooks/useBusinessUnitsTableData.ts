import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { BusinessUnit } from '../types';

export type BusinessUnitTableRecord = {
  id: string;
  name: string;
};

export function useBusinessUnitsTableData() {
  const { data: businessUnits, error: businessUnitsError } =
    useCollectionRequest<BusinessUnit>('businessUnits');

  const data: BusinessUnitTableRecord[] = useMemo(() => {
    if (!businessUnits) return [];

    return Object.values(businessUnits).map((businessUnit) => ({
      id: businessUnit.business_unit_id,
      name: businessUnit.business_unit,
    }));
  }, [businessUnits]);

  return {
    isLoading: !businessUnits && !businessUnitsError,
    error: businessUnitsError,
    data,
  };
}
