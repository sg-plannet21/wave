import { Region } from 'features/pages/business-units/types';
import { Section } from 'features/pages/sections/types';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { EntryPoint } from '../types';

export type EntryPointTableRecord = {
  id: string;
  name: string;
  section: string;
  region: string;
};

export function useEntryPointsTableData() {
  const [sectionExceptionList, setSectionExceptionList] = useState<string[]>(
    []
  );
  const [regionExceptionList, setRegionExceptionList] = useState<string[]>([]);

  const { data: entryPoints, error: entryPointsError } =
    useCollectionRequest<EntryPoint>('entrypoints');
  const { data: sections, error: sectionsError } =
    useCollectionRequest<Section>('sections');
  const { data: regions, error: regionsError } =
    useCollectionRequest<Region>('regions');

  const data: EntryPointTableRecord[] = useMemo(() => {
    if (!entryPoints || !sections || !regions) return [];

    return Object.values(entryPoints).map((entryPoint) => ({
      id: entryPoint.entry_point_id,
      name: entryPoint.entry_point,
      section: _.get(sections[entryPoint.section], 'section'),
      region: _.get(regions[entryPoint.region], 'language_name'),
    }));
  }, [entryPoints, sections, regions]);

  const sectionList: string[] = useMemo(
    () => data.map((entryPoint) => entryPoint.section),
    [data]
  );

  const regionList: string[] = useMemo(
    () => data.map((entryPoint) => entryPoint.region),
    [data]
  );

  const filteredBySection: EntryPointTableRecord[] = useMemo(
    () =>
      data.filter(
        (entryPoint) => !sectionExceptionList.includes(entryPoint.section)
      ),
    [data, sectionExceptionList]
  );

  const filteredData: EntryPointTableRecord[] = useMemo(
    () =>
      filteredBySection.filter(
        (entryPoint) => !regionExceptionList.includes(entryPoint.region)
      ),
    [filteredBySection, regionExceptionList]
  );

  return {
    isLoading:
      (!entryPoints || !sections || !regions) &&
      !entryPointsError &&
      !sectionsError &&
      !regionsError,
    error: entryPointsError,
    data: filteredData,
    filters: {
      sectionList,
      sectionExceptionList,
      setSectionExceptionList,
      regionList,
      regionExceptionList,
      setRegionExceptionList,
    },
  };
}
