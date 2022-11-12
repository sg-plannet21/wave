import moment, { Moment } from 'moment';

export type TimeRange = {
  startTime: string;
  endTime: string;
};

export const timeFormat = 'HH:mm';
export const dateFormat = 'DD-MM-YYYY HH:mm';

export function formatDay(dayIndex: number): string {
  if (dayIndex < 1 || dayIndex > 7)
    throw new Error(`Day index out of range: ${dayIndex}`);
  return [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ][dayIndex];
}

function isValidTimeString(time: string): boolean {
  const validTimeExp = new RegExp('([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
  return validTimeExp.test(time);
}

export function createUtcTimeRange({
  startTime,
  endTime,
}: TimeRange): Moment[] {
  const times = [startTime, endTime];
  times.forEach((time) => {
    if (!isValidTimeString(time))
      throw new Error(`Invalid time format: ${time}.`);
  });
  return times.map((time) => moment.utc(time, timeFormat));
}

function displayLocalTime(time: Moment) {
  return moment(time).local().format(timeFormat);
}

export function validateRange(
  timeRange: [Moment, Moment],
  comparator: { range: [Moment, Moment]; label?: string }[],
  abortEarly = true
): { result: true } | { result: false; message: string } {
  const [startTime, endTime] = timeRange;

  if (endTime.isSameOrBefore(startTime)) {
    return { result: false, message: 'Start time must come before end time' };
  }

  let messages: string[] = [];
  let isValidRange = true;

  for (let i = 0; i < comparator.length; i++) {
    const {
      range: [existingStartTime, existingEndTime],
      label,
    } = comparator[i];

    // does the time range enclose the existing range/
    if (
      startTime.isSameOrBefore(existingStartTime) &&
      endTime.isSameOrAfter(existingEndTime)
    ) {
      messages.push(
        `Range encloses existing range: ${
          label ? `${label} -` : ''
        } ${displayLocalTime(existingStartTime)} - ${displayLocalTime(
          existingEndTime
        )}`
      );
      isValidRange = false;
      if (abortEarly) break;
    }

    // is any element of the time range between the existing time range?
    if (
      startTime.isBetween(existingStartTime, existingEndTime) ||
      endTime.isBetween(existingStartTime, existingEndTime)
    ) {
      messages.push(
        `Conflict with existing time range: ${
          label ? `${label} -` : ''
        } ${displayLocalTime(existingStartTime)} - ${displayLocalTime(
          existingEndTime
        )}`
      );
      isValidRange = false;
      if (abortEarly) break;
    }
  }

  return isValidRange
    ? { result: true }
    : { result: false, message: messages.join(' ') };
}

// Date Functions

type DateRange = {
  startDate: string;
  endDate: string;
};

function isValidDateString(date: string) {
  const validDateRegex =
    /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-][01]\d:[0-5]\d)$/;
  return validDateRegex.test(date);
}

export function createUtcDateRange({
  startDate,
  endDate,
}: DateRange): Moment[] {
  const date = [startDate, endDate];
  date.forEach((date) => {
    if (!isValidDateString(date))
      throw new Error(`Invalid date format: ${date}.`);
  });
  return date.map((date) => moment.utc(date));
}
