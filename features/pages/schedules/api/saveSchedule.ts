import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Schedule, ScheduleDTO } from '../types';

export type NewScheduleDTO = ScheduleDTO;

export type ExistingScheduleDTO = ScheduleDTO & {
  scheduleId: Schedule['schedule_id'];
};

function isExistingSchedule(
  schedule: NewScheduleDTO | ExistingScheduleDTO
): schedule is ExistingScheduleDTO {
  return 'scheduleId' in schedule;
}

function mapScheduleToDTO(
  schedule: NewScheduleDTO | ExistingScheduleDTO
): Partial<Schedule> {
  return {
    ...(isExistingSchedule(schedule) && { schedule_id: schedule.scheduleId }),
    section: schedule.section,
    week_day: schedule.weekDay,
    message_1: schedule.message1,
    message_2: schedule.message2,
    message_3: schedule.message3,
    message_4: schedule.message4,
    message_5: schedule.message5,
    route: schedule.route,
    is_default: schedule.isDefault,
    start_time: schedule.startTime,
    end_time: schedule.endTime,
  };
}

export function saveSchedule(
  data: NewScheduleDTO | ExistingScheduleDTO
): Promise<AxiosResponse<Schedule>> {
  const payload = mapScheduleToDTO(data);
  if (isExistingSchedule(data)) {
    return axios.patch(`/schedules/${data.scheduleId}/`, payload);
  } else {
    return axios.post('/schedules/', payload);
  }
}
