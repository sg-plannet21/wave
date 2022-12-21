import Spinner from 'components/feedback/spinner/Spinner';
import { Prompt } from 'features/pages/messages/types';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Option, SelectField, SelectFieldProps } from './SelectField';

const MessageSelectField: React.FC<
  Omit<SelectFieldProps, 'options' | 'groupedOptions'>
> = (props) => {
  const { data, error } = useCollectionRequest<Prompt>('prompts');

  const options: Option[] = useMemo(() => {
    if (!data) return [];

    const defaultValue: Option = {
      label: 'Select Message',
      value: '',
    };

    const options = Object.values(data).map(({ prompt_id, prompt_name }) => ({
      label: prompt_name,
      value: prompt_id,
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

export default MessageSelectField;
