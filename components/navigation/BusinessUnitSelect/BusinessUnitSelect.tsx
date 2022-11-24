import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'components/icons';
import storage from 'lib/client/storage';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export type BusinessUnitOption = {
  label: string;
  path: string;
};

export type BusinessUnitSelectProps = {
  businessUnits: BusinessUnitOption[];
};

const BusinessUnitSelect: React.FC<BusinessUnitSelectProps> = ({
  businessUnits = [],
}) => {
  const router = useRouter();
  const [selectedBusinessUnit, setSelectedBusinessUnit] =
    useState<BusinessUnitOption>();

  useEffect(() => {
    if (selectedBusinessUnit !== null || !businessUnits.length) return;

    const persistedBusinessUnit = storage.getBusinessUnit();
    if (persistedBusinessUnit) {
      // ensure the BU list (still) includes the stored business unit id
      const validBusinessUnit = businessUnits.find(
        (businessUnit) => businessUnit.path === persistedBusinessUnit
      );
      if (validBusinessUnit) {
        setSelectedBusinessUnit({
          path: validBusinessUnit.path,
          label: validBusinessUnit.label,
        });
        return;
      }
    }

    setSelectedBusinessUnit(businessUnits[0]);
  }, [businessUnits, selectedBusinessUnit, router.query.businessUnitId]);

  function handleChange(value: BusinessUnitOption) {
    // filter the businessUnitId dynamic route and path up to proceeding '/'
    const regex = /\/\[businessUnitId\]\/.*\//;
    var resultsArray = regex.exec(router.pathname);
    const pathname = resultsArray?.length ? resultsArray[0] : router.pathname;

    setSelectedBusinessUnit(value);

    router.push({
      pathname,
      query: { businessUnitId: value.path },
    });
  }

  if (!selectedBusinessUnit) return null;

  return (
    <Listbox value={selectedBusinessUnit} onChange={handleChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selectedBusinessUnit.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {businessUnits.map((businessUnit, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={businessUnit}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {businessUnit.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default BusinessUnitSelect;
