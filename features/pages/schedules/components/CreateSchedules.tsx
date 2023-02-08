import { zodResolver } from '@hookform/resolvers/zod';
import { FieldWrapper } from 'components/form/FieldWrapper';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import _, { Dictionary } from 'lodash';
import moment, { Moment } from 'moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  useController,
  useForm,
} from 'react-hook-form';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { NewScheduleDTO, saveSchedule } from '../api/saveSchedule';
import {
  mapToViewModel,
  reduceSchedulesResponse,
} from '../helpers/form-helpers';
import {
  BaseSchema,
  baseSchema,
  messageValidation,
} from '../helpers/schema-helper';
import { formatWeekdaysString } from '../helpers/utilites';
import { validateScheduleRange } from '../helpers/validation-helper';
import { MessageField, Schedule, Weekdays } from '../types';

const {
  publicRuntimeConfig: { timeFormat },
} = getConfig();

type CheckboxesProps = {
  options: string[];
  control: Control<SchedulesFormValues>;
  name: 'weekDays';
  disabled?: boolean;
};

const Checkboxes: React.FC<CheckboxesProps> = ({
  options,
  control,
  name,
  disabled = false,
}) => {
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
              disabled={disabled}
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

type CreateScheduleProps = {
  onSuccess: () => void;
};

const schema = z
  .object({
    weekDays: z.string().array(),
  })
  .merge(baseSchema)
  .superRefine(messageValidation<BaseSchema>)
  .superRefine((data, ctx) => {
    if (!data.weekDays.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekDay'],
        message: 'At least one weekday is required.',
      });
    }
  });

type SchedulesFormValues = z.infer<typeof schema>;

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
        weekDays: ['1'],
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
  const { addNotification } = useContext(NotificationContext);
  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Schedules,
  ]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

  async function onSubmit(values: SchedulesFormValues) {
    if (schedules) {
      const outcome = validateScheduleRange({
        startTime: values.timeRange[0],
        endTime: values.timeRange[1],
        schedules: Object.values(schedules),
        sectionId: sectionId?.toString() as string,
        weekDays: values.weekDays,
      });

      if (!outcome.result) {
        setError('timeRange', { message: outcome.message });
        return;
      }
    }

    setIsLoading(true);

    mutate(
      async (existingSchedules) =>
        Promise.all(
          values.weekDays.map((weekDay) => {
            const payload: NewScheduleDTO = mapToViewModel(
              {
                ...values,
                weekDay,
                sectionId: sectionId?.toString() as string,
                isDefault: false,
              },
              true
            );
            return saveSchedule(payload);
          })
        )
          .then((responseCollection) => {
            const newSchedules: Dictionary<Schedule> =
              reduceSchedulesResponse(responseCollection);

            const weekdayLabels = values.weekDays
              .sort()
              .map((weekdayIndex) => Weekdays[parseInt(weekdayIndex)]);

            addNotification({
              title: 'Schedules Added',
              message: `Created ${
                values.weekDays.length > 1 ? 'schedules' : 'schedule'
              } for ${formatWeekdaysString(weekdayLabels)}`,
              type: 'success',
              duration: 5000,
            });

            onSuccess();
            return { ...existingSchedules, ...newSchedules };
          })
          .catch((error) => {
            console.log('error :>> ', error);
            return existingSchedules;
          })
          .finally(() => setIsLoading(false)),
      { revalidate: false }
    );
  }

  if (isValidatingSchedules) return <div>Loading..</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto sm:max-w-md space-y-3"
    >
      <FieldWrapper
        label="Schedule Days"
        error={formState.errors['weekDays'] as FieldError | undefined}
      >
        <Checkboxes
          options={['1', '2', '3', '4', '5', '6', '7']}
          control={control}
          name="weekDays"
          disabled={!hasWritePermissions}
        />
      </FieldWrapper>

      <Controller
        control={control}
        name="timeRange"
        render={(props) => (
          <TimeRangePicker
            disabled={!hasWritePermissions}
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
          disabled={!hasWritePermissions}
          control={control}
          key={ele}
          registration={register(`message${ele + 1}` as MessageField)}
          error={formState.errors[`message${ele + 1}` as MessageField]}
          label={`Message ${ele + 1}`}
        />
      ))}
      <RouteSelectField
        disabled={!hasWritePermissions}
        registration={register('route')}
        error={formState.errors['route']}
        label="Route"
      />
      <div>
        <Button
          disabled={!formState.isDirty || isLoading || !hasWritePermissions}
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
