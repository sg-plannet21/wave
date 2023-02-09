import { zodResolver } from '@hookform/resolvers/zod';
import MessageSelectField from 'components/form/MessageSelectField';
import RouteSelectInfoField from 'components/form/RouteSelectInfoField';
import TimeRangePicker from 'components/form/TimeRangeField';
import Button from 'components/inputs/button';
import { Dictionary } from 'lodash';
import moment, { Moment } from 'moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { EntityRoles } from 'state/auth/types';
import { useIsAuthorised } from 'state/hooks/useAuthorisation';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import NotificationContext from 'state/notifications/NotificationContext';
import { z } from 'zod';
import { ExistingScheduleDTO, saveSchedule } from '../api/saveSchedule';
import {
  mapMessageToModel,
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
  publicRuntimeConfig: { timeFormat, serverTimeFormat },
} = getConfig();

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
  const isDefaultSchedule = type === 'default';
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
  const { addNotification } = useContext(NotificationContext);

  const { isSuperUser, hasWriteAccess } = useIsAuthorised([
    EntityRoles.Schedules,
  ]);

  const hasWritePermissions = isSuperUser || hasWriteAccess;

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
    } = schedules[Array.isArray(id) ? id[0] : id];

    reset({
      timeRange: [
        moment.utc(start_time, serverTimeFormat).format(timeFormat) ?? '0:00',
        moment.utc(end_time, serverTimeFormat).format(timeFormat) ?? '0:00',
      ],
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
    if (!schedules || !id) return;
    console.log('values', values);

    if (!isDefaultSchedule && Array.isArray(id)) {
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

    setIsLoading(true);

    const idList = Array.isArray(id) ? id : [id];

    mutate(
      async (existingSchedules) =>
        Promise.all(
          idList.map((scheduleId) => {
            const payload: ExistingScheduleDTO = {
              scheduleId,
              section: sectionId?.toString() as string,
              startTime: !isDefaultSchedule ? values.timeRange[0] : null,
              endTime: !isDefaultSchedule ? values.timeRange[1] : null,
              message1: mapMessageToModel(values.message1),
              message2: mapMessageToModel(values.message2),
              message3: mapMessageToModel(values.message3),
              message4: mapMessageToModel(values.message4),
              message5: mapMessageToModel(values.message5),
              weekDay: schedules[scheduleId].week_day,
              route: values.route,
              isDefault: schedules[scheduleId].is_default,
            };
            return saveSchedule(payload);
          })
        )
          .then((responseCollection) => {
            const updatedSchedules: Dictionary<Schedule> =
              reduceSchedulesResponse(responseCollection);

            const weekdayLabels = Object.values(updatedSchedules)
              .map((schedule) => schedule.week_day)
              .map((weekDay) => Weekdays[weekDay]);

            addNotification({
              title: 'Schedules Updated',
              message: `Updated ${isDefaultSchedule ? 'Default' : 'Custom'} ${
                weekdayLabels.length > 1 ? 'schedules' : 'schedule'
              } for ${formatWeekdaysString(weekdayLabels)}.`,
              type: 'success',
              duration: 5000,
            });

            onSuccess();
            return { ...existingSchedules, ...updatedSchedules };
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
      {!isDefaultSchedule && (
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
      )}

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

      <RouteSelectInfoField
        control={control}
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
          Update Schedules
        </Button>
      </div>
    </form>
  );
};

export default EditSchedule;
