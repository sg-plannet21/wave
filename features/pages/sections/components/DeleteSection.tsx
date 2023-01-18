import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import deleteSection from '../api/deleteSection';
import { Section } from '../types';

type DeleteSectionProps = {
  id: Section['section_id'];
  name: string;
};

// idle - loading - complete
const DeleteSection: React.FC<DeleteSectionProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Section>('section', {
    revalidateOnFocus: false,
  });
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (sections) => {
        try {
          await deleteSection(id);

          addNotification({
            type: 'success',
            title: `${
              sections ? `${sections[id].section} ` : ''
            }Section Deleted`,
            duration: 3000,
          });

          if (sections && sections[id]) delete sections[id];

          return { ...sections };
        } catch (error) {
          console.log('error', error);
          return sections;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Section"
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
