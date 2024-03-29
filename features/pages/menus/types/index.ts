import { Version } from 'lib/client/types';

export interface Menu {
  url: string;
  menu_id: string;
  versions: Version[];
  dependencies?: number[];
  menu_name: string;
  max_retries: number;
  business_unit: string;
  menu_message: number;
  opt0_message: number | null;
  opt0_route: string | null;
  opt1_message: number | null;
  opt1_route: string | null;
  opt2_message: number | null;
  opt2_route: string | null;
  opt3_message: number | null;
  opt3_route: string | null;
  opt4_message: number | null;
  opt4_route: string | null;
  opt5_message: number | null;
  opt5_route: string | null;
  opt6_message: number | null;
  opt6_route: string | null;
  opt7_message: number | null;
  opt7_route: string | null;
  opt8_message: number | null;
  opt8_route: string | null;
  opt9_message: number | null;
  opt9_route: string | null;
  no_input_message: number | null;
  no_input_route: string;
  no_match_message: number | null;
  no_match_route: string;
  asterisk_message: number | null;
  asterisk_route: string | null;
  hash_message: number | null;
  hash_route: string | null;
}
