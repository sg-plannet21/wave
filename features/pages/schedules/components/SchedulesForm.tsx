import { Form } from 'components/form/Form';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import { Option, SelectField } from 'components/form/SelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import { timeFormat } from 'lib/client/date-utilities';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';
import {
  ExistingScheduleDTO,
  NewScheduleDTO,
  saveSchedule,
} from '../api/saveSchedule';
import { useSchedule } from '../hooks/useSchedule';
import { Weekdays } from '../types';

// const timeValidation = (
//   val: Moment[],
//   ctx: z.RefinementCtx,
//   schedules: Schedule[],
//   day: Weekdays
// ) => {
//   const [startTime, endTime] = val;

//   // testing
//   if (!startTime.isUTC() || !endTime.isUTC())
//     throw new Error('Start / End Time is not in UTC format');

//   const comparisionTimes = schedules
//     .filter((schedule) => !schedule.is_default && schedule.week_day === day)
//     .map((schedule) => ({
//       range: createUtcTimeRange({
//         startTime: schedule.start_time as string,
//         endTime: schedule.end_time as string,
//       }) as [Moment, Moment],
//       label: Weekdays[schedule.week_day],
//     }));

//   const outcome = validateRange([startTime, endTime], comparisionTimes, {
//     type: 'time',
//   });

//   if (!outcome.result) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: outcome.message,
//     });
//     // This is a special symbol you can use to
//     // return early from the transform function.
//     // It has type `never` so it does not affect the
//     // inferred return type.
//     return z.NEVER;
//   }

//   return [startTime, endTime].map((time) => time.format(timeFormat));
// };

type SchedulesFormProps = {
  onSuccess: () => void;
  id: string;
};

const weekDayOptions: Option[] = Array.from(Array(7).keys()).map((ele) => ({
  label: Weekdays[ele + 1],
  value: ele + 1,
}));

type MessageField =
  | 'message1'
  | 'message2'
  | 'message3'
  | 'message4'
  | 'message5';

const messageSchema = z.object({
  message1: z.nullable(z.string()),
  message2: z.nullable(z.string()),
  message3: z.nullable(z.string()),
  message4: z.nullable(z.string()),
  message5: z.nullable(z.string()),
});

const schema = z
  .object({
    weekDay: z.string().regex(/^[1-7]$/),
    route: z.string().min(1, 'Route is required'),
    timeRange: z.array(z.any()),
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
  const newRecord = id === 'new';
  const {
    query: { sectionId },
  } = useRouter();
  const {
    data: schedule,
    error: scheduleError,
    isValidating,
  } = useSchedule(newRecord ? undefined : id);
  const [isLoading, setIsLoading] = useState(false);

  if (isValidating) return <div>Loading..</div>;

  if (!newRecord && !schedule) return <div>Not found..</div>;

  if (scheduleError) return <div>An error has occurred</div>;

  function mapMessageToModel(message: string | null): number | null {
    return typeof message === 'string' ? parseInt(message) : message;
  }

  async function handleSubmit(values: SchedulesFormValues) {
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
        ? moment.utc(values.timeRange[0]).format(timeFormat)
        : null,
      endTime: !schedule?.is_default
        ? moment.utc(values.timeRange[1]).format(timeFormat)
        : null,
    };

    try {
      await saveSchedule(payload);
      onSuccess();
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form<SchedulesFormValues, typeof schema>
      onSubmit={handleSubmit}
      options={{
        defaultValues: {
          weekDay: schedule?.week_day.toString(),
          timeRange: [
            moment.utc(schedule?.start_time ?? '09:00', timeFormat),
            moment.utc(schedule?.end_time ?? '17:00', timeFormat),
          ],
          message1: schedule?.message_1?.toString(),
          message2: schedule?.message_2?.toString(),
          message3: schedule?.message_3?.toString(),
          message4: schedule?.message_4?.toString(),
          message5: schedule?.message_5?.toString(),
          route: schedule?.route,
        },
      }}
      schema={schema}
      className="w-full sm:max-w-md"
    >
      {({ register, formState, control }) => (
        <>
          <SelectField
            registration={register('weekDay')}
            error={formState.errors['weekDay']}
            options={weekDayOptions}
          />
          {!schedule?.is_default && (
            <TimeRangePicker
              name="timeRange"
              error={formState.errors['timeRange'] as FieldError | undefined}
              label="Time Range"
              control={control}
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
        </>
      )}
    </Form>
  );
};

export default SchedulesForm;
