import {
  createUtcTimeRange,
  timeFormat,
  validateRange,
} from 'lib/client/date-utilities';
import { Moment } from 'moment';
import { z } from 'zod';
import { Schedule, Weekdays } from '../types';

export const messageSchema = z.object({
  message1: z.nullable(z.string()),
  message2: z.nullable(z.string()),
  message3: z.nullable(z.string()),
  message4: z.nullable(z.string()),
  message5: z.nullable(z.string()),
});

export const timeValidation = (
  val: Moment[],
  ctx: z.RefinementCtx,
  schedules: Schedule[],
  day: Weekdays
) => {
  const [startTime, endTime] = val;

  // testing
  if (!startTime.isUTC() || !endTime.isUTC())
    throw new Error('Start / End Time is not in UTC format');

  const comparisionTimes = schedules
    .filter((schedule) => !schedule.is_default && schedule.week_day === day)
    .map((schedule) => ({
      range: createUtcTimeRange({
        startTime: schedule.start_time as string,
        endTime: schedule.end_time as string,
      }) as [Moment, Moment],
      label: Weekdays[schedule.week_day],
    }));

  const outcome = validateRange([startTime, endTime], comparisionTimes, {
    type: 'time',
  });

  if (!outcome.result) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: outcome.message,
    });
    // This is a special symbol you can use to
    // return early from the transform function.
    // It has type `never` so it does not affect the
    // inferred return type.
    return z.NEVER;
  }

  return [startTime, endTime].map((time) => time.format(timeFormat));
};
