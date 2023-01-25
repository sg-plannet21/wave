import _ from 'lodash';

// Gets the value at path of object. Returns deleted string in case of unresolved proptertyId
export function getVersionObjectValue<T, K extends keyof T>(
  object: T,
  propertyId: keyof T | null,
  path: keyof T[K]
) {
  if (!propertyId) return '';
  const value = _.get(object[propertyId], path);
  return value ? value : '[Deleted Object]';
}
