import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import Button from 'components/inputs/button';
import { useState } from 'react';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import { z } from 'zod';
import { useMenu } from '../hooks/useMenu';

const fields = [
  { prefix: 'opt0', label: 'Option 0' },
  { prefix: 'opt1', label: 'Option 1' },
  { prefix: 'opt2', label: 'Option 2' },
  { prefix: 'opt3', label: 'Option 3' },
  { prefix: 'opt4', label: 'Option 4' },
  { prefix: 'opt5', label: 'Option 5' },
  { prefix: 'opt6', label: 'Option 6' },
  { prefix: 'opt7', label: 'Option 7' },
  { prefix: 'opt8', label: 'Option 8' },
  { prefix: 'opt9', label: 'Option 9' },
  { prefix: 'optAsterisk', label: 'Option *' },
  { prefix: 'optHash', label: 'Option #' },
];

type MenusFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Menu name is required'),
  // maxRetries: z
  //   .string()
  //   .min(1, 'Max Retries is required')
  //   .regex(/^\d+$/)
  //   .transform(Number),
  maxRetries: z
    .number()
    .min(0, 'Max Retries must be 0 or more')
    .max(10, 'Max Retries must be 10 or less'),
  menuMessage: z.string().min(1, 'Menu Message is required'),
  opt0_message: z.string().nullable(),
  opt0_route: z.string().nullable(),
  opt1_message: z.string().nullable(),
  opt1_route: z.string().nullable(),
  opt2_message: z.string().nullable(),
  opt2_route: z.string().nullable(),
  opt3_message: z.string().nullable(),
  opt3_route: z.string().nullable(),
  opt4_message: z.string().nullable(),
  opt4_route: z.string().nullable(),
  opt5_message: z.string().nullable(),
  opt5_route: z.string().nullable(),
  opt6_message: z.string().nullable(),
  opt6_route: z.string().nullable(),
  opt7_message: z.string().nullable(),
  opt7_route: z.string().nullable(),
  opt8_message: z.string().nullable(),
  opt8_route: z.string().nullable(),
  opt9_message: z.string().nullable(),
  opt9_route: z.string().nullable(),
  optAsterisk_message: z.string().nullable(),
  optAsterisk_route: z.string().nullable(),
  optHash_message: z.string().nullable(),
  optHash_route: z.string().nullable(),
});

type MenusFormValues = z.infer<typeof schema>;

const MenusForm: React.FC<MenusFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: menu,
    error: menusError,
    isValidating,
  } = useMenu(newRecord ? undefined : id, { revalidateOnFocus: false });
  // const { addNotification } = useContext(NotificationContext);

  // const { mutate } = useCollectionRequest<Menu>('menus');
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Menus]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  if (isValidating) return <div>Loading..</div>;

  if (menusError) return <div>An error has occurred</div>;

  return (
    <Form<MenusFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);
        console.log('values :>> ', values);
        setIsLoading(false);
        onSuccess();
        return;
      }}
      options={{
        defaultValues: {
          name: menu?.menu_name,
          maxRetries: menu?.max_retries ?? 3,
        },
      }}
      className="w-full sm:max-w-md lg:max-w-3xl space-y-3"
    >
      {({ register, formState, control }) => (
        <>
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-end lg:space-x-3 lg:space-y-0">
            <div className="lg:flex-1">
              <InputField
                registration={register('name')}
                error={formState.errors['name']}
                label="Menu Name"
                disabled={!hasWritePermissions}
              />
            </div>
            <div className="lg:flex-1">
              <MessageSelectField
                control={control}
                registration={register('menuMessage')}
                error={formState.errors['menuMessage']}
                label="Menu Message"
              />
            </div>
            <div>
              <InputField
                type="number"
                registration={register('maxRetries')}
                error={formState.errors['maxRetries']}
                label="Max Retries"
              />
            </div>
          </div>

          {fields.map((field) => (
            <div
              key={field.prefix}
              className="flex flex-col space-y-3 lg:flex-row lg:items-end lg:space-x-5 lg:space-y-0"
            >
              <div className="flex-1">
                <RouteSelectInfoField
                  control={control}
                  registration={register(
                    `${field.prefix}_route` as keyof MenusFormValues
                  )}
                  error={
                    formState.errors[`${field}_route` as keyof MenusFormValues]
                  }
                  label={`${field.label} Route`}
                />
              </div>
              <div className="flex-1">
                <MessageSelectField
                  control={control}
                  registration={register(
                    `${field.prefix}message` as keyof MenusFormValues
                  )}
                  error={
                    formState.errors[`${field}message` as keyof MenusFormValues]
                  }
                  label={`${field.label} Message`}
                />
              </div>
            </div>
          ))}

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
