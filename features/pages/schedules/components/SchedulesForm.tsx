import { zodResolver } from '@hookform/resolvers/zod';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import { Option, SelectField } from 'components/form/SelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import moment, { Moment } from 'moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { saveSchedule } from '../api/saveSchedule';
import { mapToViewModel } from '../helpers/form-helpers';
import {
  BaseSchema,
  baseSchema,
  messageValidation,
} from '../helpers/schema-helper';
import { validateScheduleRange } from '../helpers/validation-helper';
import { useSchedule } from '../hooks/useSchedule';
import { MessageField, Schedule, Weekdays } from '../types';

const {
  publicRuntimeConfig: { timeFormat, serverTimeFormat },
} = getConfig();
// https://stackoverflow.com/questions/67059069/set-default-value-in-datepicker-antd-with-react-hook-form-v7

type SchedulesFormProps = {
  onSuccess: () => void;
  id: string;
};

const weekDayOptions: Option[] = Array.from(Array(7).keys()).map((ele) => ({
  label: Weekdays[ele + 1],
  value: ele + 1,
}));

const schema = z
  .object({
    weekDay: z.string().regex(/^[1-7]$/),
  })
  .merge(baseSchema)
  .superRefine(messageValidation<BaseSchema>);

type SchedulesFormValues = z.infer<typeof schema>;

const SchedulesForm: React.FC<SchedulesFormProps> = ({ id, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const newRecord = id === 'new';
  const {
    query: { sectionId },
  } = useRouter();
  const {
    data: schedule,
    error: scheduleError,
    isValidating,
  } = useSchedule(newRecord ? undefined : id, { revalidateOnFocus: false });
  const {
    data: schedules,
    isValidating: isValidatingSchedules,
    mutate,
  } = useCollectionRequest<Schedule>('schedules', { revalidateOnFocus: false });
  const { register, handleSubmit, reset, formState, control, setError } =
    useForm<SchedulesFormValues>({
      defaultValues: {
        weekDay: '1',
        message1: '',
        message2: '',
        message3: '',
        message4: '',
        message5: '',
        route: '',
        timeRange: ['09:00', '17:00'],
      },
      resolver: zodResolver(schema),
    });
  const { addNotification } = useContext(NotificationContext);

  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Schedules,
  ]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  useEffect(() => {
    if (!schedule) return;
    reset({
      weekDay: schedule?.week_day.toString(),
      timeRange: [
        moment.utc(schedule.start_time, serverTimeFormat).format(timeFormat) ??
          '9:00',
        moment.utc(schedule.end_time, serverTimeFormat).format(timeFormat) ??
          '17:00',
      ],
      message1: schedule?.message_1?.toString(),
      message2: schedule?.message_2?.toString(),
      message3: schedule?.message_3?.toString(),
      message4: schedule?.message_4?.toString(),
      message5: schedule?.message_5?.toString(),
      route: schedule?.route,
    });
  }, [schedule, reset]);

  if (isValidating || isValidatingSchedules) return <div>Loading..</div>;

  if (!newRecord && !schedule) return <div>Not found..</div>;

  if (scheduleError) return <div>An error has occurred</div>;

  async function onSubmit(values: SchedulesFormValues) {
    console.log('values', values);

    if (!schedule?.is_default && schedules) {
      const outcome = validateScheduleRange({
        startTime: values.timeRange[0],
        endTime: values.timeRange[1],
        schedules: Object.values(schedules),
        sectionId: sectionId?.toString() as string,
        scheduleId: schedule?.schedule_id,
        weekDays: [values.weekDay],
      });

      if (!outcome.result) {
        setError('timeRange', { message: outcome.message });
        return;
      }
    }

    setIsLoading(true);

    const payload = mapToViewModel(
      {
        ...values,
        sectionId: sectionId?.toString() as string,
        scheduleId: schedule?.schedule_id,
        isDefault: !!schedule?.is_default,
      },
      newRecord
    );

    mutate(
      async (schedules) => {
        try {
          const { data } = await saveSchedule(payload);
          const schedule = { [data['schedule_id']]: data };
          addNotification({
            title: newRecord ? 'Schedule Added' : 'Schedule Updated',
            message: `Successfully ${newRecord ? 'added' : 'updated'} ${
              Weekdays[data.week_day]
            } schedule.`,
            type: 'success',
            duration: 5000,
          });
          onSuccess();
          return { ...schedules, ...schedule };
        } catch (error) {
          console.log('error', error);
          return schedules;
        } finally {
          setIsLoading(false);
        }
      },
      { revalidate: false }
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full sm:max-w-md space-y-3"
    >
      <SelectField
        label="Weekday"
        registration={register('weekDay')}
        error={formState.errors['weekDay']}
        options={weekDayOptions}
        disabled={!hasWritePermissions}
      />

      {!schedule?.is_default && (
        <Controller
          control={control}
          name="timeRange"
          render={(props) => (
            <TimeRangePicker
              disabled={!hasWritePermissions}
              error={formState.errors['timeRange'] as FieldError | undefined}
              label="Time Range"
              value={
                props.field.value.map((time: string) =>
                  moment.utc(time, timeFormat)
                ) as [Moment, Moment]
              }
              onChange={(_, timeString) => {
                props.field.onChange(timeString);
              }}
            />
          )}
        />
      )}

      {Array.from(Array(5).keys()).map((ele) => (
        <MessageSelectField
          control={control}
          key={ele}
          registration={register(`message${ele + 1}` as MessageField)}
          error={formState.errors[`message${ele + 1}` as MessageField]}
          label={`Message ${ele + 1}`}
          disabled={!hasWritePermissions}
        />
      ))}

      <RouteSelectInfoField
        control={control}
        disabled={!hasWritePermissions}
        registration={register('route')}
        error={formState.errors['route']}
        label="Route"
      />

      <div>
        <Button
          disabled={!formState.isDirty || isLoading || !hasWritePermissions}
          isLoading={isLoading}
          type="submit"
          className="w-full"
        >
          {newRecord ? 'Create Schedule' : 'Update Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default SchedulesForm;
