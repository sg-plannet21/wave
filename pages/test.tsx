import Button from 'components/buttons/Button';
import DateRangePicker from 'components/form/DateRangeField';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { TimeRange } from 'lib/client/date-utilities';
import moment from 'moment';
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

const testTimes: TimeRange[] = schedules
  .filter((schedule) => schedule.day === 1)
  .map(({ startTime, endTime }) => ({ startTime, endTime }));

const LoginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  duration: z.array(z.any()).length(2),
  // duration: z.array(z.any()).transform((val, ctx) => {
  //   const [startTime, endTime] = val.map((momentInstance: Moment) =>
  //     momentInstance.isUTC()
  //       ? momentInstance.format(timeFormat)
  //       : moment.utc(momentInstance).format(timeFormat)
  //   );

  //   const outcome = validateTimeRange({ startTime, endTime }, testTimes);

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

  //   return [startTime, endTime];
  // }),
});

type LoginCredentials = z.infer<typeof LoginSchema>;

const startDate = moment().subtract(1, 'day').toJSON();
const endDate = moment().subtract(2, 'day').toJSON();
console.log('startDate', startDate);
console.log('endDate', endDate);

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
            <DateRangePicker
              name="duration"
              // error={formState.errors['duration']}
              error={formState.errors['duration'] as FieldError | undefined}
              defaultValue={[startDate, endDate]}
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
