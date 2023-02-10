import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import RegionSelectField from 'components/form/RegionSelectField';
import Button from 'components/inputs/button';
import getConfig from 'next/config';
import { useState } from 'react';
import { z } from 'zod';
import { useEntryPoint } from '../hooks/useEntryPoint';

type EntryPointsFormProps = {
  onSuccess: () => void;
  id: string;
};

type EntryPointsFormValues = {
  name: string;
  region: number;
  section: string;
};

const {
  publicRuntimeConfig: { fallbackRegionId },
} = getConfig();

const EntryPointsForm: React.FC<EntryPointsFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: entryPoint,
    error: entryPointError,
    isValidating,
  } = useEntryPoint(newRecord ? undefined : id);

  // const { mutate } = useCollectionRequest<EntryPoint>('entrypoints', {
  //   revalidateOnFocus: false,
  // });

  const schema = z.object({
    name: z.string().min(1, ' Route name is required').trim(),
    region: z.number(),
    section: z.string().min(1, ' Section is required').trim(),
  });

  if (isValidating) return <div>Loading..</div>;

  if (entryPointError) return <div>An error has occurred</div>;

  if (!newRecord && !entryPoint) return <div>Not found..</div>;

  return (
    <Form<EntryPointsFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);
        console.log('values', values);
        onSuccess();
        setIsLoading(false);
      }}
      options={{
        defaultValues: {
          name: entryPoint?.entry_point,
          region: entryPoint?.region ?? fallbackRegionId,
          section: entryPoint?.section,
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
              {newRecord ? 'Create Route' : 'Update Route'}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default EntryPointsForm;
