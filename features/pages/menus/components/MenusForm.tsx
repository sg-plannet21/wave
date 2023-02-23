import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import Button from 'components/inputs/button';
import { useContext, useState } from 'react';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { saveMenu } from '../api/saveMenu';
import { useMenu } from '../hooks/useMenu';
import { fieldList } from '../hooks/useMenusTableData';
import { Menu } from '../types';

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
    noInputMessage: z.string() ?? '',
    noInputRoute: z.string().min(1, 'No Input Route is a required field'),
    noMatchMessage: z.string() ?? '',
    noMatchRoute: z.string().min(1, 'No Match Route is a required field'),
    option0Message: z.string() ?? '',
    option0Route: z.string().nullable(),
    option1Message: z.string() ?? '',
    option1Route: z.string().nullable(),
    option2Message: z.string() ?? '',
    option2Route: z.string().nullable(),
    option3Message: z.string() ?? '',
    option3Route: z.string().nullable(),
    option4Message: z.string() ?? '',
    option4Route: z.string().nullable(),
    option5Message: z.string() ?? '',
    option5Route: z.string().nullable(),
    option6Message: z.string() ?? '',
    option6Route: z.string().nullable(),
    option7Message: z.string() ?? '',
    option7Route: z.string().nullable(),
    option8Message: z.string() ?? '',
    option8Route: z.string().nullable(),
    option9Message: z.string() ?? '',
    option9Route: z.string().nullable(),
    asteriskMessage: z.string() ?? '',
    asteriskRoute: z.string().nullable(),
    hashMessage: z.string() ?? '',
    hashRoute: z.string().nullable(),
  })
  .superRefine((val, ctx) => {
    for (const field of fieldList) {
      const messageField = `${field.value}Message`;
      const routeField = `${field.value}Route`;

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
      !val.option0Route &&
      !val.option1Route &&
      !val.option2Route &&
      !val.option3Route &&
      !val.option4Route &&
      !val.option5Route &&
      !val.option6Route &&
      !val.option7Route &&
      !val.option8Route &&
      !val.option9Route &&
      !val.asteriskRoute &&
      !val.hashRoute
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
  const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<Menu>('menus');
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Menus]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  if (isValidating) return <div>Loading..</div>;

  if (menusError) return <div>An error has occurred</div>;

  return (
    <Form<MenusFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);
        mutate(async (existingMenus) => {
          try {
            const { data } = await saveMenu({
              ...values,
              ...(!!menu && { id: menu.menu_id }),
            });
            const updatedMenu = { [data['menu_id']]: data };

            addNotification({
              title: `${data.menu_name} Menu ${
                newRecord ? 'Created' : 'Updated'
              }.`,
              type: 'success',
              duration: 10000,
            });
            return { ...existingMenus, ...updatedMenu };
          } catch (error) {
            return existingMenus;
          }
        });
        setIsLoading(false);
        onSuccess();
        return;
      }}
      options={{
        defaultValues: {
          name: menu?.menu_name,
          maxRetries: menu?.max_retries ?? 3,
          menuMessage: menu?.menu_message.toString(),
          noInputMessage: menu?.no_input_message?.toString(),
          noInputRoute: menu?.no_input_route,
          noMatchMessage: menu?.no_match_message?.toString(),
          noMatchRoute: menu?.no_match_route,
          option0Message: menu?.opt0_message?.toString(),
          option0Route: menu?.opt0_route,
          option1Message: menu?.opt1_message?.toString(),
          option1Route: menu?.opt1_route,
          option2Message: menu?.opt2_message?.toString(),
          option2Route: menu?.opt2_route,
          option3Message: menu?.opt3_message?.toString(),
          option3Route: menu?.opt3_route,
          option4Message: menu?.opt4_message?.toString(),
          option4Route: menu?.opt4_route,
          option5Message: menu?.opt5_message?.toString(),
          option5Route: menu?.opt5_route,
          option6Message: menu?.opt6_message?.toString(),
          option6Route: menu?.opt6_route,
          option7Message: menu?.opt7_message?.toString(),
          option7Route: menu?.opt7_route,
          option8Message: menu?.opt8_message?.toString(),
          option8Route: menu?.opt8_route,
          option9Message: menu?.opt9_message?.toString(),
          option9Route: menu?.opt9_route,
          asteriskMessage: menu?.asterisk_message?.toString(),
          asteriskRoute: menu?.asterisk_route,
          hashMessage: menu?.hash_message?.toString(),
          hashRoute: menu?.hash_route,
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
                    `${field.value}Message` as keyof MenusFormValues
                  )}
                  error={
                    formState.errors[
                      `${field.value}Message` as keyof MenusFormValues
                    ]
                  }
                  label={`${field.label} Message`}
                />
              </div>
              <div className="flex-1">
                <RouteSelectInfoField
                  control={control}
                  registration={register(
                    `${field.value}Route` as keyof MenusFormValues
                  )}
                  error={
                    formState.errors[
                      `${field.value}Route` as keyof MenusFormValues
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
