import moment, { Moment } from 'moment';

export const timeFormat = 'h:mm';

export function generateTimeRange(
  startTime: string,
  endTime: string
): Moment[] {
  const validTimeExp = new RegExp('([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
  const times = [startTime, endTime];
  times.forEach((time) => {
    if (!validTimeExp.test(time))
      throw new Error(`Invalid time format: ${time}.`);
  });
  return times.map((time) => moment(time, timeFormat));
}
