import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
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

  async function handleDelete() {
    try {
      setStatus('loading');
      mutate(
        async (routes) => {
          if (!routes) return;
          try {
            await deleteRoute(id);

            if (routes[id]) delete routes[id];
          } catch (error) {
            console.log('error', error);
          }
          return { ...routes };
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
