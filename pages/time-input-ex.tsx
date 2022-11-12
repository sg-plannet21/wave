import Button from 'components/buttons/Button';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import TimeRangePicker from 'components/form/TimeRangeField';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import {
  createUtcTimeRange,
  formatDay,
  timeFormat,
  validateRange,
} from 'lib/client/date-utilities';
import { Moment } from 'moment';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';

import { NextPageWithLayout } from './page';

// type LoginCredentials = {
//   username:string;
//   password:string;
// }

const schedules = [
  { id: 1, startTime: '15:00', endTime: '17:00', day: 1 },
  { id: 2, startTime: '18:00', endTime: '19:00', day: 1 },
  { id: 3, startTime: '7:00', endTime: '19:00', day: 2 },
  { id: 4, startTime: '7:00', endTime: '19:00', day: 2 },
];

const LoginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  duration: z.array(z.any()).transform((val, ctx) => {
    const [startTime, endTime] = val as [Moment, Moment];

    // testing
    if (!startTime.isUTC() || !endTime.isUTC())
      throw new Error('Start / End Time is not in UTC format');

    const comparisionTimes = schedules
      .filter((schedule) => schedule.day === 1)
      .map((schedule) => ({
        range: createUtcTimeRange({
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        }) as [Moment, Moment],
        label: formatDay(schedule.day),
      }));

    const outcome = validateRange([startTime, endTime], comparisionTimes);

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

    return [startTime, endTime].map((time) => time.format(timeFormat));
  }),
});

type LoginCredentials = z.infer<typeof LoginSchema>;

const TimeInputExample: NextPageWithLayout = () => {
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
              label="Time Range"
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

export default TimeInputExample;

TimeInputExample.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
