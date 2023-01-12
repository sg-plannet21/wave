import { zodResolver } from '@hookform/resolvers/zod';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import { Option, SelectField } from 'components/form/SelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import {
  TimeRange,
  TimeRangeWithLabel,
  createMomentUtc,
  formatLocalToUtcTimeString,
  timeFormat,
  validateRange,
} from 'lib/client/date-utilities';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import {
  ExistingScheduleDTO,
  NewScheduleDTO,
  saveSchedule,
} from '../api/saveSchedule';
import { mapMessageToModel } from '../helpers/form-helpers';
import { messageSchema } from '../helpers/schema-helper';
import { useSchedule } from '../hooks/useSchedule';
import { MessageField, Schedule, Weekdays } from '../types';

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
    route: z.string().min(1, 'Route is required'),
    timeRange: z.array(z.string()),
  })
  .merge(messageSchema)
  .superRefine((data, ctx) => {
    if (
      !data.message1 &&
      !data.message2 &&
      !data.message3 &&
      !data.message4 &&
      !data.message5
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['message1'],
        message: 'At least one message is required.',
      });
    }
  });

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

  useEffect(() => {
    if (!schedule) return;
    reset({
      weekDay: schedule?.week_day.toString(),
      timeRange: [schedule.start_time ?? '9:00', schedule.end_time ?? '17:00'],
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
    if (!schedule?.is_default && schedules) {
      console.log('not a default schedule - validating');
      const newTimeRange: TimeRange = {
        startTime: createMomentUtc(values.timeRange[0]),
        endTime: createMomentUtc(values.timeRange[1]),
      };

      const existingSchedules: TimeRangeWithLabel[] = Object.values(schedules)
        .filter(
          (sch) =>
            !sch.is_default &&
            sch.section === sectionId &&
            sch.week_day === parseInt(values.weekDay) &&
            sch.schedule_id !== schedule?.schedule_id
        )
        .map((schedule) => ({
          startTime: createMomentUtc(schedule.start_time as string),
          endTime: createMomentUtc(schedule.end_time as string),
          label: Weekdays[schedule.week_day],
        }));

      const outcome = validateRange(newTimeRange, existingSchedules, {
        type: 'time',
        abortEarly: true,
      });

      // const outcome = validateScheduleRange(
      //   newTimeRange,
      //   Object.values(schedules)
      // );

      if (!outcome.result) {
        setError('timeRange', { message: outcome.message });
        return;
      }
    }

    setIsLoading(true);
    console.log('onSubmit');
    console.log('values.timeRange :>> ', values.timeRange);

    const payload: NewScheduleDTO | ExistingScheduleDTO = {
      ...(!newRecord && { scheduleId: schedule?.schedule_id }),
      weekDay: parseInt(values.weekDay),
      section: sectionId?.toString() as string,
      message1: mapMessageToModel(values.message1),
      message2: mapMessageToModel(values.message2),
      message3: mapMessageToModel(values.message3),
      message4: mapMessageToModel(values.message4),
      message5: mapMessageToModel(values.message5),
      route: values.route,
      isDefault: !!schedule?.is_default,
      startTime: !schedule?.is_default
        ? formatLocalToUtcTimeString(values.timeRange[0])
        : null,
      endTime: !schedule?.is_default
        ? formatLocalToUtcTimeString(values.timeRange[1])
        : null,
    };

    mutate(
      async (schedules) => {
        try {
          const { data } = await saveSchedule(payload);
          const schedule = { [data['schedule_id']]: data };
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
      />

      {!schedule?.is_default && (
        <Controller
          control={control}
          name="timeRange"
          render={(props) => (
            <TimeRangePicker
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
        />
      ))}

      <RouteSelectField
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
          {newRecord ? 'Create Schedule' : 'Update Schedule'}
        </Button>
      </div>
    </form>
  );
};

export default SchedulesForm;
