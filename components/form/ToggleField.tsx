import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type ToggleFieldProps = FieldWrapperPassThroughProps & {
  disabled?: boolean;
  checked: boolean;
  onChange: (value: boolean) => void;
};

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  error,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <FieldWrapper label={label} error={error}>
      <Switch
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={classNames(
          'relative inline-flex h-[30px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-white focus-visible:ring-opacity-75',
          {
            'bg-blue-600': checked,
            'bg-gray-200 dark:bg-gray-700': !checked,
            'pointer-events-none': disabled,
          }
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={classNames(
            'pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            { 'translate-x-7': checked, 'translate-x-0': !checked }
          )}
        />
      </Switch>
    </FieldWrapper>
  );
};
