import { zodResolver } from '@hookform/resolvers/zod';
import { FieldWrapper } from 'components/form/FieldWrapper';
import MessageSelectField from 'components/form/MessageSelectField';
import Button from 'components/inputs/button';
import _ from 'lodash';
import React, { useState } from 'react';
import { Control, FieldError, useController, useForm } from 'react-hook-form';
import { z } from 'zod';
import { messageSchema } from '../helpers/schema-helper';
import { MessageField, SelectedSchedules, Weekdays } from '../types';

type CreateScheduleProps = {
  schedules: SelectedSchedules;
};

const schema = z
  .object({
    weekDay: z.string().array(),
  })
  .merge(messageSchema)
  .superRefine((data, ctx) => {
    if (!data.weekDay.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekDay'],
        message: 'At least one weekday is required.',
      });
    }
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

type CheckboxesProps = {
  options: string[];
  control: Control<SchedulesFormValues>;
  name: 'weekDay';
};

const Checkboxes = ({ options, control, name }: CheckboxesProps) => {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = React.useState(field.value || []);

  return (
    <>
      {options.map((option) => (
        <div key={option} className="flex items-center mb-4">
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            <input
              onChange={(e) => {
                const valueCopy = _.xor(value, [e.target.value]);

                // send data to react hook form
                field.onChange(valueCopy);

                // update local state
                setValue(valueCopy);
              }}
              key={option}
              type="checkbox"
              checked={value.includes(option)}
              value={option}
              className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            {Weekdays[parseInt(option)]}
          </label>
        </div>
      ))}
    </>
  );
};

const CreateSchedule: React.FC<CreateScheduleProps> = ({ schedules }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState, control } =
    useForm<SchedulesFormValues>({
      defaultValues: {
        weekDay: ['1', '2'],
        message1: null,
        message2: null,
        message3: null,
        message4: null,
        message5: null,
      },
      resolver: zodResolver(schema),
    });

  async function onSubmit(values: SchedulesFormValues) {
    setIsLoading(true);
    console.log('values :>> ', values);
    setIsLoading(false);
  }

  if (!schedules) return <div>No Schedules</div>;

  return (
    <div>
      <h4>{schedules.isDefault ? 'Default' : 'Custom'}</h4>
      <ul>
        {schedules.schedules.map((scheduleId) => (
          <li key={scheduleId}>{scheduleId}</li>
        ))}
      </ul>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto sm:max-w-md space-y-3"
      >
        <FieldWrapper
          label="Weekdays"
          error={formState.errors['weekDay'] as FieldError | undefined}
        >
          <Checkboxes
            options={['1', '2', '3', '4', '5', '6', '7']}
            control={control}
            name="weekDay"
          />
        </FieldWrapper>

        {Array.from(Array(5).keys()).map((ele) => (
          <MessageSelectField
            control={control}
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
            Create Schedules
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSchedule;
