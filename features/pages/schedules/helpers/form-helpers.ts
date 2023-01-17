import { AxiosResponse } from 'axios';
import { formatUtcTime } from 'lib/client/date-utilities';
import { Dictionary } from 'lodash';
import { ExistingScheduleDTO, NewScheduleDTO } from '../api/saveSchedule';
import { Schedule } from '../types';
import { BaseSchema } from './schema-helper';

export function mapMessageToModel(message: string | null): number | null {
  return message ? parseInt(message) : null;
}

type MapToViewModel = BaseSchema & {
  sectionId: string;
  weekDay: string;
  scheduleId?: string;
  isDefault: boolean;
};

export function mapToViewModel(
  values: MapToViewModel,
  newRecord: boolean
): NewScheduleDTO | ExistingScheduleDTO {
  const payload: NewScheduleDTO | ExistingScheduleDTO = {
    ...(!newRecord && { scheduleId: values?.scheduleId }),
    weekDay: parseInt(values.weekDay),
    section: values.sectionId,
    message1: mapMessageToModel(values.message1),
    message2: mapMessageToModel(values.message2),
    message3: mapMessageToModel(values.message3),
    message4: mapMessageToModel(values.message4),
    message5: mapMessageToModel(values.message5),
    route: values.route,
    isDefault: values.isDefault,
    startTime: !values.isDefault ? formatUtcTime(values.timeRange[0]) : null,
    endTime: !values.isDefault ? formatUtcTime(values.timeRange[1]) : null,
  };

  return payload;
}

export function reduceSchedulesResponse(
  response: AxiosResponse<Schedule, unknown>[]
): Dictionary<Schedule> {
  const updatedSchedules: Dictionary<Schedule> = response
    .map(({ data }) => data)
    .reduce((lookup, schedule): Dictionary<Schedule> => {
      lookup[schedule['schedule_id']] = schedule;
      return lookup;
    }, {} as Dictionary<Schedule>);
  return updatedSchedules;
}
