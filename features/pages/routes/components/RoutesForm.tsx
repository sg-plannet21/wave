import DestinationTypeField from 'components/form/DestinationTypeField';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import { useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { saveRoute } from '../api/saveRoute';
import { useRoute } from '../hooks/useRoute';

type RoutesFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Route name is required'),
  destination: z.string().min(1, ' Destination is required'),
  destinationType: z.string().min(1, ' Destination is required'),
});

type RouteFormValues = z.infer<typeof schema>;

// type RouteFormValues = {
//   name: string;
//   destination: string;
//   destinationType: string;
// };

const RoutesForm: React.FC<RoutesFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: route,
    error: routeError,
    isValidating,
  } = useRoute(newRecord ? undefined : id);

  const { mutate } = useCollectionRequest('routes');

  if (isValidating) return <div>Loading..</div>;

  if (routeError) return <div>An error has occurred</div>;

  if (!newRecord && !route) return <div>Not found..</div>;

  return (
    <Form<RouteFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        setIsLoading(true);
        const payload = {
          ...values,
          ...(!newRecord && { id: route?.route_id }),
        };
        mutate(
          async (routes) => {
            try {
              const { data } = await saveRoute(payload);
              const route = { [data['route_id']]: data };
              onSuccess();
              return { ...routes, ...route };
            } catch (error) {
              console.log('error', error);
              return routes;
            } finally {
              setIsLoading(false);
            }
          },
          { revalidate: false }
        );
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
            label="Destination Type"
            registration={register('destinationType')}
            error={formState.errors['destinationType']}
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

export default RoutesForm;
