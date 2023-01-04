import { zodResolver } from '@hookform/resolvers/zod';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import { Option, SelectField } from 'components/form/SelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import {
  TimeRange,
  TimeRangeWithLabel,
  timeFormat,
  validateRange,
} from 'lib/client/date-utilities';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { ExistingScheduleDTO, NewScheduleDTO } from '../api/saveSchedule';
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

function mapMessageToModel(message: string | null): number | null {
  return message ? parseInt(message) : null;
}

function getMomentDate(time: string): Moment {
  return moment.utc(time, timeFormat);
}

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
  const { data: schedules, isValidating: isValidatingSchedules } =
    useCollectionRequest<Schedule>('schedules', { revalidateOnFocus: false });
  const { register, handleSubmit, reset, formState, control } =
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
    console.log('resetting :>> ', schedule);
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

  console.log('schedules', schedules);

  async function onSubmit(values: SchedulesFormValues) {
    if (!schedule?.is_default && schedules) {
      console.log('not a default schedule');
      const newTimeRange: TimeRange = {
        startTime: getMomentDate(values.timeRange[0]),
        endTime: getMomentDate(values.timeRange[1]),
      };

      const existingSchedules: TimeRangeWithLabel[] = Object.values(schedules)
        .filter(
          (schedule) =>
            !schedule.is_default &&
            schedule.week_day === parseInt(values.weekDay)
        )
        .map((schedule) => ({
          startTime: moment.utc(schedule.start_time, timeFormat),
          endTime: moment.utc(schedule.end_time),
          label: Weekdays[schedule.week_day],
        }));
      const result = validateRange(newTimeRange, existingSchedules, {
        type: 'time',
        abortEarly: true,
      });
      console.log('result :>> ', result);
    }

    setIsLoading(true);
    console.log('onSubmit');

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
        ? getMomentDate(values.timeRange[0]).format(timeFormat)
        : null,
      endTime: !schedule?.is_default
        ? getMomentDate(values.timeRange[1]).format(timeFormat)
        : null,
    };

    try {
      // await saveSchedule(payload);
      console.log('payload :>> ', payload);
      onSuccess();
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
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
