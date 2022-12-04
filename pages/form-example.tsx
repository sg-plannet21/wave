import DateRangePicker from 'components/form/DateRangeField';
import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import Button from 'components/inputs/button';
import PrimaryLayout from 'components/layouts/primary/PrimaryLayout';
import { createUtcDateRange, validateRange } from 'lib/client/date-utilities';
import moment, { Moment } from 'moment';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';

import { NextPageWithLayout } from './page';

// type LoginCredentials = {
//   username:string;
//   password:string;
// }

const startDate = moment.utc().subtract(1, 'day').hours(9);
const endDate = moment(startDate).add(2, 'days').hours(18);

const startDate2 = moment(startDate).add(5);
const endDate2 = moment(startDate2).add(1);

const schedules = [
  {
    id: 1,
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
    label: 'Holiday 1',
  },
  {
    id: 4,
    startDate: startDate2.toJSON(),
    endDate: endDate2.toJSON(),
    label: 'Holiday 2',
  },
];

const LoginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  duration: z.array(z.any()).transform((val, ctx) => {
    const [startTime, endTime] = val as [Moment, Moment];

    // FormExampleing
    if (!startTime.isUTC() || !endTime.isUTC())
      throw new Error('Start / End Time is not in UTC format');

    const comparisionTimes = schedules.map((schedule) => ({
      range: createUtcDateRange({
        startDate: schedule.startDate,
        endDate: schedule.endDate,
      }) as [Moment, Moment],
      label: schedule.label,
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

    return [startTime, endTime].map((time) => time.toJSON());
  }),
});

type LoginCredentials = z.infer<typeof LoginSchema>;

const FormExample: NextPageWithLayout = () => {
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

export default FormExample;

FormExample.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
