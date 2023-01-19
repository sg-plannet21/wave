export function formatWeekdaysString(days: string[]) {
  return `${
    days.length > 1
      ? `${days.slice(0, days.length - 1).join(', ')} and ${
          days[days.length - 1]
        }`
      : days[0]
  }`;
}
