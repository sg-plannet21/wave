import * as React from 'react';
import { Control, useController } from 'react-hook-form';

import { Combobox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Check, DoubleChevron } from 'components/icons';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

export type Option = {
  label: string;
  value: string | number | string[];
};

export type ComboboxFieldProps = FieldWrapperPassThroughProps & {
  name: string;
  control: Control;
  defaultValue?: unknown;
  options: Option[];
  className?: string;
};

const ComboboxField = (props: ComboboxFieldProps) => {
  const { name, control, defaultValue, options, label, error, className } =
    props;
  const [query, setQuery] = React.useState('');
  const { field } = useController({
    name,
    defaultValue: defaultValue ?? options[0].value,
    control,
  });

  function getOptionLabel(value: string): string {
    return options.find((option) => option.value === value)?.label ?? '';
  }

  const filteredOptions: Option[] =
    query === ''
      ? options
      : options.filter((option: Option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  console.log('className :>> ', className);
  return (
    <FieldWrapper error={error} label={label}>
      <div className="relative">
        <Combobox value={field.value} onChange={field.onChange}>
          <div
            className={classNames(
              'relative w-full cursor-default overflow-hidden rounded-lg text-left sm:text-sm focus:outline-none border',
              {
                'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500':
                  !error,
              },
              {
                'bg-red-50 border-red-500 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:border-red-400':
                  !!error,
              }
            )}
          >
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-0"
              displayValue={(option: string) => getOptionLabel(option)}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <DoubleChevron
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-100">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option: Option) => (
                  <Combobox.Option
                    key={option.label}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? 'bg-teal-600 dark:bg-teal-300 text-white dark:text-gray-800'
                          : 'text-gray-900 dark:text-white'
                      }`
                    }
                    value={option.value}
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
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </div>
    </FieldWrapper>
  );
};

export default ComboboxField;
