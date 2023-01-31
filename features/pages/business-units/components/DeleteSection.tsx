import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import deleteBusinessUnit from '../deleteBusinessUnit';
import { BusinessUnit } from '../types';

type DeleteBusinessUnitProps = {
  id: BusinessUnit['business_unit_id'];
  name: string;
};

// idle - loading - complete
const DeleteBusinessUnit: React.FC<DeleteBusinessUnitProps> = ({
  id,
  name,
}) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<BusinessUnit>('businessUnits', {
    revalidateOnFocus: false,
  });

  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (businessUnits) => {
        try {
          await deleteBusinessUnit(id);

          addNotification({
            type: 'success',
            title: `${
              businessUnits ? `${businessUnits[id].business_unit} ` : ''
            }Business Unit Deleted`,
            duration: 3000,
          });

          if (businessUnits && businessUnits[id]) delete businessUnits[id];

          return { ...businessUnits };
        } catch (error) {
          console.log('error', error);
          return businessUnits;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Business Unit"
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

export default DeleteBusinessUnit;
