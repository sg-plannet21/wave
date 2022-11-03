import { FieldError } from 'react-hook-form';
import { z } from 'zod';
import Button from '../components/buttons/Button';
import { Form } from '../components/form/Form';
import { InputField } from '../components/form/InputField';
import TimeRangePicker from '../components/form/TimeRangeField';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { generateTimeRange } from '../lib/client/date-utilities';

import { NextPageWithLayout } from './page';

// type LoginCredentials = {
//   username:string;
//   password:string;
// }

const LoginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  duration: z.array(z.any()).length(2),
  // duration: z.preprocess(
  //   (val) => (val as Moment[]).map((date) => moment(date).toJSON()),
  //   z.array(z.string()).length(2)
  // ),
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

const times = generateTimeRange('4:00', '23:59');
console.log('times', times);

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
              // defaultValue={generateTimeRange('1:11', '5:55')}
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
