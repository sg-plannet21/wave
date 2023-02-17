import { WaveError } from 'lib/client/types';
import useRequest, { Config } from 'state/hooks/useRequest';
import { ScheduleException } from '../types';

export const useScheduleException = (
  scheduleExceptionId?: string,
  config?: Config<ScheduleException, WaveError>
) => {
  return useRequest<ScheduleException, WaveError>(
    scheduleExceptionId
      ? { url: `/scheduleexceptions/${scheduleExceptionId}` }
      : null,
    config
  );
};
