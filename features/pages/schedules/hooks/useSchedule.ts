import useRequest, { Config } from 'state/hooks/useRequest';
import { Schedule } from '../types';

export const useSchedule = (
  scheduleId?: string,
  config?: Config<Schedule, string>
) => {
  return useRequest<Schedule, string>(
    scheduleId ? { url: `/schedules/${scheduleId}` } : null,
    { ...config }
  );
};
