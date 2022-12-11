export interface ApiCollectionResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

interface Error {
  status: number;
  source: {
    pointer: string;
  };
  title: string;
  detail: { business_unit: string[] };
}

export interface WaveError {
  errors: Error[];
}
