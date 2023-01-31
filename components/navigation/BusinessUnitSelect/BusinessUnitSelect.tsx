import { BusinessUnit } from 'components/icons';
import Select, { SelectOption } from 'components/inputs/select';

import storage from 'lib/client/storage';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useMemo } from 'react';
import { User } from 'state/auth/types';
import BusinessUnitContext from 'state/business-units/BusinessUnitContext';

type BusinessUnitSelectProps = {
  businessUnits: User['business_unit_roles'];
};

const BusinessUnitSelect: React.FC<BusinessUnitSelectProps> = ({
  businessUnits = [],
}) => {
  const router = useRouter();
  const { activeBusinessUnit, setActiveBusinessUnit } =
    useContext(BusinessUnitContext);

  const handleChange = useCallback(
    ({ label, value }: SelectOption) => {
      storage.setBusinessUnit(value.toString());
      setActiveBusinessUnit({
        id: value.toString(),
        name: label?.toString() as string,
      });

      // filter the businessUnitId dynamic route and path up to proceeding '/'
      // const regex = /\/\[businessUnitId\]\/.*\//;
      const regex = /\/\[businessUnitId\]\/[a-zA-Z-]*/;
      const resultsArray = regex.exec(router.pathname);
      const pathname = resultsArray?.length
        ? resultsArray[0]
        : `/[businessUnitId]`;

      router.push({
        pathname,
        query: { businessUnitId: value },
      });
    },
    [router, setActiveBusinessUnit]
  );

  const options = useMemo(() => {
    return businessUnits.map((bu) => ({
      value: bu.business_unit,
      label: bu.business_unit_name,
    }));
  }, [businessUnits]);

  if (!options.length || !activeBusinessUnit) return null;

  return (
    <Select
      options={options}
      selectedOption={{
        label: activeBusinessUnit.name,
        value: activeBusinessUnit.id,
      }}
      onChange={handleChange}
      icon={
        <BusinessUnit className="text-gray-400 group-hover:text-gray-300 mr-4 flex-shrink-0 h-6 w-6" />
      }
    />
  );
};

export default BusinessUnitSelect;
