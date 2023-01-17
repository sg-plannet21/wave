import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import deleteRoute from '../api/deleteRoute';
import { Route } from '../types';

type DeleteRouteProps = {
  id: Route['route_id'];
  name: string;
};

// idle - loading - complete
const DeleteRoute: React.FC<DeleteRouteProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Route>('routes');
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    try {
      setStatus('loading');
      mutate(
        async (routes) => {
          try {
            await deleteRoute(id);

            addNotification({
              type: 'success',
              title: `${
                routes ? `${routes[id].route_name} ` : ''
              }Route Deleted`,
              duration: 3000,
            });

            if (routes && routes[id]) delete routes[id];

            return { ...routes };
          } catch (error) {
            console.log('error', error);
            return routes;
          }
        },
        { revalidate: false }
      );
    } catch (error) {
      console.log('error :>> ', error);
    } finally {
      setStatus('complete');
    }
  }

  return (
    <ConfirmationDialog
      title="Delete Route"
      body={`Delete route ${name}?`}
      isDone={status === 'complete'}
      triggerButton={
        <button className="text-red-600 dark:text-red-400 transition-transform hover:scale-110">
          <Trash className="h-4 w-4" />
        </button>
      }
      confirmButton={
        <Button
          type="button"
          isLoading={status === 'loading'}
          className="bg-red-600"
          onClick={handleDelete}
        >
          Delete
        </Button>
      }
    />
  );
};

export default DeleteRoute;
