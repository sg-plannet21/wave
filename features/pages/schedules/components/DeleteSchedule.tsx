import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import deleteSchedule from '../api/deleteSchedule';

import { Schedule } from '../types';

type DeleteScheduleProps = {
  id: Schedule['schedule_id'];
  name: string;
};

// idle - loading - complete
const DeleteSchedule: React.FC<DeleteScheduleProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Schedule>('schedules');

  async function handleDelete() {
    try {
      setStatus('loading');
      mutate(
        async (schedules) => {
          if (!schedules) return;
          try {
            await deleteSchedule(id);

            if (schedules[id]) delete schedules[id];
          } catch (error) {
            console.log('error', error);
          }
          return { ...schedules };
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
      title="Delete Schedule"
      body={`Delete Schedule ${name}?`}
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

export default DeleteSchedule;
