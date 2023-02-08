import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { EntryPoint } from '../types';

export type EntryPointTableRecord = {
  id: string;
  name: string;
};

export function useUnassignedEntryPoints() {
  const { data: unassignedEntryPoints, error: unassignedEntryPointsError } =
    useCollectionRequest<EntryPoint>('entrypoints_unassigned');

  const data: EntryPointTableRecord[] = useMemo(() => {
    if (!unassignedEntryPoints) return [];

    return Object.values(unassignedEntryPoints).map((entryPoint) => ({
      id: entryPoint.entry_point_id,
      name: entryPoint.entry_point,
    }));
  }, [unassignedEntryPoints]);

  return {
    isLoading: !unassignedEntryPoints && !unassignedEntryPointsError,
    error: unassignedEntryPointsError,
    data,
  };
}
