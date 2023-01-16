import { Transition } from '@headlessui/react';
import {
  CheckCircle,
  ExclamationCircle,
  InformationCircle,
  XCircle,
  XMark,
} from 'components/icons';
import { Fragment, useEffect, useState } from 'react';
import { INotification } from 'state/notifications/NotificationContext';

const icons = {
  info: (
    <InformationCircle className="w-6 h-6 text-blue-500" aria-hidden="true" />
  ),
  success: (
    <CheckCircle className="w-6 h-6 text-green-500" aria-hidden="true" />
  ),
  warning: (
    <ExclamationCircle className="w-6 h-6 text-yellow-500" aria-hidden="true" />
  ),
  error: <XCircle className="w-6 h-6 text-red-500" aria-hidden="true" />,
};

export type NotificationProps = {
  notification: Omit<INotification, 'type'> & { type: keyof typeof icons };
  onDismiss: (notificationId: number) => void;
};

const Notification: React.FC<NotificationProps> = ({
  notification: { id, title, message, type, duration },
  onDismiss,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!show) {
      const timeoutId = setTimeout(() => onDismiss(id), 300);
      return () => clearTimeout(timeoutId);
    }
  }, [show, id, onDismiss]);

  useEffect(() => {
    if (duration) {
      const timeoutId = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timeoutId);
    }
  }, [duration]);

  return (
    <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
      <Transition
        appear={true}
        show={show}
        as={Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="max-w-sm w-full bg-white dark:bg-slate-700 rounded-lg shadow-lg pointer-events-auto ring-1 ring-black dark:ring-white ring-opacity-5 overflow-hidden">
          <div className="p-4" role="alert" aria-label={title}>
            <div className="flex items-start">
              <div className="flex-shrink-0">{icons[type]}</div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {title}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => setShow(false)}
                  className="bg-white dark:bg-slate-600 rounded-md inline-flex text-gray-400 dark:text-gray-300 hover:text-gray-500 hover:dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <XMark className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default Notification;
