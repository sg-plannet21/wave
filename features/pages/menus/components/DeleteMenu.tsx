import ConfirmationDialog from 'components/feedback/confirmation-dialog';
import { Trash } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useContext } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';

import deleteMenu from '../api/deleteMenu';
import { Menu } from '../types';

type DeleteMenuProps = {
  id: Menu['menu_id'];
  name: string;
};

// idle - loading - complete
const DeleteMenu: React.FC<DeleteMenuProps> = ({ id, name }) => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>(
    'idle'
  );
  const { mutate } = useCollectionRequest<Menu>('menus', {
    revalidateOnFocus: false,
  });
  const { addNotification } = useContext(NotificationContext);

  async function handleDelete() {
    setStatus('loading');
    mutate(
      async (existingMenus) => {
        try {
          await deleteMenu(id);

          addNotification({
            type: 'success',
            title: `${
              existingMenus ? `${existingMenus[id].menu_name} ` : ''
            }Menu Deleted`,
            duration: 3000,
          });

          if (existingMenus && existingMenus[id]) delete existingMenus[id];

          return { ...existingMenus };
        } catch (error) {
          console.log('error', error);
          return existingMenus;
        }
      },
      { revalidate: false }
    ).finally(() => setStatus('complete'));
  }

  return (
    <ConfirmationDialog
      title="Delete Menu"
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

export default DeleteMenu;
