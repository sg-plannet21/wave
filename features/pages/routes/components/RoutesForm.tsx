import DestinationTypeField from 'components/form/DestinationTypeField';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import { useState } from 'react';
import { z } from 'zod';
import { useRoute } from '../hooks/useRoute';

type RoutesFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Route name is required'),
  destination: z.string().min(1, ' Destination is required'),
  destinationType: z.string().min(1, ' Destination Type is required'),
});

type RouteFormValues = {
  name: string;
  destination: string;
  destinationType: string;
};

const RoutesForm: React.FC<RoutesFormProps> = ({ id, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const newRecord = id === 'new';
  const { data: route, error } = useRoute(newRecord ? undefined : id);

  if (!newRecord && !route) return <div>Loading..</div>;
  if (error) return <div>An error has occurred</div>;

  //   const { data: destinationTypes } =
  //     useWaveCollectionRequest<RouteDestinationType>('routeDestinationTypes');

  //   const destinationTypeOptions: Option[] = useMemo(() => {
  //     if (!destinationTypes) return [];

  //     return Object.values(destinationTypes).map(
  //       ({ destination_type, destination_type_id }) => ({
  //         label: destination_type,
  //         value: destination_type_id,
  //       })
  //     );
  //   }, [destinationTypes]);

  return (
    <Form<RouteFormValues, typeof schema>
      schema={schema}
      onSubmit={(values) => {
        setIsLoading(true);
        console.log('values', values);
        setIsLoading(false);
        onSuccess();
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
          <DestinationTypeField
            registration={register('destinationType')}
            label="Destination Type"
            error={formState.errors['destinationType']}
          />
          <div>
            <Button
              disabled={isLoading}
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

export default RoutesForm;
