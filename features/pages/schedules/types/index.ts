type SystemSchedule = {
  is_default: true;
  start_time: null;
  end_time: null;
};

type CustomSchedule = {
  is_default: false;
  start_time: string;
  end_time: string;
};

export type Schedule = (SystemSchedule | CustomSchedule) & {
  url: string;
  schedule_id: string;
  versions: number[];
  week_day: number;
  // is_default: boolean;
  // start_time?: string;
  // end_time?: string;
  business_unit: string;
  section: string;
  route: string;
  message_1?: string;
  message_2?: string;
  message_3?: string;
  message_4?: string;
  message_5?: string;
};

export enum Weekdays {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}
