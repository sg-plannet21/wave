import cn from 'classnames';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError | undefined;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  'className' | 'children'
>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { label, className, error, children } = props;
  return (
    <div>
      <label
        className={cn(
          'block mb-2 text-sm font-medium',
          { 'text-red-700 dark:text-red-500': !!error },
          className
        )}
      >
        {label}
        <div className="mt-1">{children}</div>
      </label>
      {error?.message && (
        <div
          role="alert"
          aria-label={error.message}
          className="text-sm font-semibold text-red-600 dark:text-red-500"
        >
          <span className="font-medium">{error.message}</span>
        </div>
      )}
    </div>
  );
};
