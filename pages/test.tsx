import Button from 'components/buttons/Button';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import TimeRangePicker from 'components/form/TimeRangeField';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import {
  timeFormat,
  TimeRange,
  validateTimeRange,
} from 'lib/client/date-utilities';
import moment from 'moment';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';

import { NextPageWithLayout } from './page';

// type LoginCredentials = {
//   username:string;
//   password:string;
// }

const testTime = moment('6:00', 'HH:mm');

const schedules = [
  { id: 1, startTime: '9:00', endTime: '17:00', day: 1 },
  { id: 2, startTime: '18:00', endTime: '19:00', day: 1 },
  { id: 3, startTime: '7:00', endTime: '19:00', day: 2 },
  { id: 4, startTime: '7:00', endTime: '19:00', day: 2 },
];

const testTimes: TimeRange[] = schedules
  .filter((schedule) => schedule.day === 1)
  .map(({ startTime, endTime }) => ({ startTime, endTime }));

const LoginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  // duration: z
  //   .array(z.any())
  //   .length(2)
  //   .transform((val, ctx) => {
  //     console.log(val);

  //     // start time or end time is between existing schedule
  //     // start time before existing start & end time after existing
  //     console.log(
  //       'local hours',
  //       val.map((date) => moment(date).hours())
  //     );
  //     console.log(
  //       'utc hours',
  //       val.map((date) => moment(date).hours())
  //     );

  //     const newVals = val.map((date) => moment.utc(date).toJSON());
  //     return newVals;
  //   }),
  // duration: z.preprocess(
  //   (val) => (val as Moment[]).map((date) => moment(date).format('HH:mm')),
  //   z.array(z.string()).length(2)
  // ),

  // duration: z.array(z.any()).superRefine((val, ctx) => {
  //   console.log((val[0] as Moment).format('HH:mm'));
  //   if ((val[0] as Moment).isBefore(moment('6:00', 'HH:mm'))) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: `No duplicates allowed. 😡`,
  //     });
  //   }
  // }),
  duration: z.array(z.any()).transform((val, ctx) => {
    // convert moment instances to UTC time
    const utcStartTime = moment.utc(val[0]).format(timeFormat);
    const utcEndTime = moment.utc(val[1]).format(timeFormat);

    const outcome = validateTimeRange(
      { startTime: utcStartTime, endTime: utcEndTime },
      testTimes
    );

    if (!outcome.result) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: outcome.message,
      });
      // This is a special symbol you can use to
      // return early from the transform function.
      // It has type `never` so it does not affect the
      // inferred return type.
      return z.NEVER;
    }

    return [utcStartTime, utcEndTime];
    // return val.map((time) => moment(time).format('HH:mm'));
  }),

  // duration: z
  //   .array(z.any(), { invalid_type_error: 'Date range is required' })
  //   .length(2, 'Date range is required')
  //   .transform((val) => {
  //     console.log(val);
  //     const newVals = val.map((date) => moment(date).toJSON());
  //     return newVals;
  //   }),
});

// const startTime = '09:00'
// const endTime='17:00'
// const momentStartTime = moment.utc().hour()

type LoginCredentials = z.infer<typeof LoginSchema>;

const Test: NextPageWithLayout = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl text-purple-700 leading-5 text-center">
        Example Form
      </h1>
      <Form<LoginCredentials, typeof LoginSchema>
        onSubmit={(data) => console.log(data)}
        schema={LoginSchema}
      >
        {({ register, formState, control }) => (
          <div className="flex flex-col max-w-sm mx-auto">
            <InputField
              registration={register('username')}
              label="Username"
              error={formState.errors['username']}
            />
            <InputField
              registration={register('password')}
              label="Password"
              error={formState.errors['password']}
              type="password"
            />
            <TimeRangePicker
              name="duration"
              // error={formState.errors['duration']}
              error={formState.errors['duration'] as FieldError | undefined}
              // defaultValue={['1:11', '5:55']}
              label="Date Range"
              control={control}
            />
            <Button variant="primary" type="submit" className="w-full">
              Submit
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Test;

Test.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
