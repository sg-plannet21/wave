import { Option } from 'components/form/ComboboxField';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import { SelectField } from 'components/form/SelectField';
import Button from 'components/inputs/button';
import Switch from 'components/inputs/switch';
import { isValidNumber } from 'lib/client/utilities';
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
    priority: z.string(),
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
    callbackToggle: z.boolean(),
    callbackCallsThreshold: z.string().optional(),
    callbackTimeThreshold: z.string().optional(),
    callbackRoute: z.string().optional(),
  })
  .superRefine((formValues, ctx) => {
    // closed toggle
    if (formValues.closedToggle && !formValues.closedRoute) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required when toggle is enabled',
        path: ['closedRoute'],
      });
    }

    // no agents toggle
    if (formValues.noAgentsToggle && !formValues.noAgentsRoute) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required when toggle is enabled',
        path: ['noAgentsRoute'],
      });
    }

    // max queue calls toggle
    if (formValues.maxQueueCallsToggle) {
      // max queue calls threshold (number)
      if (
        !formValues.maxQueueCallsThreshold ||
        !isValidNumber(formValues.maxQueueCallsThreshold)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Number of calls required',
          path: ['maxQueueCallsThreshold'],
        });
      }

      // max queue calls route
      if (!formValues.maxQueueCallsRoute) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required when toggle is enabled',
          path: ['maxQueueCallsRoute'],
        });
      }
    }

    // max queue time toggle
    if (formValues.maxQueueTimeToggle) {
      // max queue time (number)
      if (
        !formValues.maxQueueTimeThreshold ||
        !isValidNumber(formValues.maxQueueTimeThreshold)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Max Queue seconds required',
          path: ['maxQueueTimeThreshold'],
        });
      }

      // max queue time Route
      if (!formValues.maxQueueTimeRoute) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required when toggle is enabled',
          path: ['maxQueueTimeRoute'],
        });
      }
    }

    if (formValues.callbackToggle) {
      // callback calls threshold or callback time threshold must be populated
      if (
        (!formValues.callbackCallsThreshold ||
          !isValidNumber(formValues.callbackCallsThreshold)) &&
        (!formValues.callbackTimeThreshold ||
          !isValidNumber(formValues.callbackTimeThreshold))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one threshold field is required',
          path: ['callbackCallsThreshold'],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'At least one threshold field is required',
          path: ['callbackTimeThreshold'],
        });
      }

      // callback Route
      if (!formValues.callbackRoute) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required when toggle is enabled',
          path: ['callbackRoute'],
        });
      }
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

  const { mutate } = useCollectionRequest<Queue>('queues', {
    revalidateOnFocus: false,
  });
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([EntityRoles.Queues]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  // if (!newRecord && !section) return <div>Loading..</div>;
  if (isValidating) return <div>Loading..</div>;

  if (queueError) return <div>An error has occurred</div>;

  console.log('queue :>> ', queue);

  return (
    <Form<QueuesFormValues, typeof schema>
      schema={schema}
      onSubmit={async (values) => {
        console.log('values :>> ', values);
        setIsLoading(true);
        mutate(
          async (existingQueues) => {
            try {
              const { data } = await saveQueue({
                ...values,
                id,
                queueName: queue?.queue_name as string,
              });

              const updated = { [data['queue_id']]: data };

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
          priority: String(queue?.queue_priority ?? 3),
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
          maxQueueCallsThreshold: queue?.max_queue_calls_threshold?.toString(),
          maxQueueCallsMessage: queue?.max_queue_calls_message?.toString(),
          maxQueueCallsRoute: queue?.max_queue_calls_route?.toString(),
          maxQueueTimeToggle: queue?.max_queue_time_toggle,
          maxQueueTimeThreshold: queue?.max_queue_time_threshold?.toString(),
          maxQueueTimeMessage: queue?.max_queue_time_message?.toString(),
          maxQueueTimeRoute: queue?.max_queue_time_route?.toString(),
          callbackToggle: queue?.callback_toggle,
          callbackCallsThreshold: queue?.callback_calls_threshold?.toString(),
          callbackTimeThreshold: queue?.callback_time_threshold?.toString(),
          callbackRoute: queue?.callback_route?.toString(),
        },
      }}
      className="w-full sm:max-w-md lg:max-w-4xl space-y-3"
    >
      {({ register, formState, control }) => (
        <>
          <h1 className="text-2xl font-semibold text-center sm:text-left leading-none tracking-tight text-gray-700 dark:text-gray-200">
            {queue?.queue_name}
          </h1>
          <div className="flex flex-col space-y-3 lg:flex-row lg:items-start lg:space-x-6 lg:space-y-0">
            <div className="flex flex-col space-y-3 flex-1">
              <SelectField
                label="Queue Priority"
                registration={register('priority')}
                error={formState.errors['priority']}
                options={priorityRange}
                disabled={!hasWritePermissions}
              />
              <MessageSelectField
                label="Queue Welcome"
                control={control}
                registration={register('queueWelcome')}
                error={formState.errors['queueWelcome']}
                disabled={!hasWritePermissions}
              />
              <MessageSelectField
                label="Queue Music"
                control={control}
                registration={register('queueMusic')}
                error={formState.errors['queueMusic']}
                disabled={!hasWritePermissions}
              />
              <MessageSelectField
                label="Whisper Announcement"
                control={control}
                registration={register('whisperMessage')}
                error={formState.errors['whisperMessage']}
                disabled={!hasWritePermissions}
              />
            </div>
            <div className="flex flex-col space-y-3 flex-1">
              {Array.from(Array(5).keys()).map((ele) => (
                <MessageSelectField
                  key={ele}
                  label={`Message ${ele + 1}`}
                  control={control}
                  registration={register(
                    `queueMessage${ele + 1}` as queueMessages
                  )}
                  error={
                    formState.errors[`queueMessage${ele + 1}` as queueMessages]
                  }
                  disabled={!hasWritePermissions}
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
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                    disabled={!hasWritePermissions}
                  />
                )}
              />
              <MessageSelectField
                label="Closed Message"
                control={control}
                registration={register('closedMessage')}
                error={formState.errors['closedMessage']}
                disabled={!hasWritePermissions}
              />
              <RouteSelectInfoField
                label="Closed Route"
                control={control}
                registration={register('closedRoute')}
                error={formState.errors['closedRoute']}
                disabled={!hasWritePermissions}
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
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                    disabled={!hasWritePermissions}
                  />
                )}
              />
              <MessageSelectField
                label="No Agents Message"
                control={control}
                registration={register('noAgentsMessage')}
                error={formState.errors['noAgentsMessage']}
                disabled={!hasWritePermissions}
              />
              <RouteSelectInfoField
                label="No Agent Route"
                control={control}
                registration={register('noAgentsRoute')}
                error={formState.errors['noAgentsRoute']}
                disabled={!hasWritePermissions}
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
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                    disabled={!hasWritePermissions}
                  />
                )}
              />

              <div className="lg:w-56">
                <InputField
                  label="Max Calls Threshold"
                  placeholder="Max Queue Calls"
                  registration={register('maxQueueCallsThreshold')}
                  error={formState.errors['maxQueueCallsThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <div className="flex-1">
                <MessageSelectField
                  label="Max Queue Calls Message"
                  control={control}
                  registration={register('maxQueueCallsMessage')}
                  error={formState.errors['maxQueueCallsMessage']}
                  disabled={!hasWritePermissions}
                />
              </div>
              <div className="flex-1">
                <RouteSelectInfoField
                  label="Max Queue Calls Route"
                  control={control}
                  registration={register('maxQueueCallsRoute')}
                  error={formState.errors['maxQueueCallsRoute']}
                  disabled={!hasWritePermissions}
                />
              </div>
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
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                    disabled={!hasWritePermissions}
                  />
                )}
              />

              <div className="lg:w-56">
                <InputField
                  label="Max Seconds Threshold"
                  placeholder="Max Queue Time seconds"
                  registration={register('maxQueueTimeThreshold')}
                  error={formState.errors['maxQueueTimeThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>
              <div className="flex-1">
                <MessageSelectField
                  label="Max Queue Time Message"
                  control={control}
                  registration={register('maxQueueTimeMessage')}
                  error={formState.errors['maxQueueTimeMessage']}
                  disabled={!hasWritePermissions}
                />
              </div>
              <div className="flex-1">
                <RouteSelectInfoField
                  label="Max Queue Time Route"
                  control={control}
                  registration={register('maxQueueTimeRoute')}
                  error={formState.errors['maxQueueTimeRoute']}
                  disabled={!hasWritePermissions}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-solid border-gray-300 dark:border-gray-700 rounded p-3">
            <legend className="text-sm text-gray-400 dark:text-gray-400">
              Callbacks
            </legend>
            <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-x-3 lg:space-y-0">
              <Controller
                control={control}
                name="callbackToggle"
                render={({ field }) => (
                  <Switch
                    label="Status"
                    isChecked={field.value}
                    onChange={field.onChange}
                    className="flex w-24 text-sm flex-row-reverse items-end lg:items-start justify-between text-right lg:w-auto lg:flex-col lg:space-y-3 lg:pb-2"
                    disabled={!hasWritePermissions}
                  />
                )}
              />

              <div className="lg:w-56">
                <InputField
                  label="Number Threshold"
                  placeholder="Number of Queue Calls"
                  registration={register('callbackCallsThreshold')}
                  error={formState.errors['callbackCallsThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <div className="lg:w-56">
                <InputField
                  label="Seconds Threshold"
                  placeholder="Longest Queue Call seconds"
                  registration={register('callbackTimeThreshold')}
                  error={formState.errors['callbackTimeThreshold']}
                  type="number"
                  disabled={!hasWritePermissions}
                />
              </div>

              <div className="flex-1">
                <RouteSelectInfoField
                  label="Callback Route"
                  control={control}
                  registration={register('callbackRoute')}
                  error={formState.errors['callbackRoute']}
                  disabled={!hasWritePermissions}
                />
              </div>
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
