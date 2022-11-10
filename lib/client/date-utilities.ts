import moment, { Moment } from 'moment';

export type TimeRange = {
  startTime: string;
  endTime: string;
};

export const timeFormat = 'HH:mm';

function isValidTimeString(time: string): boolean {
  const validTimeExp = new RegExp('([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
  return validTimeExp.test(time);
}

export function generateTimeRange(
  { startTime, endTime }: TimeRange,
  isUTC = false
): Moment[] {
  const times = [startTime, endTime];
  times.forEach((time) => {
    if (!isValidTimeString(time))
      throw new Error(`Invalid time format: ${time}.`);
  });
  return times.map((time) =>
    isUTC ? moment.utc(time, timeFormat) : moment(time, timeFormat)
  );
}

function displayLocalTime(time: Moment) {
  return moment(time).local().format(timeFormat);
}

export function validateTimeRange(
  utcTimeRange: TimeRange,
  existingUtcRanges: TimeRange[],
  abortEarly = true
): { result: true } | { result: false; message: string } {
  const [startTime, endTime] = generateTimeRange(utcTimeRange, true);

  if (endTime.isSameOrBefore(startTime)) {
    console.log(`Start time must come before end time`);
    return { result: false, message: 'Start time must come before end time' };
  }

  const existingTimes = existingUtcRanges.map((range) =>
    generateTimeRange(range, true)
  );

  let messages: string[] = [];
  let isValidRange = true;

  for (let i = 0; i < existingTimes.length; i++) {
    const [existingStartTime, existingEndTime] = existingTimes[i];

    // does the time range enclose the existing range/
    if (
      startTime.isSameOrBefore(existingStartTime) &&
      endTime.isSameOrAfter(existingEndTime)
    ) {
      messages.push(
        `Time range encloses existing range: ${displayLocalTime(
          existingStartTime
        )} - ${displayLocalTime(existingEndTime)}`
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
        `Time range clashes with existing time range: ${displayLocalTime(
          existingStartTime
        )} - ${displayLocalTime(existingEndTime)}`
      );
      isValidRange = false;
      if (abortEarly) break;
    }
  }

  return isValidRange
    ? { result: true }
    : { result: false, message: messages.join(' ') };
}
