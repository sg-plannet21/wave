import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import { useContext, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { editMessage } from '../api/editMessage';
import { useMessage } from '../hooks/useMessage';
import { Prompt } from '../types';

type MessagesFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z.object({
  name: z.string().min(1, ' Message name is required').max(20),
});

type MessagesFormValues = z.infer<typeof schema>;

const MessagesForm: React.FC<MessagesFormProps> = ({ id, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: prompt, error: promptsError, isValidating } = useMessage(id);
  const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<Prompt>('prompts');

  if (isValidating) return <div>Loading..</div>;

  if (promptsError) return <div>An error has occurred</div>;

  return (
    <Form<MessagesFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        if (!prompt) return;

        setIsLoading(true);

        mutate(
          async (prompts) => {
            try {
              const { data } = await editMessage({
                ...values,
                detail: prompt.prompt_detail,
                id: parseInt(id),
              });

              const updatedPrompt = { [data['prompt_id']]: data };

              addNotification({
                title: `${data.prompt_name} Message Updated`,
                type: 'success',
                duration: 3000,
              });

              onSuccess();
              return { ...prompts, ...updatedPrompt };
            } catch (error) {
              console.log('error', error);
              return prompts;
            } finally {
              setIsLoading(false);
            }
          },
          { revalidate: false }
        );
      }}
      options={{
        defaultValues: {
          name: prompt?.prompt_name,
        },
      }}
      className="w-full sm:max-w-md"
    >
      {({ register, formState }) => (
        <>
          <InputField
            registration={register('name')}
            label="Message Name"
            error={formState.errors['name']}
          />

          <div>
            <Button
              disabled={!formState.isDirty || isLoading}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              Update Message
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default MessagesForm;
