import { AxiosResponse } from 'axios';
import { axios } from 'lib/client/axios';
import { ScheduleException } from '../types';

type NewScheduleExceptionDto = {
  description: ScheduleException['description'];
  section: ScheduleException['section'];
  route: ScheduleException['route'];
  startTime: ScheduleException['start_time'];
  endTime: ScheduleException['end_time'];
  message1: string | null;
  message2: string | null;
  message3: string | null;
  message4: string | null;
  message5: string | null;
};

type ExistingScheduleDto = NewScheduleExceptionDto & {
  id: ScheduleException['schedule_exception_id'];
};

function isExistingException(
  scheduleException: NewScheduleExceptionDto | ExistingScheduleDto
): scheduleException is ExistingScheduleDto {
  return 'id' in scheduleException;
}

function mapMessageToDto(message: string | null): number | null {
  return message ? parseInt(message) : null;
}

function mapExceptionToDto(
  scheduleException: NewScheduleExceptionDto | ExistingScheduleDto
): Partial<ScheduleException> {
  return {
    ...(isExistingException(scheduleException) && {
      schedule_exception_id: scheduleException.id,
    }),
    start_time: scheduleException.startTime,
    end_time: scheduleException.endTime,
    description: scheduleException.description,
    section: scheduleException.section,
    route: scheduleException.route,
    message_1: mapMessageToDto(scheduleException.message1),
    message_2: mapMessageToDto(scheduleException.message2),
    message_3: mapMessageToDto(scheduleException.message3),
    message_4: mapMessageToDto(scheduleException.message4),
    message_5: mapMessageToDto(scheduleException.message5),
  };
}

export function saveScheduleException(
  data: NewScheduleExceptionDto | ExistingScheduleDto
): Promise<AxiosResponse<ScheduleException>> {
  const payload = mapExceptionToDto(data);
  if (isExistingException(data)) {
    return axios.patch(`/scheduleexceptions/${data.id}/`, payload);
  } else {
    return axios.post('/scheduleexceptions/', payload);
  }
}
