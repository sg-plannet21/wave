import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import deleteMessage from '../api/deleteMessage';
import { Prompt } from '../types';

type DeleteMessageProps = {
  id: Prompt['prompt_id'];
  name: string;
};

// idle - loading - complete
const DeleteMessage: React.FC<DeleteMessageProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Prompt>('prompts', {
    revalidateOnFocus: false,
  });
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (prompts) => {
        try {
          await deleteMessage(id.toString());

          addNotification({
            type: 'success',
            title: `${
              prompts ? `${prompts[id].prompt_name} ` : ''
            }Prompt Deleted`,
            duration: 3000,
          });

          if (prompts && prompts[id]) delete prompts[id];

          return { ...prompts };
        } catch (error) {
          console.log('error', error);
          return prompts;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Prompt"
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

export default DeleteMessage;
