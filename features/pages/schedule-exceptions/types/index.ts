import { Version } from 'lib/client/types';

export interface ScheduleException {
  url: string;
  schedule_exception_id: string;
  versions: Version[];
  start_time: string;
  end_time: string;
  description: string;
  business_unit: string;
  section: string;
  route: string;
  message_1: number | null;
  message_2: number | null;
  message_3: number | null;
  message_4: number | null;
  message_5: number | null;
}
