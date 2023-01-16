import { createContext, useCallback, useState } from 'react';

let lastNotificationId = 0;

export interface INotification {
  id: number;
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface INotificationContext {
  notifications: INotification[];
  addNotification: (notification: Omit<INotification, 'id'>) => void;
  dismissNotification: (notificationId: number) => void;
}

const defaultValue: INotificationContext = {
  notifications: [],
  addNotification: () => undefined,
  dismissNotification: () => undefined,
};

const NotificationContext = createContext<INotificationContext>(defaultValue);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const addNotification: INotificationContext['addNotification'] = useCallback(
    (notification) =>
      setNotifications((existingNotifications) =>
        existingNotifications.concat({
          ...notification,
          id: ++lastNotificationId,
        })
      ),
    []
  );

  const dismissNotification: INotificationContext['dismissNotification'] =
    useCallback(
      (notificationId) =>
        setNotifications((existingNotifications) =>
          existingNotifications.filter(
            (notification) => notification.id !== notificationId
          )
        ),
      []
    );

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, dismissNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
