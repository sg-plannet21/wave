import { zodResolver } from '@hookform/resolvers/zod';
import Button from 'components/inputs/button';
import { useState } from 'react';
import { UseFormRegisterReturn, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SelectedSchedules, Weekdays } from '../types';

type CreateScheduleProps = {
  schedules: SelectedSchedules;
};

const schema = z
  .object({
    weekDay: z
      .object({ name: z.string(), day: z.number(), value: z.boolean() })
      .array()
      .min(1),
    // weekDay: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.weekDay.some((day) => day.value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekDay'],
        message: 'At least one weekday is required.',
      });
    }
  });

type SchedulesFormValues = z.infer<typeof schema>;

function Checkbox({
  label,
  registration,
}: {
  label: string;
  registration: Partial<UseFormRegisterReturn>;
}) {
  return (
    <div className="flex items-center mb-4">
      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        <input
          type="checkbox"
          {...registration}
          className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        {label}
      </label>
    </div>
  );
}

const CreateSchedule: React.FC<CreateScheduleProps> = ({ schedules }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState, control } =
    useForm<SchedulesFormValues>({
      defaultValues: {
        weekDay: [
          { name: 'Monday', day: 1, value: true },
          { name: 'Tuesday', day: 2, value: false },
          { name: 'Wednesday', day: 3, value: true },
          { name: 'Thursday', day: 4, value: true },
          { name: 'Friday', day: 5, value: false },
          { name: 'Saturday', day: 6, value: false },
          { name: 'Sunday', day: 7, value: false },
        ],
      },
      resolver: zodResolver(schema),
    });

  const { fields } = useFieldArray({
    name: 'weekDay', // unique name for your Field Array
    control, // control props comes from useForm (optional: if you are using FormContext)
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
        {/* {Array.from(Array(7).keys()).map((day) => (
          <Checkbox
            key={String(day + 1)}
            registration={register('weekDay')}
            label={Weekdays[day + 1]}
            value={String(day + 1)}
          />
        ))} */}

        {fields.map((field, index) => (
          <Checkbox
            key={field.id} // important to include key with field's id
            label={Weekdays[field.day]}
            registration={register(`weekDay.${index}.value`)}
          />
        ))}
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
