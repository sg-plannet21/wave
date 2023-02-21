import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import { useState } from 'react';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { useMenu } from '../hooks/useMenu';
import { Menu } from '../types';

type MenusFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Menu name is required'),
});

type MenusFormValues = z.infer<typeof schema>;

const MenusForm: React.FC<MenusFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: menu,
    error: menusError,
    isValidating,
  } = useMenu(newRecord ? undefined : id);
  // const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<Menu>('menus');
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Menus]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  if (isValidating) return <div>Loading..</div>;

  if (menusError) return <div>An error has occurred</div>;

  return (
    <Form<MenusFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        console.log('values :>> ', values);
        return;
        setIsLoading(true);
        mutate(
          async (existingMenus) => {
            try {
              // const { data } =  await saveMenu({ ...values, ...(newRecord && {id:id}) });

              // const menu = { [data['section_id']]: data };

              // addNotification({
              //   title: `${data.menu_name} Menu ${
              //     newRecord ? 'Created' : 'Updated'
              //   }`,
              //   type: 'success',
              //   duration: 3000,
              // });

              onSuccess();
              // return { ...existingMenus, ...menu };
              return { ...existingMenus };
            } catch (error) {
              console.log('error', error);
              return existingMenus;
            } finally {
              setIsLoading(false);
            }
          },
          { revalidate: false }
        );
      }}
      options={{
        defaultValues: {
          name: menu?.menu_name,
        },
      }}
      className="w-full sm:max-w-md"
    >
      {({ register, formState }) => (
        <>
          <InputField
            registration={register('name')}
            label="Menu Name"
            error={formState.errors['name']}
            disabled={!hasWritePermissions}
          />

          <div>
            <Button
              disabled={!formState.isDirty || isLoading || !hasWritePermissions}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              {newRecord ? 'Create menu' : 'Update menu'}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default MenusForm;
