import { Switch as UISwitch } from '@headlessui/react';
import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';

const colourList = {
  purple: {
    background: 'bg-purple-600',
    ring: 'focus:ring-purple-300 dark:focus:ring-purple-800',
  },
  emerald: {
    background: 'bg-emerald-600',
    ring: 'focus:ring-emerald-300 dark:focus:ring-emerald-800',
  },
  orange: {
    background: 'bg-orange-600',
    ring: 'focus:ring-orange-300 dark:focus:ring-orange-800',
  },
  cyan: {
    background: 'bg-cyan-600',
    ring: 'focus:ring-cyan-300 dark:focus:ring-cyan-800',
  },
  fuchsia: {
    background: 'bg-fuchsia-600',
    ring: 'focus:ring-fuchsia-300 dark:focus:ring-Fuchsia-800',
  },
  teal: {
    background: 'bg-teal-600',
    ring: 'focus:ring-teal-300 dark:focus:ring-teal-800',
  },
  yellow: {
    background: 'bg-yellow-600',
    ring: 'focus:ring-yellow-300 dark:focus:ring-yellow-800',
  },
  red: {
    background: 'bg-red-600',
    ring: 'focus:ring-red-300 dark:focus:ring-red-800',
  },
  green: {
    background: 'bg-green-600',
    ring: 'focus:ring-green-300 dark:focus:ring-green-800',
  },
  indigo: {
    background: 'bg-indigo-600',
    ring: 'focus:ring-indigo-300 dark:focus:ring-indigo-800',
  },
};

export function mapNumberToColour(number = 0) {
  const colorListArray = Object.keys(colourList);
  return colorListArray[
    number % colorListArray.length
  ] as keyof typeof colourList;
}

export type SwitchProps = {
  label: string;
  isChecked: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  colour?: keyof typeof colourList;
  className?: string;
  disabled?: boolean;
};

const Switch: React.FC<SwitchProps> = ({
  label,
  isChecked,
  onChange,
  className = 'flex items-center justify-between py-1',
  colour = 'indigo',
  disabled = false,
}) => {
  return (
    <UISwitch.Group as="div" className={classNames(className)}>
      <UISwitch.Label className="flex-1">{label}</UISwitch.Label>
      <UISwitch
        as="button"
        disabled={disabled}
        checked={isChecked}
        onChange={onChange}
        className={`${
          isChecked
            ? `${colourList[colour].background}`
            : 'bg-gray-200 dark:bg-gray-700'
        } relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline focus:ring-4 ${
          colourList[colour].ring
        }`}
      >
        {({ checked }) => (
          <span
            className={`${
              checked ? 'translate-x-5' : 'translate-x-0'
            } inline-block w-5 h-5 transition-colors duration-200 ease-in-out transform bg-white rounded-full bg-`}
          />
        )}
      </UISwitch>
    </UISwitch.Group>
  );
};

export default Switch;
