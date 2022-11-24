import { Listbox, Transition } from '@headlessui/react';
import { BusinessUnit, Check, DoubleChevron } from 'components/icons';

import storage from 'lib/client/storage';
import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'state/auth/types';

type BusinessUnitSelectProps = {
  businessUnits: User['business_unit_roles'];
};

export type SelectOption = {
  label: React.ReactNode;
  value: string | number | string[];
};

const BusinessUnitSelect: React.FC<BusinessUnitSelectProps> = ({
  businessUnits,
}) => {
  const [selectedItem, setSelectedItem] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (selectedItem !== null || !businessUnits.length) return;

    const persistedBusinessUnit = storage.getBusinessUnit();
    if (persistedBusinessUnit) {
      // ensure the BU list (still) includes the stored business unit id
      const businessUnit = businessUnits.find(
        (businessUnit) => businessUnit.business_unit === persistedBusinessUnit
      );

      if (businessUnit) {
        setSelectedItem({
          value: businessUnit.business_unit,
          label: businessUnit.business_unit_name,
        });
      }
    } else {
      const defaultBusinessUnit = {
        value: businessUnits[0].business_unit,
        label: businessUnits[0].business_unit_name,
      };
      storage.setBusinessUnit(defaultBusinessUnit.value);
      setSelectedItem(defaultBusinessUnit);
    }
  }, [selectedItem, businessUnits]);

  const options = useMemo(() => {
    return businessUnits.map((bu) => ({
      value: bu.business_unit,
      label: bu.business_unit_name,
    }));
  }, [businessUnits]);

  function handleItemChange(item: SelectOption) {
    storage.setBusinessUnit(item.value.toString());
    setSelectedItem(item);
  }

  if (!businessUnits?.length || !selectedItem) return null;

  return (
    <Listbox value={selectedItem} onChange={handleItemChange}>
      <div className="relative">
        <Listbox.Button className="group relative w-full flex items-center cursor-default rounded-lg bg-orange-200 dark:bg-orange-600 dark:text-gray-300 p-2 pr-10 text-base font-medium shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <BusinessUnit className="text-gray-400 group-hover:text-gray-300 mr-4 flex-shrink-0 h-6 w-6" />
          <span className="block truncate">{selectedItem.label}</span>
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
                      option.value === selectedItem.value
                        ? 'font-medium'
                        : 'font-normal'
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.value === selectedItem.value ? (
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
