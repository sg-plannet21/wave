import Spinner from 'components/feedback/spinner/Spinner';
import { RouteDestinationType } from 'features/pages/routes/types';
import { useMemo } from 'react';
import useWaveCollectionRequest from 'state/hooks/useWaveCollectionRequest';
import { Option, SelectField, SelectFieldProps } from './SelectField';

const DestinationTypeField: React.FC<
  Omit<SelectFieldProps, 'options' | 'groupedOptions'>
> = (props) => {
  const { data, error } = useWaveCollectionRequest<RouteDestinationType>(
    'routeDestinationTypes'
  );

  const options: Option[] = useMemo(() => {
    if (!data) return [];

    const defaultValue: Option = {
      label: 'Select Destination Type',
      value: '',
    };

    const options = Object.values(data).map(
      ({ destination_type, destination_type_id }) => ({
        label: destination_type,
        value: destination_type_id,
      })
    );

    return [defaultValue, ...options];
  }, [data]);

  if (!data)
    <div className="flex w-full justify-center items-center">
      <Spinner size="sm" />
    </div>;

  if (error) return <div>An Error has occurred</div>;

  return (
    <SelectField
      options={options}
      {...props}
      defaultValue={props.defaultValue ?? options[0]?.value.toString()}
    />
  );
};

export default DestinationTypeField;
