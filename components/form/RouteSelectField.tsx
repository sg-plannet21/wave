import Spinner from 'components/feedback/spinner/Spinner';
import { Route, RouteDestinationType } from 'features/pages/routes/types';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { GroupOption, SelectField, SelectFieldProps } from './SelectField';

const RouteSelectField: React.FC<
  Omit<SelectFieldProps, 'options' | 'groupedOptions'>
> = (props) => {
  const { data: routes, error: routesError } = useCollectionRequest<Route>(
    'routes',
    {
      revalidateOnFocus: false,
    }
  );
  const { data: destinationTypes, error: destinationTypesError } =
    useCollectionRequest<RouteDestinationType>('routeDestinationTypes', {
      revalidateOnFocus: false,
    });

  const options: GroupOption[] = useMemo(() => {
    if (!routes || !destinationTypes) return [];

    const defaultOption: GroupOption[] = [
      {
        optgroup: '',
        options: [
          {
            label: 'Select Route',
            value: '',
          },
        ],
      },
    ];

    const options: GroupOption[] = Object.values(destinationTypes)
      .map(({ destination_type_id, destination_type }) => ({
        optgroup: destination_type,
        options: Object.values(routes)
          .filter(
            ({ destination_type: routeDestinationType }) =>
              destination_type_id === routeDestinationType
          )
          .map((route) => ({
            label: route.route_name,
            value: route.route_id,
          })),
      }))
      .filter((grouped) => grouped.options.length);

    return [...defaultOption, ...options];
  }, [routes, destinationTypes]);

  if (!options.length)
    return (
      <div className="flex w-full justify-center items-center">
        <Spinner size="sm" />
      </div>
    );

  if (routesError || destinationTypesError)
    return <div>An Error has occurred</div>;

  return (
    <SelectField
      groupedOptions={options}
      {...props}
      defaultValue={
        props.defaultValue ?? options[0].options[0].value.toString()
      }
    />
  );
};

export default RouteSelectField;
