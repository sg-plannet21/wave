import { Version } from 'lib/client/types';

export interface Queue {
  url: string;
  queue_id: string;
  versions: Version[];
  dependencies?: number[];
  cc_queue_id: string;
  queue_name: string;
  queue_priority: number;
  no_agents_toggle: boolean;
  max_queue_calls_toggle: boolean;
  max_queue_calls_threshold: number | null;
  max_queue_time_toggle: boolean;
  max_queue_time_threshold: number | null;
  callback_toggle: boolean;
  callback_calls_threshold: number | null;
  callback_time_threshold: number | null;
  business_unit: string;
  queue_welcome: number | null;
  queue_message_1: number | null;
  queue_message_2: number | null;
  queue_message_3: number | null;
  queue_message_4: number | null;
  queue_message_5: number | null;
  queue_music: number;
  closed_toggle: boolean;
  closed_message: number | null;
  closed_route: string | null;
  no_agents_message: number | null;
  no_agents_route: string | null;
  max_queue_calls_message: number | null;
  max_queue_calls_route: string | null;
  max_queue_time_message: number | null;
  max_queue_time_route: string | null;
  callback_route: string | null;
  whisper_message: number | null;
}
