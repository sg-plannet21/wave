import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { Schedule } from '../types';

type CreateScheduleDTO = {
  weekDay: Schedule['week_day'];
  startTime: Schedule['start_time'];
  endTime: Schedule['end_time'];
};

export function createRoute(
  data: CreateScheduleDTO
): Promise<AxiosResponse<Schedule>> {
  return axios.post('/schedules/', {
    week_day: data.weekDay,
    start_time: data.startTime,
    end_time: data.endTime,
  });
}
