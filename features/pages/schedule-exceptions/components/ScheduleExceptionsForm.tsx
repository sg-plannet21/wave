import { zodResolver } from '@hookform/resolvers/zod';
import DateRangePicker from 'components/form/DateRangeField';
import { InputField } from 'components/form/InputField';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import Button from 'components/inputs/button';
import {
  BaseSchema,
  baseSchema,
  messageValidation,
} from 'features/pages/schedules/helpers/schema-helper';
import { MessageField } from 'features/pages/schedules/types';
import { TimeRangeWithLabel, validateRange } from 'lib/client/date-utilities';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { saveScheduleException } from '../api/saveScheduleException';
import { useScheduleException } from '../hooks/useScheduleException';
import { ScheduleException } from '../types';

const localStartDate = moment().add(1, 'days').startOf('day').hours(9);
const localEndDate = moment(localStartDate).hours(18);

type ScheduleExceptionsFormProps = {
  onSuccess: () => void;
  id: string;
};

const schema = z
  .object({
    description: z.string().min(1, 'Name is required'),
  })
  .merge(baseSchema)
  .superRefine(messageValidation<BaseSchema>);

type ScheduleExceptionsFormValues = z.infer<typeof schema>;

const ScheduleExceptionsForm: React.FC<ScheduleExceptionsFormProps> = ({
  id,
  onSuccess,
}) => {
  const newRecord = id === 'new';
  const [isLoading, setIsLoading] = useState(false);
  const {
    query: { sectionId },
  } = useRouter();
  const {
    data: scheudleException,
    error: scheduleExceptionsError,
    isValidating,
  } = useScheduleException(newRecord ? undefined : id, {
    revalidateOnFocus: false,
  });

  const { register, control, handleSubmit, formState, setError } =
    useForm<ScheduleExceptionsFormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        description: scheudleException?.description,
        route: scheudleException?.route,
        message1: scheudleException?.message_1?.toString() ?? '',
        message2: scheudleException?.message_2?.toString() ?? '',
        message3: scheudleException?.message_3?.toString() ?? '',
        message4: scheudleException?.message_4?.toString() ?? '',
        message5: scheudleException?.message_5?.toString() ?? '',
        timeRange: [
          scheudleException?.start_time ?? localStartDate.toISOString(),
          scheudleException?.end_time ?? localEndDate.toISOString(),
        ],
      },
    });

  const { data: scheduleExceptions, mutate } =
    useCollectionRequest<ScheduleException>('scheduleExceptions');

  if (isValidating) return <div>Loading..</div>;

  if (scheduleExceptionsError) return <div>An error has occurred</div>;

  if (!newRecord && !scheudleException) return <div>Not found..</div>;

  async function onSubmit(values: ScheduleExceptionsFormValues) {
    if (scheduleExceptions) {
      console.log('looking for clash :>> ');
      const existingExceptions: TimeRangeWithLabel[] = Object.values(
        scheduleExceptions
      )
        .filter((scheduleException) => scheduleException.section === sectionId)
        .map(({ start_time, end_time, description }) => ({
          startTime: moment(start_time),
          endTime: moment(end_time),
          label: description,
        }));
      const outcome = validateRange(
        {
          startTime: moment(values.timeRange[0]),
          endTime: moment(values.timeRange[1]),
        },
        existingExceptions,
        { type: 'date' }
      );
      console.log('outcome :>> ', outcome);
      if (!outcome.result) {
        setError('timeRange', { message: outcome.message });
        return;
      }
    }

    setIsLoading(true);

    const payload = {
      section: sectionId as string,
      startTime: values.timeRange[0],
      endTime: values.timeRange[1],
      ...values,
      ...(!newRecord && { id: scheudleException?.schedule_exception_id }),
    };
    mutate(
      async (existingExceptions) => {
        try {
          const { data } = await saveScheduleException(payload);
          const exception = { [data['schedule_exception_id']]: data };
          onSuccess();
          return { ...existingExceptions, ...exception };
        } catch (error) {
          console.log('error', error);
          return existingExceptions;
        } finally {
          setIsLoading(false);
        }
      },
      { revalidate: false }
    );
  }

  console.log('formState.dirtyFields :>> ', formState.dirtyFields);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full sm:max-w-md space-y-4"
    >
      <InputField
        registration={register('description')}
        label="Name"
        error={formState.errors['description']}
      />

      <Controller
        control={control}
        name="timeRange"
        render={(props) => (
          <DateRangePicker
            // disabled={!hasWritePermissions}
            error={formState.errors['timeRange'] as FieldError | undefined}
            label="Time Range"
            value={
              props.field.value.map((date: string) => moment(date)) as [
                Moment,
                Moment
              ]
            }
            onChange={(values) => {
              props.field.onChange(
                values && values.map((date) => moment(date).toISOString())
              );
            }}
          />
        )}
      />

      {Array.from(Array(5).keys()).map((ele) => (
        <MessageSelectField
          // disabled={!hasWritePermissions}
          control={control}
          key={ele}
          registration={register(`message${ele + 1}` as MessageField)}
          error={formState.errors[`message${ele + 1}` as MessageField]}
          label={`Message ${ele + 1}`}
        />
      ))}

      <RouteSelectInfoField
        control={control}
        // disabled={!hasWritePermissions}
        registration={register('route')}
        error={formState.errors['route']}
        label="Route"
      />

      <div>
        <Button
          disabled={!formState.isDirty || isLoading}
          isLoading={isLoading}
          type="submit"
          className="w-full"
        >
          {newRecord
            ? 'Create Schedule Exception'
            : 'Update Schedule Exception'}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleExceptionsForm;
