import { Version } from 'lib/client/types';
import { DeserialiseEntityReturn, DeserializedData } from '../types';

export function deserialiseEntity<Entity extends { versions: Version[] }>(
  versions: Version[]
): Array<DeserialiseEntityReturn<Entity>> {
  return versions.map(({ change_date, change_user, fields }, index) => {
    const deserialised: DeserializedData<Entity>[] = JSON.parse(
      fields.serialized_data
    );

    return {
      version: index,
      changeDate: change_date,
      changeUser: change_user,
      ...deserialised[0].fields,
    };
  });
}
