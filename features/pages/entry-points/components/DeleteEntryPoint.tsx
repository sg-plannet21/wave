import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import deleteEntryPoint from '../api/deleteEntryPoint';
import { EntryPoint } from '../types';

type DeleteEntryPointProps = {
  id: EntryPoint['entry_point_id'];
  name: string;
};

// idle - loading - complete
const DeleteEntryPoint: React.FC<DeleteEntryPointProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<EntryPoint>('entrypoints', {
    revalidateOnFocus: false,
  });
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (entryPoints) => {
        try {
          await deleteEntryPoint(id);

          addNotification({
            type: 'success',
            title: `${
              entryPoints ? `${entryPoints[id].entry_point} ` : ''
            }Route Deleted`,
            duration: 3000,
          });

          if (entryPoints && entryPoints[id]) delete entryPoints[id];

          return { ...entryPoints };
        } catch (error) {
          console.log('error', error);
          return entryPoints;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
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

export default DeleteEntryPoint;
