import { Transition, Popover as UiPopover } from '@headlessui/react';
import { Fragment, useState } from 'react';

export type PopoverProps = {
  message: string;
  children: React.ReactNode;
};

const Popover: React.FC<PopoverProps> = ({ message, children }) => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <UiPopover className="relative">
      {() => (
        <>
          <UiPopover.Button
            onMouseEnter={() => !isShowing && setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
            as="div"
            className="inline-block"
          >
            {children}
          </UiPopover.Button>
          <Transition
            as={Fragment}
            show={isShowing}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <UiPopover.Panel className="absolute bottom-7 -left-1/4">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-200 ring-opacity-5 dark:ring-gray-600">
                <div className="bg-white dark:bg-gray-800 py-2 px-3 text-xs text-gray-500 dark:text-white whitespace-nowrap">
                  {message}
                </div>
              </div>
            </UiPopover.Panel>
          </Transition>
        </>
      )}
    </UiPopover>
  );
};

export default Popover;
