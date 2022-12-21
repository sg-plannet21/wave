import Spinner from 'components/feedback/spinner/Spinner';
import { Route } from 'features/pages/routes/types';
import { useMemo } from 'react';
import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { Option, SelectField, SelectFieldProps } from './SelectField';

const RouteSelectField: React.FC<
  Omit<SelectFieldProps, 'options' | 'groupedOptions'>
> = (props) => {
  const { data, error } = useWaveCollectionRequest<Route>('routes');

  const options: Option[] = useMemo(() => {
    if (!data) return [];

    const defaultValue: Option = {
      label: 'Select Route',
      value: '',
    };

    const options = Object.values(data).map(({ route_id, route_name }) => ({
      label: route_name,
      value: route_id,
    }));

    return [defaultValue, ...options];
  }, [data]);

  if (!options.length)
    return (
      <div className="flex w-full justify-center items-center">
        <Spinner size="sm" />
      </div>
    );

  if (error) return <div>An Error has occurred</div>;

  return (
    <SelectField
      options={options}
      {...props}
      defaultValue={props.defaultValue ?? options[0]?.value.toString()}
    />
  );
};

export default RouteSelectField;
