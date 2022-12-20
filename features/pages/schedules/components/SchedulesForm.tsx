import { Form } from 'components/form/Form';
import { InputField } from 'components/form/InputField';
import { Option, SelectField } from 'components/form/SelectField';
import Button from 'components/inputs/button';
import { useState } from 'react';
import { z } from 'zod';
import { Weekdays } from '../types';

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
  message1: z.string().min(1, 'At least one message is required.'),
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
  })
  .merge(messageSchema);

type SchedulesFormValues = z.infer<typeof schema>;

const SchedulesForm: React.FC<SchedulesFormProps> = ({ id, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const newRecord = id === 'new';

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
        schema={schema}
        className="w-full sm:max-w-md"
      >
        {({ register, formState }) => (
          <>
            <SelectField
              registration={register('weekDay')}
              error={formState.errors['weekDay']}
              options={weekDayOptions}
            />
            {Array.from(Array(5).keys()).map((ele) => (
              <InputField
                key={ele}
                registration={register(`message${ele + 1}` as MessageField)}
                error={formState.errors[`message${ele + 1}` as MessageField]}
                label={`Message ${ele + 1}`}
              />
            ))}
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
