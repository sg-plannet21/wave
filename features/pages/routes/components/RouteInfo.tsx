import { Popover, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Info } from 'components/icons';
import { Fragment } from 'react';

type RouteInfoProps = {
  iconClassName?: string;
  name: JSX.Element;
  destinationType: string;
  destination?: string;
};

const RouteInfo: React.FC<RouteInfoProps> = ({
  iconClassName = 'h-10 w-10',
  name,
  destinationType,
  destination,
}) => {
  return (
    <div>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={classNames(
                'rounded-md border-none outline-2 outline-gray-400 hover:scale-110 duration-200 transition-all',
                {
                  'text-green-500 text-opacity-90': open,
                  'text-indigo-500': !open,
                }
              )}
            >
              <Info className={classNames(iconClassName)} />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-10 bottom-10 mb-5 z-10 w-64 px-4 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-white p-2 lg:grid-cols-2 dark:bg-slate-600">
                    <dl className="w-full m-0 text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                      {[
                        { key: name, label: 'Name' },
                        { key: destinationType, label: 'Destination Type' },
                        { key: destination, label: 'Destination' },
                      ].map(
                        (entry) =>
                          entry.key && (
                            <div
                              key={entry.label}
                              className="flex flex-col pb-1"
                            >
                              <dt className="mb-1 text-gray-500 dark:text-gray-300">
                                {entry.label}
                              </dt>
                              <dd className="font-semibold">{entry.key}</dd>
                            </div>
                          )
                      )}

                      {/* {link && (
                        <div className="flex flex-col pb-1">
                          <dt className="mb-1 text-gray-500 dark:text-gray-300">
                            Link
                          </dt>
                          <dd className="font-semibold">{link}</dd>
                        </div>
                      )} */}
                    </dl>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default RouteInfo;
