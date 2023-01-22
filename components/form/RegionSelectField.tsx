import Spinner from 'components/feedback/spinner/Spinner';
import { Region } from 'features/pages/business-units/types';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Option, SelectField, SelectFieldProps } from './SelectField';

const RegionSelectField: React.FC<
  Omit<SelectFieldProps, 'options' | 'groupedOptions'>
> = (props) => {
  const { data: regions, error: regionsError } = useCollectionRequest<Region>(
    'regions',
    {
      revalidateOnFocus: false,
    }
  );

  const options: Option[] = useMemo(() => {
    if (!regions) return [];

    const defaultOption: Option = {
      label: 'Select Region',
      value: '',
    };

    const options: Option[] = Object.values(regions).map((region) => ({
      label: region.language_name,
      value: region.id,
    }));

    return [defaultOption, ...options];
  }, [regions]);

  if (!options.length)
    return (
      <div className="flex w-full justify-center items-center">
        <Spinner size="sm" />
      </div>
    );

  if (regionsError) return <div>An Error has occurred</div>;

  return (
    <SelectField
      options={options}
      {...props}
      defaultValue={props.defaultValue ?? options[0].value.toString()}
    />
  );
};

export default RegionSelectField;
