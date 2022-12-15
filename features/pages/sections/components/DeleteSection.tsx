import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
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
  const { mutate } = useCollectionRequest<Section>('section');

  async function handleDelete() {
    try {
      setStatus('loading');
      mutate(
        async (sections) => {
          if (!sections) return;
          try {
            await deleteSection(id);

            if (sections[id]) delete sections[id];
          } catch (error) {
            console.log('error', error);
          }
          return { ...sections };
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
      title="Delete Section"
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

export default DeleteSection;
