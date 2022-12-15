import classNames from 'classnames';
import Spinner from 'components/feedback/spinner/Spinner';
import React from 'react';

const variants = {
  primary: 'bg-blue-600 text-white',
  inverse:
    'bg-white text-blue-600 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white',
  danger:
    'bg-red-600 text-white focus:ring-1 focus:ring-offset-1 focus:ring-red-500',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-2 px-6 text-md',
  lg: 'py-3 px-8 text-lg',
};

type IconProps =
  | {
      startIcon: React.ReactNode;
      endIcon?: never;
    }
  | {
      startIcon?: never;
      endIcon: React.ReactNode;
    }
  | {
      startIcon?: undefined;
      endIcon?: undefined;
    };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
} & IconProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={classNames(
          'flex justify-center items-center border border-gray-300 dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed rounded-md shadow-sm font-medium focus:outline-none hover:opacity-80',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {!isLoading && startIcon}
        <span className="mx-2">{props.children}</span> {!isLoading && endIcon}
        {isLoading && (
          <Spinner size="sm" className="text-current dark:text-current" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
