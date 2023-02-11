import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import RegionSelectField from 'components/form/RegionSelectField';
import SectionSelectField from 'components/form/SectionSelectField';
import Button from 'components/inputs/button';
import getConfig from 'next/config';
import { useContext, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { saveEntryPoint } from '../api/saveEntryPoint';
import { useEntryPoint } from '../hooks/useEntryPoint';
import { EntryPoint } from '../types';

type EntryPointsFormProps = {
  onSuccess: () => void;
  id: string;
};

type EntryPointsFormValues = {
  name: string;
  region: string;
  section: string;
};

const schema = z.object({
  name: z.string().min(1, 'Entry Point name is required').trim(),
  region: z
    .string()
    .min(1, 'Region is required')
    .regex(/^\d+$/)
    .transform(Number),
  section: z.string().min(1, 'Section is required'),
});

const {
  publicRuntimeConfig: { fallbackRegionId },
} = getConfig();

const EntryPointsForm: React.FC<EntryPointsFormProps> = ({ id, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: entryPoint,
    error: entryPointError,
    isValidating,
  } = useEntryPoint(id, { revalidateOnFocus: false });

  const { mutate } = useCollectionRequest<EntryPoint>('entrypoints');
  const { addNotification } = useContext(NotificationContext);

  if (isValidating) return <div>Loading..</div>;

  if (entryPointError) return <div>An error has occurred</div>;

  // if (!newRecord && !entryPoint) return <div>Not found..</div>;

  return (
    <Form<EntryPointsFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);

        mutate(
          async (existingEntryPoints) => {
            const { data } = await saveEntryPoint({
              ...values,
              id,
              region: parseInt(values.region),
            });

            const entryPoint = { [data['entry_point_id']]: data };

            addNotification({
              title: `${data.entry_point} Updated`,
              type: 'success',
              duration: 3000,
            });

            console.log('1 - {...existingEntryPoints, ...entryPoint} :>> ', {
              ...existingEntryPoints,
              ...entryPoint,
            });
            console.log('2 - {...existingEntryPoints, ...entryPoint} :>> ', {
              ...existingEntryPoints,
              entryPoint,
            });
            onSuccess();
            // return {...existingEntryPoints, ...entryPoint};
            return { ...existingEntryPoints, ...entryPoint };
          },
          { revalidate: false }
        ).finally(() => setIsLoading(false));
        console.log('values', values);
      }}
      options={{
        defaultValues: {
          name: entryPoint?.entry_point,
          region: String(entryPoint?.region ?? fallbackRegionId),
          section: entryPoint?.section ?? '',
        },
      }}
      className="w-full sm:max-w-md"
    >
      {({ register, formState }) => (
        <>
          <InputField
            registration={register('name')}
            label="Entry Point Name"
            error={formState.errors['name']}
          />

          <SectionSelectField
            registration={register('section')}
            label="Section"
            error={formState.errors['section']}
          />

          <RegionSelectField
            registration={register('region')}
            label="Region"
            error={formState.errors['region']}
          />

          <div>
            <Button
              disabled={!formState.isDirty || isLoading}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              Update Entry Point
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default EntryPointsForm;
