import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { Schedule } from '../types';

export const useSchedule = (
  scheduleId?: string,
  config?: Config<Schedule, WaveError>
) => {
  return useRequest<Schedule, WaveError>(
    scheduleId ? { url: `/schedules/${scheduleId}` } : null,
    config
  );
};
