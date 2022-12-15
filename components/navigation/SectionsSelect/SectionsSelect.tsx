import { Section as SectionIcon } from 'components/icons';
import Select from 'components/inputs/select';
import { Section } from 'features/pages/sections/types';

import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';

type SectionsSelectProps = {
  // sections: Section[];
};

export type SelectOption = {
  label: React.ReactNode;
  value: string | number | string[];
};

const SectionsSelect: React.FC<SectionsSelectProps> = () => {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<
    SelectOption | undefined
  >(undefined);
  const { data: sections } = useCollectionRequest<Section>('section');

  const handleChange = useCallback(
    (section: SelectOption) => {
      if (!sections) return;

      setSelectedSection(section);

      router.push(`/${router.query.businessUnitId}/schedules/${section.value}`);
    },
    [router, sections]
  );

  const options: SelectOption[] = useMemo(() => {
    if (!sections) return [];

    return Object.values(sections).map((section) => ({
      value: section.section_id,
      label: section.section,
    }));
  }, [sections]);

  useEffect(() => {
    if (!selectedSection && router.query.sectionId) {
      const section = options.find(
        (section) => section.value === router.query.sectionId
      );
      if (section) {
        handleChange(section);
      } else {
        handleChange(options[0]);
      }
    }
  }, [selectedSection, router.query.sectionId, handleChange, options]);

  if (!options.length || !selectedSection) return null;

  return (
    <Select
      options={options}
      selectedOption={selectedSection}
      onChange={handleChange}
      icon={
        <SectionIcon className="text-gray-400 group-hover:text-gray-300 mr-4 flex-shrink-0 h-6 w-6" />
      }
      className="bg-emerald-600 dark:bg-emerald-700"
    />
  );
};

export default SectionsSelect;
