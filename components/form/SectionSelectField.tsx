import Spinner from 'components/feedback/spinner/Spinner';
import { Section } from 'features/pages/sections/types';
import { useMemo } from 'react';
import useCollectionRequest from 'state/hooks/useCollectionRequest';
import { Option, SelectField, SelectFieldProps } from './SelectField';

const SectionSelectField: React.FC<
  Omit<SelectFieldProps, 'options' | 'groupedOptions'>
> = (props) => {
  const { data: sections, error: sectionsError } =
    useCollectionRequest<Section>('sections', {
      revalidateOnFocus: false,
    });

  const options: Option[] = useMemo(() => {
    if (!sections) return [];

    const defaultOption: Option = {
      label: 'Select Section',
      value: '',
    };

    const options: Option[] = Object.values(sections).map((section) => ({
      label: section.section,
      value: section.section_id,
    }));

    return [defaultOption, ...options];
  }, [sections]);

  if (!options.length)
    return (
      <div className="flex w-full justify-center items-center">
        <Spinner size="sm" />
      </div>
    );

  if (sectionsError) return <div>An Error has occurred</div>;

  return (
    <SelectField
      options={options}
      {...props}
      defaultValue={props.defaultValue ?? options[0].value.toString()}
    />
  );
};

export default SectionSelectField;
