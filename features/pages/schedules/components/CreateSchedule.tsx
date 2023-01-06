import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'components/inputs/button';
import _ from 'lodash';
import React, { useState } from 'react';
import { Control, useController, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SelectedSchedules, Weekdays } from '../types';

type CreateScheduleProps = {
  schedules: SelectedSchedules;
};

const schema = z.object({
  weekDay: z.string().array(),
});

type SchedulesFormValues = z.infer<typeof schema>;

type CheckboxesProps = {
  options: string[];
  control: Control;
  name: string;
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
                // const valueCopy = [...value];

                const valueCopy = _.xor(value, [e.target.value]);
                // const valueCopy = [...value];

                // console.log('e.target.checked :>> ', e.target.checked);
                // console.log('e.target.value :>> ', e.target.value);
                // console.log('valueCopy', valueCopy);

                // update checkbox value
                // valueCopy[index] = e.target.checked ? e.target.value : null;

                // send data to react hook form
                // field.onChange(valueCopy);
                // field.onChange(valueCopy.filter(Boolean))
                field.onChange(valueCopy);

                // update local state
                // setValue(valueCopy.filter(Boolean));
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
  const { handleSubmit, formState, control } = useForm<SchedulesFormValues>({
    defaultValues: {
      weekDay: ['1', '2'],
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
        className="w-full sm:max-w-md space-y-3"
      >
        <section>
          <h2>controlled</h2>
          <Checkboxes
            options={['1', '2', '3', '4', '5', '6', '7']}
            control={control}
            name="weekDay"
          />
        </section>
        {formState.errors['weekDay'] && (
          <div>{formState.errors['weekDay'].message}</div>
        )}

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
