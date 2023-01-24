import { Schedule } from 'features/pages/schedules/types';
import useRequest, { Config } from 'state/hooks/useRequest';

export const useSchedule = (
  scheduleId?: string,
  config?: Config<Schedule, string>
) => {
  return useRequest<Schedule, string>(
    scheduleId ? { url: `/schedules/${scheduleId}` } : null,
    { ...config }
  );
};
