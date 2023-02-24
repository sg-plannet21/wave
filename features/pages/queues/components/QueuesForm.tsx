import { Option } from 'components/form/ComboboxField';
import { Form } from 'components/form/Form';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import { SelectField } from 'components/form/SelectField';
import { ToggleField } from 'components/form/ToggleField';
import Button from 'components/inputs/button';
import { useContext, useState } from 'react';
import { Controller } from 'react-hook-form';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { saveQueue } from '../api/saveQueue';
import { useQueue } from '../hooks/useQueue';
import { Queue } from '../types';

type queueMessages =
  | 'queueMessage1'
  | 'queueMessage2'
  | 'queueMessage3'
  | 'queueMessage4'
  | 'queueMessage5';

type SectionsFormProps = {
  onSuccess: () => void;
  id: string;
};

const priorityRange: Option[] = Array.from(Array(10).keys()).map((key) => ({
  label: String(key + 1),
  value: String(key + 1),
}));

const schema = z.object({
  queuePriority: z.string(),
  whisperMessage: z.string().optional(),
  queueWelcome: z.string().optional(),
  queueMusic: z.string().optional(),
  queueMessage1: z.string().optional(),
  queueMessage2: z.string().optional(),
  queueMessage3: z.string().optional(),
  queueMessage4: z.string().optional(),
  queueMessage5: z.string().optional(),
  closedToggle: z.boolean(),
  closedMessage: z.string().optional(),
  closedRoute: z.string().optional(),
});

type QueuesFormValues = z.infer<typeof schema>;

const QueuesForm: React.FC<SectionsFormProps> = ({ id, onSuccess }) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: queue,
    error: queueError,
    isValidating,
  } = useQueue(newRecord ? undefined : id, { revalidateOnFocus: false });
  const { addNotification } = useContext(NotificationContext);

  const { mutate } = useCollectionRequest<Queue>('queues');
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Queues]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  // if (!newRecord && !section) return <div>Loading..</div>;
  if (isValidating) return <div>Loading..</div>;

  if (queueError) return <div>An error has occurred</div>;

  return (
    <Form<QueuesFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        console.log('values :>> ', values);
        setIsLoading(true);
        mutate(
          async (existingQueues) => {
            try {
              const { data } = await saveQueue({ ...values, id });

              const updated = { [data['queue_name']]: data };

              addNotification({
                title: `${data.queue_name} Queue Updated}`,
                type: 'success',
                duration: 3000,
              });

              onSuccess();
              return { ...existingQueues, ...updated };
            } catch (error) {
              console.log('error', error);
              return existingQueues;
            } finally {
              setIsLoading(false);
            }
          },
          { revalidate: false }
        );
      }}
      options={{
        defaultValues: {
          queuePriority: (queue?.queue_priority ?? 3).toString(),
          queueMessage1: queue?.queue_message_1?.toString(),
          queueMessage2: queue?.queue_message_2?.toString(),
          queueMessage3: queue?.queue_message_3?.toString(),
          queueMessage4: queue?.queue_message_4?.toString(),
          queueMessage5: queue?.queue_message_5?.toString(),
          queueMusic: queue?.queue_music.toString(),
          queueWelcome: queue?.queue_welcome?.toString(),
          whisperMessage: queue?.whisper_message?.toString(),
          closedToggle: true,
        },
      }}
      className="w-full sm:max-w-md md:max-w-3xl space-y-3"
    >
      {({ register, formState, control }) => (
        <>
          <div className="flex flex-col space-y-3 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            <div className="flex flex-col space-y-3 flex-1">
              <SelectField
                registration={register('queuePriority')}
                error={formState.errors['queuePriority']}
                label="Queue Priority"
                options={priorityRange}
                disabled={!hasWritePermissions}
              />
              <MessageSelectField
                control={control}
                registration={register('queueWelcome')}
                error={formState.errors['queueWelcome']}
                label="Whisper Announcement"
                disabled={!hasWritePermissions}
              />
              <MessageSelectField
                control={control}
                registration={register('queueMusic')}
                error={formState.errors['queueMusic']}
                label="Whisper Announcement"
                disabled={!hasWritePermissions}
              />
              <MessageSelectField
                control={control}
                registration={register('whisperMessage')}
                error={formState.errors['whisperMessage']}
                label="Whisper Announcement"
                disabled={!hasWritePermissions}
              />
            </div>
            <div className="flex flex-col space-y-3 flex-1">
              {Array.from(Array(5).keys()).map((ele) => (
                <MessageSelectField
                  key={ele}
                  disabled={!hasWritePermissions}
                  control={control}
                  registration={register(
                    `queueMessage${ele + 1}` as queueMessages
                  )}
                  error={
                    formState.errors[`queueMessage${ele + 1}` as queueMessages]
                  }
                  label={`Message ${ele + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-3 md:space-y-0">
            <h4 className="text-2xl font-bold dark:text-white md:hidden">
              Queue Closed
            </h4>
            <Controller
              control={control}
              name="closedToggle"
              render={({ field }) => (
                <ToggleField
                  disabled={!hasWritePermissions}
                  label="Status"
                  error={formState.errors['closedToggle']}
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <MessageSelectField
              disabled={!hasWritePermissions}
              control={control}
              registration={register('closedMessage')}
              error={formState.errors['closedMessage']}
              label="Closed Message"
            />
            <RouteSelectInfoField
              disabled={!hasWritePermissions}
              control={control}
              registration={register('closedRoute')}
              error={formState.errors['closedRoute']}
              label="Closed Route"
            />
          </div>
          <div>
            <Button
              disabled={!formState.isDirty || isLoading || !hasWritePermissions}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              {newRecord ? 'Create Section' : 'Update Section'}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default QueuesForm;
