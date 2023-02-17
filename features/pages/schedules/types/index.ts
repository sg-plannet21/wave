import { Version } from 'lib/client/types';

export type Schedule = {
  url: string;
  schedule_id: string;
  versions: Version[];
  week_day: number;
  is_default: boolean;
  start_time: string | null;
  end_time: string | null;
  business_unit: string;
  section: string;
  route: string;
  message_1: number | null;
  message_2: number | null;
  message_3: number | null;
  message_4: number | null;
  message_5: number | null;
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

export type ScheduleDTO = {
  section: Schedule['section'];
  weekDay: Schedule['week_day'];
  message1: Schedule['message_1'];
  message2: Schedule['message_2'];
  message3: Schedule['message_3'];
  message4: Schedule['message_4'];
  message5: Schedule['message_5'];
  route: Schedule['route'];
  isDefault: Schedule['is_default'];
  startTime: Schedule['start_time'];
  endTime: Schedule['end_time'];
};

export type MessageField =
  | 'message1'
  | 'message2'
  | 'message3'
  | 'message4'
  | 'message5';

export type SelectedSchedules = {
  isDefault: boolean;
  schedules: string[];
};
