import { useContext } from 'react';
import NotificationContext from 'state/notifications/NotificationContext';
import Notification from './Notification';

const Notifications: React.FC = () => {
  const { notifications, dismissNotification } =
    useContext(NotificationContext);
  return (
    <div
      aria-live="assertive"
      className="z-50 flex flex-col fixed inset-0 space-y-4 items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};

export default Notifications;
