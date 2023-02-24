import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import { useContext, useState } from 'react';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { createSection } from '../api/createSection';
import { editSection } from '../api/editSection';
import { useSection } from '../hooks/useSection';
import { Section } from '../types';

type SectionsFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Section name is required'),
});

type SectionsFormValues = z.infer<typeof schema>;

const SectionsForm: React.FC<SectionsFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: section,
    error: sectionError,
    isValidating,
  } = useSection(newRecord ? undefined : id, { revalidateOnFocus: false });
  const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<Section>('sections');
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Schedules,
  ]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  // if (!newRecord && !section) return <div>Loading..</div>;
  if (isValidating) return <div>Loading..</div>;

  if (sectionError) return <div>An error has occurred</div>;

  return (
    <Form<SectionsFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);
        mutate(
          async (existingSections) => {
            try {
              const { data } = newRecord
                ? await createSection(values)
                : await editSection({ ...values, id });

              const section = { [data['section_id']]: data };

              addNotification({
                title: `${data.section} Section ${
                  newRecord ? 'Created' : 'Updated'
                }`,
                type: 'success',
                duration: 3000,
              });

              onSuccess();
              return { ...existingSections, ...section };
            } catch (error) {
              console.log('error', error);
              return existingSections;
            } finally {
              setIsLoading(false);
            }
          },
          { revalidate: false }
        );
      }}
      options={{
        defaultValues: {
          name: section?.section,
        },
      }}
      className="w-full sm:max-w-md"
    >
      {({ register, formState }) => (
        <>
          <InputField
            registration={register('name')}
            label="Section Name"
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
              {newRecord ? 'Create Section' : 'Update Section'}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default SectionsForm;
