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
  detail: { [key: string]: string[] };
}

export interface WaveError {
  errors: Error[];
}

export type DeleteResponse = null;

// Entity Versioning
interface Fields {
  revision: number;
  object_id: string;
  content_type: number;
  db: string;
  format: string;
  serialized_data: string;
  object_repr: string;
}

export interface Version {
  model: string;
  pk: number;
  fields: Fields;
  change_date: string;
  change_user: string;
}

export interface SerializedData<Entity extends { versions: Version[] }> {
  model: string;
  pk: string;
  fields: Omit<Entity, 'versions'>;
}
