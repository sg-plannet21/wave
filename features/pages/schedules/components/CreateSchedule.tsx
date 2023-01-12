import { zodResolver } from '@hookform/resolvers/zod';
import { FieldWrapper } from 'components/form/FieldWrapper';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import {
  TimeRange,
  TimeRangeWithLabel,
  createMomentUtc,
  formatLocalToUtcTimeString,
  timeFormat,
  validateRange,
} from 'lib/client/date-utilities';
import _, { Dictionary } from 'lodash';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  useController,
  useForm,
} from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { NewScheduleDTO, saveSchedule } from '../api/saveSchedule';
import { mapMessageToModel } from '../helpers/form-helpers';
import { messageSchema } from '../helpers/schema-helper';
import { MessageField, Schedule, Weekdays } from '../types';

type CreateScheduleProps = {
  onSuccess: () => void;
};

const schema = z
  .object({
    weekDay: z.string().array(),
    timeRange: z.array(z.string()),
    route: z.string().min(1, 'Route is required'),
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

const Checkboxes: React.FC<CheckboxesProps> = ({ options, control, name }) => {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = React.useState(field.value || []);

  return (
    <>
      {options.map((option) => (
        <div key={option} className="flex items-center mb-4">
          <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex-1">
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

const CreateSchedule: React.FC<CreateScheduleProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    query: { sectionId },
  } = useRouter();
  const {
    data: schedules,
    isValidating: isValidatingSchedules,
    mutate,
  } = useCollectionRequest<Schedule>('schedules', { revalidateOnFocus: false });
  const { register, handleSubmit, formState, control, setError } =
    useForm<SchedulesFormValues>({
      defaultValues: {
        weekDay: ['1'],
        timeRange: ['09:00', '17:00'],
        message1: null,
        message2: null,
        message3: null,
        message4: null,
        message5: null,
        route: '',
      },
      resolver: zodResolver(schema),
    });

  async function onSubmit(values: SchedulesFormValues) {
    if (schedules) {
      console.log('not a default schedule - validating');
      const newTimeRange: TimeRange = {
        startTime: createMomentUtc(values.timeRange[0]),
        endTime: createMomentUtc(values.timeRange[1]),
      };

      const existingSchedules: TimeRangeWithLabel[] = Object.values(schedules)
        .filter(
          (sch) =>
            !sch.is_default &&
            sch.section === sectionId &&
            values.weekDay.includes(sch.week_day.toString())
        )
        .map((schedule) => ({
          startTime: createMomentUtc(schedule.start_time as string),
          endTime: createMomentUtc(schedule.end_time as string),
          label: Weekdays[schedule.week_day],
        }));

      console.log('existingSchedules :>> ', existingSchedules);

      const outcome = validateRange(newTimeRange, existingSchedules, {
        type: 'time',
        abortEarly: true,
      });

      console.log('outcome', outcome);

      if (!outcome.result) {
        setError('timeRange', { message: outcome.message });
        return;
      }
    }

    setIsLoading(true);
    mutate(
      async (existingSchedules) =>
        Promise.all(
          values.weekDay.map((day) => {
            const payload: NewScheduleDTO = {
              weekDay: parseInt(day),
              section: sectionId?.toString() as string,
              message1: mapMessageToModel(values.message1),
              message2: mapMessageToModel(values.message2),
              message3: mapMessageToModel(values.message3),
              message4: mapMessageToModel(values.message4),
              message5: mapMessageToModel(values.message5),
              route: values.route,
              isDefault: false,
              startTime: formatLocalToUtcTimeString(values.timeRange[0]),
              endTime: formatLocalToUtcTimeString(values.timeRange[1]),
            };
            return saveSchedule(payload);
          })
        )
          .then((values) => {
            const newSchedules: Dictionary<Schedule> = values
              .map(({ data }) => data)
              .reduce((lookup, schedule): Dictionary<Schedule> => {
                lookup[schedule['schedule_id']] = schedule;
                return lookup;
              }, {} as Dictionary<Schedule>);

            onSuccess();
            return { ...existingSchedules, ...newSchedules };
          })
          .catch((error) => {
            console.log('error :>> ', error);
            return schedules;
          })
          .finally(() => setIsLoading(false)),
      { revalidate: false }
    );

    // console.log('payloadList', payloadList);

    console.log('values :>> ', values);
  }

  if (isValidatingSchedules) return <div>Loading..</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto sm:max-w-md space-y-3"
    >
      <FieldWrapper
        label="Schedule Days"
        error={formState.errors['weekDay'] as FieldError | undefined}
      >
        <Checkboxes
          options={['1', '2', '3', '4', '5', '6', '7']}
          control={control}
          name="weekDay"
        />
      </FieldWrapper>

      <Controller
        control={control}
        name="timeRange"
        render={(props) => (
          <TimeRangePicker
            error={formState.errors['timeRange'] as FieldError | undefined}
            label="Time Range"
            value={
              props.field.value.map((time: string) =>
                moment.utc(time, timeFormat)
              ) as [Moment, Moment]
            }
            onChange={(_, timeString) => {
              props.field.onChange(timeString);
            }}
          />
        )}
      />

      {Array.from(Array(5).keys()).map((ele) => (
        <MessageSelectField
          control={control}
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
          Create Schedules
        </Button>
      </div>
    </form>
  );
};

export default CreateSchedule;
