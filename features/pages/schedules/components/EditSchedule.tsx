import { zodResolver } from '@hookform/resolvers/zod';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectField from 'components/form/RouteSelectField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import { timeFormat } from 'lib/client/date-utilities';
import { Dictionary } from 'lodash';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { z } from 'zod';
import { PatchScheduleDTO, updateSchedule } from '../api/updateSchedule';
import { mapMessageToModel } from '../helpers/form-helpers';
import {
  BaseSchema,
  baseSchema,
  messageValidation,
} from '../helpers/schema-helper';
import { validateScheduleRange } from '../helpers/validation-helper';
import { MessageField, Schedule } from '../types';

type EditScheduleProps = {
  onSuccess: () => void;
};

const schema = baseSchema.superRefine(messageValidation<BaseSchema>);

type EditSchedulesFormValues = z.infer<typeof schema>;

const EditSchedule: React.FC<EditScheduleProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    query: { type, id, sectionId },
  } = useRouter();
  const customSchedule = type === 'custom';
  const {
    data: schedules,
    isValidating: isValidatingSchedules,
    mutate,
  } = useCollectionRequest<Schedule>('schedules', { revalidateOnFocus: false });
  const { register, handleSubmit, formState, control, reset, setError } =
    useForm<EditSchedulesFormValues>({
      defaultValues: {
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

  useEffect(() => {
    if (!schedules || !id?.length) return;
    const {
      start_time,
      end_time,
      message_1,
      message_2,
      message_3,
      message_4,
      message_5,
      route,
    } = schedules[id[0]];

    reset({
      timeRange: [start_time ?? '0:00', end_time ?? '0:00'],
      message1: message_1?.toString(),
      message2: message_2?.toString(),
      message3: message_3?.toString(),
      message4: message_4?.toString(),
      message5: message_5?.toString(),
      route,
    });
  }, [schedules, id, reset]);

  async function onSubmit(values: EditSchedulesFormValues) {
    // schedules are required to extract the weekday
    if (!schedules) return;

    setIsLoading(true);

    if (customSchedule && Array.isArray(id)) {
      if (
        id.some((scheduleId) => {
          const outcome = validateScheduleRange({
            startTime: values.timeRange[0],
            endTime: values.timeRange[1],
            schedules: Object.values(schedules),
            scheduleId,
            sectionId: sectionId?.toString() as string,
            weekDays: [schedules[scheduleId].week_day.toString()],
          });

          if (!outcome.result) {
            setError('timeRange', { message: outcome.message });
            return true;
          }

          return false;
        })
      ) {
        // validation failed
        return;
      }
    }

    if (Array.isArray(id)) {
      mutate(
        async (existingSchedules) =>
          Promise.all(
            id.map((scheduleId) => {
              const payload: PatchScheduleDTO = {
                scheduleId,
                section: sectionId?.toString() as string,
                startTime: customSchedule ? values.timeRange[0] : null,
                endTime: customSchedule ? values.timeRange[1] : null,
                message1: mapMessageToModel(values.message1),
                message2: mapMessageToModel(values.message2),
                message3: mapMessageToModel(values.message3),
                message4: mapMessageToModel(values.message4),
                message5: mapMessageToModel(values.message5),
                weekDay: schedules[scheduleId].week_day,
                route: values.route,
              };
              return updateSchedule(payload);
            })
          )
            .then((values) => {
              const updatedSchedules: Dictionary<Schedule> = values
                .map(({ data }) => data)
                .reduce((lookup, schedule): Dictionary<Schedule> => {
                  lookup[schedule['schedule_id']] = schedule;
                  return lookup;
                }, {} as Dictionary<Schedule>);

              onSuccess();
              return { ...existingSchedules, ...updatedSchedules };
            })
            .catch((error) => {
              console.log('error :>> ', error);
              return schedules;
            })
            .finally(() => setIsLoading(false)),
        { revalidate: false }
      );
    }
  }

  if (isValidatingSchedules) return <div>Loading..</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto sm:max-w-md space-y-3"
    >
      {customSchedule && (
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
      )}

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
          Update Schedules
        </Button>
      </div>
    </form>
  );
};

export default EditSchedule;
