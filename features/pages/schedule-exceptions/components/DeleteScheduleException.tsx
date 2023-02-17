import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';

import deleteScheduleException from '../api/deleteScheduleException';
import { ScheduleException } from '../types';

type DeleteScheduleExceptionProps = {
  id: ScheduleException['schedule_exception_id'];
  name: string;
};

// idle - loading - complete
const DeleteScheduleException: React.FC<DeleteScheduleExceptionProps> = ({
  id,
  name,
}) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<ScheduleException>(
    'scheduleExceptions',
    {
      revalidateOnFocus: false,
    }
  );
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (existingExceptions) => {
        try {
          await deleteScheduleException(id);

          addNotification({
            type: 'success',
            title: `${
              existingExceptions ? `${existingExceptions[id].description} ` : ''
            }Exception Deleted`,
            duration: 3000,
          });

          if (existingExceptions && existingExceptions[id])
            delete existingExceptions[id];

          return { ...existingExceptions };
        } catch (error) {
          console.log('error', error);
          return existingExceptions;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Schedule Exception"
      body={`Delete ${name}?`}
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

export default DeleteScheduleException;
