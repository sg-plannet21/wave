import Spinner from 'components/feedback/spinner/Spinner';
import RouteInfo from 'features/pages/routes/components/RouteInfo';
import { Route, RouteDestinationType } from 'features/pages/routes/types';
import _ from 'lodash';
import Link from 'next/link';
import { useMemo } from 'react';
import { Control, FieldValues, useWatch } from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { GroupOption, SelectField, SelectFieldProps } from './SelectField';

type RouteSelectInfoField<T extends FieldValues> = Omit<
  SelectFieldProps,
  'options' | 'groupedOptions'
> & { control: Control<T> };

function getEntityLink(
  route: Route,
  destinationType: string
): JSX.Element | undefined {
  switch (destinationType.toLowerCase()) {
    case 'section':
      return (
        <Link
          href={{
            pathname: '/[businessUnitId]/schedules/[sectionId]',
            query: {
              businessUnitId: route.business_unit,
              sectionId: route.destination,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    case 'menu':
      return (
        <Link
          href={{
            pathname: '/[businessUnitId]/menus/[menuId]',
            query: {
              businessUnitId: route.business_unit,
              menuId: route.destination,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    case 'entrypoint':
      return (
        <Link
          href={{
            pathname: '/[businessUnitId]/entry-points/[entryPointId]',
            query: {
              businessUnitId: route.business_unit,
              entryPointId: route.destination,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    case 'queue':
      return (
        <Link
          href={{
            pathname: '/[businessUnitId]/queues/[queueId]',
            query: {
              businessUnitId: route.business_unit,
              queueId: route.destination,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    case 'schedule':
      return (
        <Link
          href={{
            pathname: '/[businessUnitId]/schedules/[scheduleId]',
            query: {
              businessUnitId: route.business_unit,
              scheduleId: route.destination,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    case 'scheduleexception':
      return (
        <Link
          href={{
            pathname:
              '/[businessUnitId]/schedule-exceptions/[scheduleExceptionId]',
            query: {
              businessUnitId: route.business_unit,
              scheduleExceptionId: route.destination,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    case 'external':
      return (
        <Link
          href={{
            pathname: '/[businessUnitId]/routes/[routeId]',
            query: {
              businessUnitId: route.business_unit,
              routeId: route.route_id,
            },
          }}
        >
          {route.route_name}
        </Link>
      );
    default:
      return undefined;
  }
}

function ShowInfo<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: string;
}) {
  const { data: routes } = useCollectionRequest<Route>('routes', {
    revalidateOnFocus: false,
  });
  const { data: destinationTypes } = useCollectionRequest<RouteDestinationType>(
    'routeDestinationTypes',
    {
      revalidateOnFocus: false,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeId = useWatch<any>({
    control,
    name,
    defaultValue: null,
  });

  if (!routeId || !destinationTypes || !routes) return null;

  const route = routes[routeId];

  const destinationTypeLabel = _.get(
    destinationTypes[route.destination_type],
    'destination_type'
  );

  const destination =
    destinationTypeLabel === 'External' ? route.destination : undefined;

  return (
    <div className="pl-2">
      <RouteInfo
        name={
          getEntityLink(route, destinationTypeLabel) ?? <>{route.route_name}</>
        }
        destinationType={destinationTypeLabel}
        destination={destination}
      />
    </div>
  );
}

const MessageSelectField = <T extends FieldValues>(
  props: RouteSelectInfoField<T>
) => {
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

  const name = props.registration.name as string;

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
    <div className="flex w-full justify-between items-end">
      <div className="flex-1">
        <SelectField
          groupedOptions={options}
          {...props}
          defaultValue={
            props.defaultValue ?? options[0].options[0].value.toString()
          }
        />
      </div>

      <ShowInfo<T> name={name} control={props.control} />
    </div>
  );
};

export default MessageSelectField;
