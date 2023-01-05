import {
  TimeRange,
  TimeRangeWithLabel,
  createMomentUtc,
  validateRange,
} from 'lib/client/date-utilities';
import { Schedule, Weekdays } from '../types';

export function validateScheduleRange(
  timeRange: TimeRange,
  schedules: Schedule[]
): { result: true } | { result: false; message: string } {
  const existingSchedules: TimeRangeWithLabel[] = schedules.map((schedule) => ({
    startTime: createMomentUtc(schedule.start_time as string),
    endTime: createMomentUtc(schedule.end_time as string),
    label: Weekdays[schedule.week_day],
  }));

  return validateRange(timeRange, existingSchedules, {
    type: 'time',
    abortEarly: true,
  });
}
