import { Listbox, Transition } from '@headlessui/react';
import { Check, DoubleChevron } from 'components/icons';
import { Fragment } from 'react';

export type SelectOption = {
  label: React.ReactNode;
  value: string | number | string[];
};

export type SelectProps = {
  options: SelectOption[];
  selectedOption: SelectOption;
  onChange: (option: SelectOption) => void;
};

// buttonClass
// listClass
// activeClass
// iconClass

const Select: React.FC<SelectProps> = ({
  options,
  selectedOption,
  onChange,
}) => {
  if (!options.length) return null;

  return (
    <Listbox value={selectedOption} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-orange-200 dark:bg-orange-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selectedOption.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <DoubleChevron
              className="h-5 w-5 text-gray-400 dark:text-gray-200"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
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
                      option.value === selectedOption.value
                        ? 'font-medium'
                        : 'font-normal'
                    }`}
                  >
                    {option.label}
                  </span>
                  {option.value === selectedOption.value ? (
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

export default Select;
