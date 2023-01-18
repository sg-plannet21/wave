import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import deleteSchedule from '../api/deleteSchedule';

import axios from 'axios';
import NotificationContext from 'state/notifications/NotificationContext';
import { Schedule, Weekdays } from '../types';

type DeleteScheduleProps = {
  id: Schedule['schedule_id'];
  name: string;
};

// idle - loading - complete
const DeleteSchedule: React.FC<DeleteScheduleProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Schedule>('schedules', {
    revalidateOnFocus: false,
  });
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (schedules) => {
        try {
          await deleteSchedule(id);

          addNotification({
            type: 'success',
            title: `${
              schedules ? `${Weekdays[schedules[id].week_day]} ` : ''
            }Schedule Deleted`,
            duration: 3000,
          });

          if (schedules && schedules[id]) delete schedules[id];

          return { ...schedules };
        } catch (error) {
          if (error instanceof Error) {
            console.log('error.message', error.message);
          }
          if (axios.isAxiosError(error)) {
            console.log('axios error :>> ', error);
            if (error.response?.data.errors) {
              console.log(
                'error.response?.data.errors',
                error.response?.data.errors
              );
            }
          }
          return schedules;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Schedule"
      body={`Delete ${Weekdays[parseInt(name)]} Schedule?`}
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
