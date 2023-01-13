import {
  TimeRange,
  TimeRangeWithLabel,
  ValidateRangeOptions,
  createMomentUtc,
  validateRange,
} from 'lib/client/date-utilities';
import { Schedule, Weekdays } from '../types';

type ScheduleFormValues = {
  startTime: string;
  endTime: string;
  sectionId: string;
  scheduleId?: string;
  schedules: Schedule[];
  weekDays: string[];
};

export function validateScheduleRange(
  values: ScheduleFormValues,
  options: ValidateRangeOptions = {
    abortEarly: true,
    type: 'time',
  }
) {
  const newTimeRange: TimeRange = {
    startTime: createMomentUtc(values.startTime),
    endTime: createMomentUtc(values.endTime),
  };

  const existingSchedules: TimeRangeWithLabel[] = values.schedules
    .filter(
      (sch) =>
        !sch.is_default &&
        sch.section === values.sectionId &&
        sch.schedule_id !== values?.scheduleId &&
        values.weekDays.includes(sch.week_day.toString())
    )
    .map((schedule) => ({
      startTime: createMomentUtc(schedule.start_time as string),
      endTime: createMomentUtc(schedule.end_time as string),
      label: Weekdays[schedule.week_day],
    }));

  return validateRange(newTimeRange, existingSchedules, options);
}
