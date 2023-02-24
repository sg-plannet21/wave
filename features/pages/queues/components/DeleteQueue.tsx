import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import deleteQueue from '../api/deleteQueue';
import { Queue } from '../types';

type DeleteQueueProps = {
  id: Queue['queue_id'];
  name: string;
};

// idle - loading - complete
const DeleteSection: React.FC<DeleteQueueProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Queue>('queues', {
    revalidateOnFocus: false,
  });
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (existingQueues) => {
        try {
          await deleteQueue(id);

          addNotification({
            type: 'success',
            title: `${
              existingQueues && existingQueues[id].queue_name
            }Queue Deleted`,
            duration: 3000,
          });

          if (existingQueues && existingQueues[id]) delete existingQueues[id];

          return { ...existingQueues };
        } catch (error) {
          console.log('error', error);
          return existingQueues;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Queue"
      body={`Delete ${name}?`}
      isDone={status === 'complete'}
      triggerButton={
        <button className="p-1 text-red-600 dark:text-red-400 transition-transform hover:scale-110 outline-none focus:outline-none">
          <Trash className="h-4 w-4" />
        </button>
      }
      confirmButton={
        <Button
          type="button"
          isLoading={status === 'loading'}
          variant="danger"
          onClick={handleDelete}
        >
          Delete
        </Button>
      }
    />
  );
};

export default DeleteSection;
