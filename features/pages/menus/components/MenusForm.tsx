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
import { fieldList } from '../hooks/useMenusTableData';

type MenusFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z
  .object({
    name: z.string().min(1, ' Menu name is required'),
    maxRetries: z
      .number({
        invalid_type_error: 'Max Retries must be a number in the range 0-10',
      })
      .min(0, 'Max Retries must be 0 or more')
      .max(10, 'Max Retries must be 10 or less'),
    menuMessage: z.string().min(1, 'Menu Message is required'),
    noInput_message: z.string().nullable(),
    noInput_route: z.string().min(1, 'No Input Route is a required field'),
    noMatch_message: z.string().nullable(),
    noMatch_route: z.string().min(1, 'No Match Route is a required field'),
    option0_message: z.string().nullable(),
    option0_route: z.string().nullable(),
    option1_message: z.string().nullable(),
    option1_route: z.string().nullable(),
    option2_message: z.string().nullable(),
    option2_route: z.string().nullable(),
    option3_message: z.string().nullable(),
    option3_route: z.string().nullable(),
    option4_message: z.string().nullable(),
    option4_route: z.string().nullable(),
    option5_message: z.string().nullable(),
    option5_route: z.string().nullable(),
    option6_message: z.string().nullable(),
    option6_route: z.string().nullable(),
    option7_message: z.string().nullable(),
    option7_route: z.string().nullable(),
    option8_message: z.string().nullable(),
    option8_route: z.string().nullable(),
    option9_message: z.string().nullable(),
    option9_route: z.string().nullable(),
    asterisk_message: z.string().nullable(),
    asterisk_route: z.string().nullable(),
    hash_message: z.string().nullable(),
    hash_route: z.string().nullable(),
  })
  .superRefine((val, ctx) => {
    for (const field of fieldList) {
      const messageField = `${field.value}_message`;
      const routeField = `${field.value}_route`;

      if (
        val[messageField as keyof typeof val] &&
        !val[routeField as keyof typeof val]
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Route is required when a corresponding message is provided',
          path: [routeField],
        });
      }
    }

    if (
      !val.option0_route &&
      !val.option1_route &&
      !val.option2_route &&
      !val.option3_route &&
      !val.option4_route &&
      !val.option5_route &&
      !val.option6_route &&
      !val.option7_route &&
      !val.option8_route &&
      !val.option9_route &&
      !val.asterisk_route &&
      !val.hash_route
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one Option (0-9, * or #) is required',
        path: ['opt1_route'],
      });
    }
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
                registration={register('maxRetries', { valueAsNumber: true })}
                error={formState.errors['maxRetries']}
                label="Max Retries"
              />
            </div>
          </div>

          {fieldList.map((field) => (
            <div
              key={field.value}
              className="flex flex-col space-y-3 lg:flex-row lg:items-end lg:space-x-5 lg:space-y-0"
            >
              <div className="flex-1">
                <MessageSelectField
                  control={control}
                  registration={register(
                    `${field.value}_message` as keyof MenusFormValues
                  )}
                  error={
                    formState.errors[
                      `${field.value}_message` as keyof MenusFormValues
                    ]
                  }
                  label={`${field.label} Message`}
                />
              </div>
              <div className="flex-1">
                <RouteSelectInfoField
                  control={control}
                  registration={register(
                    `${field.value}_route` as keyof MenusFormValues
                  )}
                  error={
                    formState.errors[
                      `${field.value}_route` as keyof MenusFormValues
                    ]
                  }
                  label={`${field.label} Route`}
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
