import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import RegionSelectField from 'components/form/RegionSelectField';
import Button from 'components/inputs/button';
import { useContext, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { createBusinessUnit } from '../createBusinessUnit';
import { editBusinessUnit } from '../editBusinessUnit';
import { useBusinessUnit } from '../hooks/useBusinessUnit';
import { BusinessUnit } from '../types';

type BusinessUnitFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z
    .string()
    .min(1, 'Business Unit name is required')
    .max(20, 'Name must be 20 characters or less')
    .trim(),
  regionId: z.string().min(1, 'Region is a required field').trim(),
});

type BusinessUnitsFormValues = z.infer<typeof schema>;

const BusinessUnitsForm: React.FC<BusinessUnitFormProps> = ({
  id,
  onSuccess,
}) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: businessUnit,
    error: businessUnitError,
    isValidating,
  } = useBusinessUnit(newRecord ? undefined : id);
  const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<BusinessUnit>('businessUnits', {
    revalidateOnFocus: false,
  });

  if (isValidating) return <div>Loading..</div>;

  if (businessUnitError) return <div>An error has occurred</div>;

  console.log('id :>> ', id);

  return (
    <Form<BusinessUnitsFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);
        const commonFields = {
          regionId: parseInt(values.regionId),
          name: values.name,
        };
        mutate(
          async (businessUnits) => {
            try {
              const { data } = newRecord
                ? await createBusinessUnit(commonFields)
                : await editBusinessUnit({ ...commonFields, id });

              const businessUnit = { [data['business_unit_id']]: data };

              addNotification({
                title: `${data.business_unit} Business Unit ${
                  newRecord ? 'Created' : 'Updated'
                }`,
                type: 'success',
                duration: 3000,
              });

              onSuccess();
              return { ...businessUnits, ...businessUnit };
            } catch (error) {
              console.log('error', error);
              return businessUnits;
            } finally {
              setIsLoading(false);
            }
          },
          { revalidate: false }
        );
      }}
      options={{
        defaultValues: {
          name: businessUnit?.business_unit,
          regionId: '52',
        },
      }}
      className="w-full sm:max-w-md"
    >
      {({ register, formState }) => (
        <>
          <InputField
            registration={register('name')}
            label="Business Unit Name"
            error={formState.errors['name']}
          />

          <RegionSelectField
            registration={register('regionId')}
            label="Region"
            error={formState.errors['regionId']}
          />

          <div>
            <Button
              disabled={!formState.isDirty || isLoading}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              {newRecord ? 'Create Business Unit' : 'Update Business Unit'}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default BusinessUnitsForm;
