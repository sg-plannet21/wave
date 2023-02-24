import { Version } from 'lib/client/types';

export interface DeserializedData<Entity extends { versions: Version[] }> {
  model: string;
  pk: string;
  fields: Omit<Entity, 'versions'>;
}

export type CommonVersionFields = {
  version: number;
  changeDate: string;
  changeUser: string;
};

export type DeserialiseEntityReturn<Entity> = CommonVersionFields &
  Omit<Entity, 'versions'>;

export type VersionMappings<Entity> = {
  [Property in keyof Entity]: string | number | boolean | null;
};

export type EntityMapping<Entity> = {
  key: keyof CommonVersionFields | keyof Omit<Entity, 'versions'>;
  label: string;
};

export type FormattedToVersionTable<Entity> = CommonVersionFields &
  VersionMappings<Omit<Entity, 'versions' | 'dependencies'>>;
