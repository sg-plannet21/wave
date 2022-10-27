import cn from 'classnames';
import { UseFormRegisterReturn } from 'react-hook-form';
import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type InputFieldProps = FieldWrapperPassThroughProps & {
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
  // registration: UseFormReturn["register"];
  // registration: (name: string, options?: RegisterOptions) => UseFormRegisterReturn;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className,
  registration,
  type = 'text',
}) => {
  return (
    <FieldWrapper label={label} error={error}>
      <input
        type={type}
        className={cn(
          'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm dark:shadow-sm-light text-gray-900 dark:bg-gray-700',
          {
            'border-gray-300 placeholder-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 focus:border-blue-500':
              !error,
          },
          {
            'bg-red-50 border-red-500 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:border-red-400':
              !!error,
          },
          className
        )}
        {...registration}
      />
    </FieldWrapper>
  );
};
