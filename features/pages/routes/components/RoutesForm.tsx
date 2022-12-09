import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import { Option, SelectField } from 'components/form/SelectField';
import Button from 'components/inputs/button';
import { useMemo } from 'react';
import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { z } from 'zod';
import { createRoute } from '../api/createRoute';
import { editRoute } from '../api/editRoute';
import { useRoute } from '../hooks/useRoute';
import { RouteDestinationType } from '../types';

type RoutesFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Route name is required'),
  destination: z.string().min(1, ' Destination is required'),
  destinationType: z.string().min(1, ' Destination is required'),
});

type RouteFormValues = {
  name: string;
  destination: string;
  destinationType: string;
};

const RoutesForm: React.FC<RoutesFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const { data: route, error: routeError } = useRoute(
    newRecord ? undefined : id
  );
  const { data: destinationTypes, error: destinationTypesErrors } =
    useWaveCollectionRequest<RouteDestinationType>('routeDestinationTypes');

  const options: Option[] = useMemo(() => {
    if (!destinationTypes) return [];

    const defaultValue: Option = {
      label: 'Select Destination Type',
      value: '',
    };

    const options = Object.values(destinationTypes).map(
      ({ destination_type, destination_type_id }) => ({
        label: destination_type,
        value: destination_type_id,
      })
    );

    return [defaultValue, ...options];
  }, [destinationTypes]);

  if (!options.length || (!newRecord && !route)) return <div>Loading..</div>;

  if (routeError || destinationTypesErrors)
    return <div>An error has occurred</div>;

  return (
    <Form<RouteFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        console.log('values', values);

        try {
          newRecord
            ? await createRoute(values)
            : await editRoute({ ...values, id });
          onSuccess();
        } catch (error) {
          console.log('error', error);
        }
      }}
      options={{
        defaultValues: {
          name: route?.route_name,
          destination: route?.destination,
          destinationType: route?.destination_type,
        },
      }}
      className="w-full sm:max-w-md"
    >
      {({ register, formState }) => (
        <>
          <InputField
            registration={register('name')}
            label="Route Name"
            error={formState.errors['name']}
          />
          <InputField
            registration={register('destination')}
            label="Destination"
            error={formState.errors['destination']}
          />
          <SelectField
            options={options}
            label="Destination Type"
            registration={register('destinationType')}
            error={formState.errors['destinationType']}
          />
          <div>
            <Button
              disabled={!formState.isDirty || formState.isSubmitting}
              isLoading={formState.isSubmitting}
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

export default RoutesForm;
