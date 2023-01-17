import AudioPlayerDialog from 'components/feedback/audio-player-dialog';
import Spinner from 'components/feedback/spinner/Spinner';
import { Prompt } from 'features/pages/messages/types';
import { useMemo } from 'react';
import { Control, FieldValues, useWatch } from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Option, SelectField, SelectFieldProps } from './SelectField';

type MessageSelectFieldProps<T extends FieldValues> = Omit<
  SelectFieldProps,
  'options' | 'groupedOptions'
> & { control: Control<T> };

function PlayAudio<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: string;
}) {
  const { data: prompts } = useCollectionRequest<Prompt>('prompts', {
    revalidateOnFocus: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promptId = useWatch<any>({
    control,
    name,
    defaultValue: null,
  });

  if (!promptId || !prompts) return null;
  return (
    <div className="pl-2">
      <AudioPlayerDialog
        trackList={{
          src: prompts[promptId].audio_file,
          name: prompts[promptId].prompt_name,
        }}
      />
    </div>
  );
}

const MessageSelectField = <T extends FieldValues>(
  props: MessageSelectFieldProps<T>
) => {
  const { data, error } = useCollectionRequest<Prompt>('prompts', {
    revalidateOnFocus: false,
  });

  const name = props.registration.name as string;

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
    <div className="flex w-full justify-between items-end">
      <div className="flex-1">
        <SelectField
          options={options}
          {...props}
          defaultValue={props.defaultValue ?? options[0]?.value.toString()}
        />
      </div>

      <PlayAudio<T> name={name} control={props.control} />
    </div>
  );
};

export default MessageSelectField;
