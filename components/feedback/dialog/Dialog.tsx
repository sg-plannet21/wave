import { Dialog as UIDialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import * as React from 'react';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialFocus?: React.MutableRefObject<null>;
  size?: keyof typeof sizes;
};

export const DialogTitle = UIDialog.Title;

export const DialogDescription = UIDialog.Description;

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  initialFocus,
  size = 'md',
}: DialogProps) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <UIDialog
        as="div"
        className="relative z-10"
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <UIDialog.Panel
                className={classNames(
                  'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-slate-700 dark:text-white p-6 text-left align-middle shadow-xl transition-all',
                  sizes[size]
                )}
              >
                {children}
              </UIDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </UIDialog>
    </Transition>
  );
};

export default Dialog;
