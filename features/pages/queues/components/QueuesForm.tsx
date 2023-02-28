import { Option } from 'components/form/ComboboxField';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import { SelectField } from 'components/form/SelectField';
import Button from 'components/inputs/button';
import Switch from 'components/inputs/switch';
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

const schema = z
  .object({
    priority: z.number(),
    whisperMessage: z.string().optional(),
    queueWelcome: z.string().optional(),
    queueMusic: z.string().min(1, 'Queue Music is required'),
    queueMessage1: z.string().optional(),
    queueMessage2: z.string().optional(),
    queueMessage3: z.string().optional(),
    queueMessage4: z.string().optional(),
    queueMessage5: z.string().optional(),
    closedToggle: z.boolean(),
    closedMessage: z.string().optional(),
    closedRoute: z.string().optional(),
    noAgentsToggle: z.boolean(),
    noAgentsMessage: z.string().optional(),
    noAgentsRoute: z.string().optional(),
    maxQueueCallsToggle: z.boolean(),
    maxQueueCallsMessage: z.string().optional(),
    maxQueueCallsThreshold: z.string().optional(),
    maxQueueCallsRoute: z.string().optional(),
    maxQueueTimeToggle: z.boolean(),
    maxQueueTimeMessage: z.string().optional(),
    maxQueueTimeThreshold: z.string().optional(),
    maxQueueTimeRoute: z.string().optional(),
    callbacksToggle: z.boolean(),
    callbacksCallsThreshold: z.string().optional(),
    callbacksTimeThreshold: z.string().optional(),
    callbacksRoute: z.string().optional(),
  })
  .superRefine((formValues, ctx) => {
    if (formValues.closedToggle && !formValues.closedRoute) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Route is required when Closed Toggle is enabled',
        path: ['closedRoute'],
      });
    }
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
          priority: queue?.queue_priority ?? 3,
          queueMessage1: queue?.queue_message_1?.toString(),
          queueMessage2: queue?.queue_message_2?.toString(),
          queueMessage3: queue?.queue_message_3?.toString(),
          queueMessage4: queue?.queue_message_4?.toString(),
          queueMessage5: queue?.queue_message_5?.toString(),
          queueMusic: queue?.queue_music.toString(),
          queueWelcome: queue?.queue_welcome?.toString(),
          whisperMessage: queue?.whisper_message?.toString(),
          closedToggle: queue?.closed_toggle,
          closedMessage: queue?.closed_message?.toString(),
          closedRoute: queue?.closed_route?.toString(),
          noAgentsToggle: queue?.no_agents_toggle,
          noAgentsMessage: queue?.no_agents_message?.toString(),
          noAgentsRoute: queue?.no_agents_route?.toString(),
          maxQueueCallsToggle: queue?.max_queue_calls_toggle,
          maxQueueCallsThreshold: queue?.max_queue_calls_message?.toString(),
          maxQueueCallsMessage: queue?.max_queue_calls_message?.toString(),
          maxQueueCallsRoute: queue?.max_queue_calls_route?.toString(),
          maxQueueTimeToggle: queue?.max_queue_time_toggle,
          maxQueueTimeThreshold: queue?.max_queue_time_message?.toString(),
          maxQueueTimeMessage: queue?.max_queue_time_message?.toString(),
          maxQueueTimeRoute: queue?.max_queue_time_route?.toString(),
          callbacksToggle: queue?.callback_toggle,
          callbacksCallsThreshold: queue?.callback_calls_threshold?.toString(),
          callbacksTimeThreshold: queue?.callback_time_threshold?.toString(),
          callbacksRoute: queue?.callback_route?.toString(),
        },
      }}
      className="w-full sm:max-w-md lg:max-w-4xl space-y-3"
    >
      {({ register, formState, control }) => (
        <>
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-start lg:space-x-6 lg:space-y-0">
            <div className="flex flex-col space-y-3 flex-1">
              <SelectField
                registration={register('priority')}
                error={formState.errors['priority']}
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
          <fieldset className="border border-solid border-gray-300 dark:border-gray-700 rounded p-3">
            <legend className="text-sm text-gray-400 dark:text-gray-400">
              Closed
            </legend>
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Controller
                control={control}
                name="closedToggle"
                render={({ field }) => (
                  <Switch
                    disabled={!hasWritePermissions}
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
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
          </fieldset>

          <fieldset className="border border-solid border-gray-300 dark:border-gray-700 rounded p-3">
            <legend className="text-sm text-gray-400 dark:text-gray-400">
              No Agents
            </legend>
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Controller
                control={control}
                name="noAgentsToggle"
                render={({ field }) => (
                  <Switch
                    disabled={!hasWritePermissions}
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                  />
                )}
              />
              <MessageSelectField
                disabled={!hasWritePermissions}
                control={control}
                registration={register('noAgentsMessage')}
                error={formState.errors['noAgentsMessage']}
                label="No Agents Message"
              />
              <RouteSelectInfoField
                disabled={!hasWritePermissions}
                control={control}
                registration={register('noAgentsRoute')}
                error={formState.errors['noAgentsRoute']}
                label="No Agent Route"
              />
            </div>
          </fieldset>

          <fieldset className="border border-solid border-gray-300 dark:border-gray-700 rounded p-3">
            <legend className="text-sm text-gray-400 dark:text-gray-400">
              Max Queue Calls
            </legend>
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Controller
                control={control}
                name="maxQueueCallsToggle"
                render={({ field }) => (
                  <Switch
                    disabled={!hasWritePermissions}
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                  />
                )}
              />

              <div className="lg:w-128">
                <InputField
                  label="Max Calls Threshold"
                  registration={register('maxQueueCallsThreshold')}
                  error={formState.errors['maxQueueCallsThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <MessageSelectField
                label="Max Queue Calls Message"
                control={control}
                registration={register('maxQueueCallsMessage')}
                error={formState.errors['maxQueueCallsMessage']}
                disabled={!hasWritePermissions}
              />
              <RouteSelectInfoField
                disabled={!hasWritePermissions}
                control={control}
                registration={register('maxQueueCallsRoute')}
                error={formState.errors['maxQueueCallsRoute']}
                label="Max Queue Calls Route"
              />
            </div>
          </fieldset>

          <fieldset className="border border-solid border-gray-300 dark:border-gray-700 rounded p-3">
            <legend className="text-sm text-gray-400 dark:text-gray-400">
              Max Queue Time
            </legend>
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Controller
                control={control}
                name="maxQueueTimeToggle"
                render={({ field }) => (
                  <Switch
                    disabled={!hasWritePermissions}
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                  />
                )}
              />

              <div className="lg:w-128">
                <InputField
                  label="Max Seconds Threshold"
                  registration={register('maxQueueTimeThreshold')}
                  error={formState.errors['maxQueueTimeThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <MessageSelectField
                label="Max Queue Time Message"
                control={control}
                registration={register('maxQueueTimeMessage')}
                error={formState.errors['maxQueueTimeMessage']}
                disabled={!hasWritePermissions}
              />
              <RouteSelectInfoField
                disabled={!hasWritePermissions}
                control={control}
                registration={register('maxQueueTimeRoute')}
                error={formState.errors['maxQueueTimeRoute']}
                label="Max Queue Time Route"
              />
            </div>
          </fieldset>

          <fieldset className="border border-solid border-gray-300 dark:border-gray-700 rounded p-3">
            <legend className="text-sm text-gray-400 dark:text-gray-400">
              Callbacks
            </legend>
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Controller
                control={control}
                name="callbacksToggle"
                render={({ field }) => (
                  <Switch
                    disabled={!hasWritePermissions}
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                  />
                )}
              />

              <div className="lg:w-80">
                <InputField
                  label="Number Threshold"
                  registration={register('callbacksCallsThreshold')}
                  error={formState.errors['callbacksCallsThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <div className="lg:w-80">
                <InputField
                  label="Seconds Threshold"
                  registration={register('callbacksTimeThreshold')}
                  error={formState.errors['callbacksTimeThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <RouteSelectInfoField
                disabled={!hasWritePermissions}
                control={control}
                registration={register('callbacksRoute')}
                error={formState.errors['callbacksRoute']}
                label="Callback Route"
              />
            </div>
          </fieldset>

          <div>
            <Button
              // disabled={!formState.isDirty || isLoading || !hasWritePermissions}
              disabled={isLoading || !hasWritePermissions}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              Update Queue
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};

export default QueuesForm;
