import { BusinessUnit } from 'components/icons';
import Select from 'components/inputs/select';

import storage from 'lib/client/storage';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from 'state/auth/types';

type BusinessUnitSelectProps = {
  businessUnits: User['business_unit_roles'];
};

export type SelectOption = {
  label: React.ReactNode;
  value: string | number | string[];
};

const BusinessUnitSelect: React.FC<BusinessUnitSelectProps> = ({
  businessUnits = [],
}) => {
  const router = useRouter();
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<
    SelectOption | undefined
  >(undefined);

  const getUserBusinessUnit = useCallback(
    (businessUnit: string): SelectOption | undefined => {
      const bu = businessUnits.find((bu) => bu.business_unit === businessUnit);
      if (!bu) return undefined;
      return { label: bu.business_unit_name, value: bu.business_unit };
    },
    [businessUnits]
  );

  const handleChange = useCallback(
    (businessUnit: SelectOption) => {
      storage.setBusinessUnit(businessUnit.value.toString());
      setSelectedBusinessUnit(businessUnit);

      // filter the businessUnitId dynamic route and path up to proceeding '/'
      // const regex = /\/\[businessUnitId\]\/.*\//;
      const regex = /\/\[businessUnitId\]\/\w*/;
      const resultsArray = regex.exec(router.pathname);
      const pathname = resultsArray?.length
        ? resultsArray[0]
        : `/[businessUnitId]`;

      router.push({
        pathname,
        query: { businessUnitId: businessUnit.value },
      });
    },
    [router]
  );

  useEffect(() => {
    if (!selectedBusinessUnit && router.query.businessUnitId) {
      console.log(
        'useEffect. setBusinessUnit to:',
        router.query.businessUnitId?.toString()
      );

      const businessUnit = getUserBusinessUnit(
        router.query.businessUnitId.toString()
      );

      if (businessUnit) {
        storage.setBusinessUnit(businessUnit.value.toString());
        setSelectedBusinessUnit(businessUnit);
      } else {
        // router.replace('/')
        // todo: invalid bu
        console.log('invalid BU');
      }
    }
  }, [selectedBusinessUnit, router.query.businessUnitId, getUserBusinessUnit]);

  const options = useMemo(() => {
    return businessUnits.map((bu) => ({
      value: bu.business_unit,
      label: bu.business_unit_name,
    }));
  }, [businessUnits]);

  if (!options.length || !selectedBusinessUnit) return null;

  return (
    <Select
      options={options}
      selectedOption={selectedBusinessUnit}
      onChange={handleChange}
      icon={
        <BusinessUnit className="text-gray-400 group-hover:text-gray-300 mr-4 flex-shrink-0 h-6 w-6" />
      }
    />
  );
};

export default BusinessUnitSelect;
