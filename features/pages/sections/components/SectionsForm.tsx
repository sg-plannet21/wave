import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import _ from 'lodash';
import { useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { createSection } from '../api/createSection';
import { editSection } from '../api/editSection';
import { useSection } from '../hooks/useSection';

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
  const { data: section, error: sectionError } = useSection(
    newRecord ? undefined : id
  );

  const { mutate } = useCollectionRequest('section');

  if (!newRecord && !section) return <div>Loading..</div>;

  if (sectionError) return <div>An error has occurred</div>;

  return (
    <Form<SectionsFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        console.log('values', values);
        setIsLoading(true);
        mutate(
          async (sections) => {
            try {
              const { data } = newRecord
                ? await createSection(values)
                : await editSection({ ...values, id });

              const section = _.keyBy(data, data.section_id);
              onSuccess();
              return { ...sections, section };
            } catch (error) {
              console.log('error', error);
              return sections;
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
          />

          <div>
            <Button
              disabled={!formState.isDirty || isLoading}
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
