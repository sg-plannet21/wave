import { Version } from 'lib/client/types';

export interface EntryPoint {
  url: string;
  entry_point_id: string;
  versions: Version[];
  dependencies?: string;
  cc_entry_point_id: string;
  entry_point: string;
  address: string;
  eir_code: string;
  business_unit: string;
  region: number;
  section: string;
}
