import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Schedule, ScheduleDTO } from '../types';

export type PatchScheduleDTO = Pick<
  ScheduleDTO,
  | 'section'
  | 'startTime'
  | 'endTime'
  | 'message1'
  | 'message2'
  | 'message3'
  | 'message4'
  | 'message5'
  | 'route'
  | 'weekDay'
> & {
  scheduleId: Schedule['schedule_id'];
};

function mapScheduleToDTO(schedule: PatchScheduleDTO): Partial<Schedule> {
  return {
    schedule_id: schedule.scheduleId,
    section: schedule.section,
    message_1: schedule.message1,
    message_2: schedule.message2,
    message_3: schedule.message3,
    message_4: schedule.message4,
    message_5: schedule.message5,
    route: schedule.route,
    start_time: schedule.startTime,
    end_time: schedule.endTime,
    week_day: schedule.weekDay,
  };
}

export function updateSchedule(
  data: PatchScheduleDTO
): Promise<AxiosResponse<Schedule>> {
  const payload = mapScheduleToDTO(data);
  return axios.patch(`/schedules/${data.scheduleId}/`, payload);
}
