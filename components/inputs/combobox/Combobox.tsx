import { Transition, Combobox as UICombobox } from '@headlessui/react';
import classNames from 'classnames';
import { Check, DoubleChevron } from 'components/icons';
import { Fragment, useState } from 'react';

export type ComboboxOption = {
  label: string;
  value: string | number | string[];
};

export type ComboboxProps = {
  options: ComboboxOption[];
  selectedOption: ComboboxOption;
  onChange: (option: ComboboxOption) => void;
  icon?: React.ReactNode;
  className?: string;
};

const Combobox: React.FC<ComboboxProps> = ({
  options,
  selectedOption,
  onChange,
  className,
}) => {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <UICombobox value={selectedOption} onChange={onChange}>
      <div className="relative mt-1">
        <div
          className={classNames(
            'relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm',
            className
          )}
        >
          <UICombobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(option: ComboboxOption) => option.label}
            onChange={(event) => setQuery(event.target.value)}
          />
          <UICombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <DoubleChevron
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </UICombobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <UICombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option: ComboboxOption) => (
                <UICombobox.Option
                  key={option.label}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </UICombobox.Option>
              ))
            )}
          </UICombobox.Options>
        </Transition>
      </div>
    </UICombobox>
  );
};

export default Combobox;
