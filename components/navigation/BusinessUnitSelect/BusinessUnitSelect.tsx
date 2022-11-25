import { Listbox, Transition } from '@headlessui/react';
import { BusinessUnit, Check, DoubleChevron } from 'components/icons';

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
    <Listbox value={selectedBusinessUnit} onChange={handleChange}>
      <div className="relative">
        <Listbox.Button className="group relative w-full flex items-center cursor-default rounded-lg bg-orange-200 dark:bg-orange-600 dark:text-gray-300 p-2 pr-10 text-base font-medium shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <BusinessUnit className="text-gray-400 group-hover:text-gray-300 mr-4 flex-shrink-0 h-6 w-6" />
          <span className="block truncate">{selectedBusinessUnit.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <DoubleChevron
              className="h-5 w-5 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value.toString()}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? 'bg-amber-100 text-amber-900'
                      : 'text-gray-900 dark:text-white'
                  }`
                }
                value={option}
              >
                <>
                  <span
                    className={`block truncate ${
                      option.value === selectedBusinessUnit.value
                        ? 'font-medium'
                        : 'font-normal'
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.value === selectedBusinessUnit.value ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      <Check className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default BusinessUnitSelect;
