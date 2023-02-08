import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Section } from '../types';

export type SectionsTableRecord = {
  id: string;
  name: string;
};

export function useSectionsTableData() {
  const { data: sections, error: sectionsError } =
    useCollectionRequest<Section>('sections');

  const data: SectionsTableRecord[] = useMemo(() => {
    if (!sections) return [];

    return Object.values(sections).map((section) => ({
      id: section.section_id,
      name: section.section,
    }));
  }, [sections]);

  return {
    isLoading: !sections && !sectionsError,
    error: sectionsError,
    data,
  };
}
