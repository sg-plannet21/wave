import { Form } from 'components/form/Form';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import { Option, SelectField } from 'components/form/SelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import { timeFormat } from 'lib/client/date-utilities';
import moment from 'moment';
import { useState } from 'react';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';
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
  message1: z.string(),
  message2: z.string(),
  message3: z.string(),
  message4: z.string(),
  message5: z.string(),
});

const schema = z
  .object({
    weekDay: z
      .string()
      .regex(/^[1-7]$/)
      .transform(Number),
    route: z.string().min(1, 'Route is required'),
    timeRange: z.array(z.any()),
  })
  .merge(messageSchema.partial())
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
        message: 'At least one message must be selected',
      });
    }
  });

type SchedulesFormValues = z.infer<typeof schema>;

const SchedulesForm: React.FC<SchedulesFormProps> = ({ id, onSuccess }) => {
  const { data: schedule, error: scheduleError } = useSchedule(id);
  const [isLoading, setIsLoading] = useState(false);
  const newRecord = id === 'new';

  if (!newRecord && !schedule) return <div>Loading..</div>;
  if (scheduleError) return <div>An error has occurred</div>;

  console.log('schedule :>> ', schedule);
  console.log('start_time :>> ', schedule?.start_time);
  console.log('end_time :>> ', schedule?.end_time);

  return (
    <div>
      <h1>Schedules Form - {id}</h1>
      <Form<SchedulesFormValues, typeof schema>
        onSubmit={async (values) => {
          setIsLoading(true);
          console.log('onSubmut');
          console.log(values);
          setIsLoading(false);
          onSuccess();
        }}
        options={{
          defaultValues: {
            weekDay: schedule?.week_day,
            timeRange: [
              moment(schedule?.start_time ?? '09:00', timeFormat),
              moment(schedule?.end_time ?? '17:00', timeFormat),
            ],
            message1: schedule?.message_1,
            message2: schedule?.message_2,
            message3: schedule?.message_3,
            message4: schedule?.message_4,
            message5: schedule?.message_5,
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
            {schedule && !schedule.is_default && (
              <TimeRangePicker
                name="timeRange"
                error={formState.errors['timeRange'] as FieldError | undefined}
                label="Time Range"
                control={control}
              />
            )}
            {Array.from(Array(5).keys()).map((ele) => (
              <MessageSelectField
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
    </div>
  );
};

export default SchedulesForm;
